export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    if (typeof window !== 'undefined') {
      // If the configured env URL contains localhost, but we are accessing via a local network IP (mobile testing)
      if (envUrl.includes('localhost') && window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app')) {
        return envUrl.replace('localhost', window.location.hostname);
      }
    }
    return envUrl;
  }
  
  // Fallbacks if env is not defined
  if (typeof window !== 'undefined') {
    // If accessing via localhost or local network IP, fall back to local backend on port 5000
    const host = window.location.hostname;
    if (host === 'localhost' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
      return `http://${host}:5000`;
    }
  }
  
  // Production fallback
  return 'https://milgan-backend.onrender.com';
}
