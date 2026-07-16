const AUTH_BACKOFF_FACTOR = parseInt(process.env.AUTH_LIMIT_BACKOFF_FACTOR_MS || '2000', 10);
const AUTH_MAX_BACKOFF = parseInt(process.env.AUTH_LIMIT_MAX_BACKOFF_MS || '900000', 10);

const PUBLIC_WINDOW = parseInt(process.env.PUBLIC_LIMIT_WINDOW_MS || '60000', 10);
const PUBLIC_MAX = parseInt(process.env.PUBLIC_LIMIT_MAX || '30', 10);

const AUTH_ACTION_WINDOW = parseInt(process.env.AUTH_ACTION_LIMIT_WINDOW_MS || '60000', 10);
const AUTH_ACTION_MAX = parseInt(process.env.AUTH_ACTION_LIMIT_MAX || '120', 10);

// In-memory failure stores for auth: maps key (IP or Email/Phone) -> { failures: number, blockUntil: timestamp, lastAttempt: timestamp }
const authFailures = new Map();

// General rate limiter store: maps key -> array of timestamps
const rateStore = new Map();

// Helper to cleanup stores periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of authFailures.entries()) {
    if (val.blockUntil < now && now - val.lastAttempt > AUTH_MAX_BACKOFF * 2) {
      authFailures.delete(key);
    }
  }
  for (const [key, timestamps] of rateStore.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < Math.max(PUBLIC_WINDOW, AUTH_ACTION_WINDOW));
    if (validTimestamps.length === 0) {
      rateStore.delete(key);
    } else {
      rateStore.set(key, validTimestamps);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Exponential backoff calculator.
 * Block time is AUTH_BACKOFF_FACTOR * 2^(failures - 1)
 */
function getBlockDuration(failures) {
  if (failures <= 0) return 0;
  const duration = AUTH_BACKOFF_FACTOR * Math.pow(2, failures - 1);
  return Math.min(duration, AUTH_MAX_BACKOFF);
}

/**
 * Auth Rate Limiter with per-IP and per-account limits, combined with exponential backoff on failure.
 */
function authRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const email = req.body.email ? String(req.body.email).trim().toLowerCase() : null;
  const phone = req.body.phone ? String(req.body.phone).trim().replace(/\D/g, '') : null;
  
  const now = Date.now();
  const keys = [ip];
  if (email) keys.push(`email:${email}`);
  if (phone) keys.push(`phone:${phone}`);

  // Check if any key is currently blocked
  for (const key of keys) {
    const record = authFailures.get(key);
    if (record && record.blockUntil > now) {
      const waitTimeSec = Math.ceil((record.blockUntil - now) / 1000);
      return res.status(429).json({
        error: `Too many failed attempts. Please wait ${waitTimeSec} seconds before trying again.`
      });
    }
  }

  // Intercept the response to check if the request was successful
  const originalJson = res.json;
  const originalSend = res.send;

  function handleResponse(statusCode) {
    if (statusCode >= 400) {
      // Login failed - increment failure counter for all keys (IP, email/phone)
      keys.forEach(key => {
        const record = authFailures.get(key) || { failures: 0, blockUntil: 0 };
        record.failures += 1;
        const blockDuration = getBlockDuration(record.failures);
        record.blockUntil = Date.now() + blockDuration;
        record.lastAttempt = Date.now();
        authFailures.set(key, record);
      });
    } else {
      // Login succeeded - clear failure records
      keys.forEach(key => {
        authFailures.delete(key);
      });
    }
  }

  res.json = function(body) {
    handleResponse(res.statusCode);
    return originalJson.apply(this, arguments);
  };

  res.send = function(body) {
    handleResponse(res.statusCode);
    return originalSend.apply(this, arguments);
  };

  next();
}

/**
 * Standard public endpoint sliding-window rate limiter per IP.
 */
function publicRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  const timestamps = rateStore.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < PUBLIC_WINDOW);

  if (validTimestamps.length >= PUBLIC_MAX) {
    return res.status(429).json({
      error: 'Too many requests on public endpoints. Please slow down.'
    });
  }

  validTimestamps.push(now);
  rateStore.set(ip, validTimestamps);
  next();
}

/**
 * Looser authenticated user rate limiter.
 */
function authenticatedRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // Use authorization or user context if available to identify the user
  const userId = req.headers['x-user-id'] || (req.admin && req.admin.id) || (req.user && req.user.id) || ip;
  const now = Date.now();

  const timestamps = rateStore.get(userId) || [];
  const validTimestamps = timestamps.filter(t => now - t < AUTH_ACTION_WINDOW);

  if (validTimestamps.length >= AUTH_ACTION_MAX) {
    return res.status(429).json({
      error: 'Rate limit exceeded for authenticated actions. Please wait a moment.'
    });
  }

  validTimestamps.push(now);
  rateStore.set(userId, validTimestamps);
  next();
}

module.exports = {
  authRateLimiter,
  publicRateLimiter,
  authenticatedRateLimiter
};
