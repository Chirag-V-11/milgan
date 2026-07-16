const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{10,15}$/;
const OTP_REGEX = /^[0-9]{6}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const schemas = {
  adminLogin: {
    email: { type: 'string', required: true, format: 'email', maxLength: 100 },
    password: { type: 'string', required: true, minLength: 6, maxLength: 100 }
  },
  userLogin: {
    phone: { type: 'string', required: true, minLength: 10, maxLength: 15 },
    password: { type: 'string', required: true, minLength: 6, maxLength: 100 }
  },
  forgotPassword: {
    email: { type: 'string', required: true, format: 'email', maxLength: 100 }
  },
  resetPassword: {
    email: { type: 'string', required: true, format: 'email', maxLength: 100 },
    otp: { type: 'string', required: true, format: 'otp' },
    newPassword: { type: 'string', required: true, minLength: 6, maxLength: 100 }
  },
  registerOtp: {
    name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
    phone: { type: 'string', required: true, format: 'phone', minLength: 10, maxLength: 15 },
    email: { type: 'string', required: true, format: 'email', maxLength: 100 },
    address: { type: 'string', required: true, minLength: 5, maxLength: 300 },
    password: { type: 'string', required: true, minLength: 6, maxLength: 100 }
  },
  verifyRegisterOtp: {
    email: { type: 'string', required: true, format: 'email', maxLength: 100 },
    otp: { type: 'string', required: true, format: 'otp' }
  },
  orderUpload: {
    orderId: { type: 'string', required: false, maxLength: 50 },
    productId: { type: 'string', required: false, maxLength: 50 },
    customerName: { type: 'string', required: true, minLength: 2, maxLength: 50 },
    mobile: { type: 'string', required: true, minLength: 10, maxLength: 15 },
    email: { type: 'string', required: false, format: 'email', maxLength: 100 },
    address: { type: 'string', required: true, minLength: 5, maxLength: 300 },
    city: { type: 'string', required: true, minLength: 2, maxLength: 100 },
    pincode: { type: 'string', required: true, format: 'pincode' },
    state: { type: 'string', required: true, minLength: 2, maxLength: 100 },
    description: { type: 'string', required: true, minLength: 2, maxLength: 500 },
    declaredValue: { type: 'number', required: true, min: 0 },
    paymentMethod: { type: 'string', required: true, enum: ['COD', 'UPI', 'WhatsApp', 'whatsapp', 'cod', 'upi', 'WhatsApp Order'] },
    weight: { type: 'string', required: false, maxLength: 20 },
    packages: { type: 'number', required: false, min: 1 }
  },
  cartAdd: {
    productId: { type: 'string', required: true, format: 'uuid' },
    size: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    quantity: { type: 'number', required: true, integer: true, min: 1 }
  },
  cartUpdate: {
    productId: { type: 'string', required: true, format: 'uuid' },
    size: { type: 'string', required: true, minLength: 1, maxLength: 50 },
    quantity: { type: 'number', required: true, integer: true, min: 0 }
  },
  inquiry: {
    name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
    contact: { type: 'string', required: true, minLength: 4, maxLength: 100 },
    inquiry: { type: 'string', required: true, minLength: 5, maxLength: 1000 },
    userEmail: { type: 'string', required: false, format: 'email', maxLength: 100 }
  },
  productSave: {
    name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
    description: { type: 'string', required: false, maxLength: 1000 },
    image_url: { type: 'string', required: false, maxLength: 500 },
    quantity_options: { type: 'object', required: true },
    amazon_url: { type: 'string', required: false, maxLength: 500 },
    blinkit_url: { type: 'string', required: false, maxLength: 500 }
  },
  orderStatusUpdate: {
    status: { type: 'string', required: true, minLength: 2, maxLength: 50 }
  }
};

function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ error: 'Unknown validation schema' });
    }

    const data = req.body;
    const errors = [];

    // Reject extra properties not defined in the schema to prevent injection or parameter pollution
    const allowedKeys = Object.keys(schema);
    const receivedKeys = Object.keys(data);
    for (const key of receivedKeys) {
      if (!allowedKeys.includes(key)) {
        errors.push(`Unexpected parameter: ${key}`);
      }
    }

    for (const [key, rules] of Object.entries(schema)) {
      const val = data[key];

      if (val === undefined || val === null || val === '') {
        if (rules.required) {
          errors.push(`Field '${key}' is required`);
        }
        continue;
      }

      // Strict type check
      if (rules.type === 'string') {
        if (typeof val !== 'string') {
          errors.push(`Field '${key}' must be a string`);
          continue;
        }

        if (rules.minLength && val.length < rules.minLength) {
          errors.push(`Field '${key}' must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && val.length > rules.maxLength) {
          errors.push(`Field '${key}' cannot exceed ${rules.maxLength} characters`);
        }

        if (rules.format === 'email' && !EMAIL_REGEX.test(val)) {
          errors.push(`Field '${key}' must be a valid email address`);
        }
        if (rules.format === 'phone' && !PHONE_REGEX.test(val)) {
          errors.push(`Field '${key}' must be a valid phone number`);
        }
        if (rules.format === 'otp' && !OTP_REGEX.test(val)) {
          errors.push(`Field '${key}' must be a valid 6-digit OTP`);
        }
        if (rules.format === 'pincode' && !PINCODE_REGEX.test(val)) {
          errors.push(`Field '${key}' must be a valid 6-digit pincode`);
        }
        if (rules.format === 'uuid' && !UUID_REGEX.test(val)) {
          errors.push(`Field '${key}' must be a valid UUID`);
        }
      } else if (rules.type === 'number') {
        if (typeof val !== 'number') {
          errors.push(`Field '${key}' must be a number`);
          continue;
        }

        if (rules.integer && !Number.isInteger(val)) {
          errors.push(`Field '${key}' must be an integer`);
        }
        if (rules.min !== undefined && val < rules.min) {
          errors.push(`Field '${key}' must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && val > rules.max) {
          errors.push(`Field '${key}' cannot exceed ${rules.max}`);
        }
      } else if (rules.type === 'object') {
        if (typeof val !== 'object' || val === null) {
          errors.push(`Field '${key}' must be an object or array`);
          continue;
        }
      }

      if (rules.enum && !rules.enum.includes(val)) {
        errors.push(`Field '${key}' must be one of: ${rules.enum.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
}

module.exports = {
  validate
};
