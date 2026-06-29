const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTPEmail = async (email, otp, name, purpose) => {
  let subject = '';
  let title = '';
  let message = '';

  if (purpose === 'reset') {
    subject = 'Milgan - Reset Your Golden Key (Password)';
    title = 'Password Reset Request';
    message = `We received a request to reset your password. Use the following Golden OTP code to set a new password. This OTP will expire in 10 minutes.`;
  } else {
    subject = 'Milgan - Welcome, Verify Your Sanctuary Account';
    title = 'Account Verification OTP';
    message = `Welcome to the Milgan legacy! Use the following Golden OTP code to complete your first-time login and verify your profile. This OTP will expire in 15 minutes.`;
  }

  const mailOptions = {
    from: `"Milgan Foods" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: 'Georgia', serif; background-color: #23212e; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <div style="font-size: 50px; margin-bottom: 20px;">🏺</div>
        <h1 style="color: #fdce47; font-size: 28px; margin-bottom: 10px; font-weight: normal; letter-spacing: 1px;">${title}</h1>
        <p style="color: #ffffff; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; opacity: 0.4; margin-bottom: 30px;">Milgan Natural Alchemy</p>
        <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Hello ${name},</p>
        <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6; margin-bottom: 30px;">${message}</p>
        <div style="background-color: rgba(253,206,71,0.1); border: 1px solid #fdce47; padding: 20px; border-radius: 16px; display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #fdce47; margin-bottom: 30px; font-family: monospace;">
          ${otp}
        </div>
        <p style="color: rgba(255,255,255,0.5); font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.3);">
          Crafted with Purity in India
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Message ID: ${info.messageId} to ${email}`);
    return true;
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${email}:`, error);
    // Print fallback OTP for easy dev inspection
    console.log(`[Email Fallback OTP] Target Email: ${email} | OTP: ${otp} | Purpose: ${purpose}`);
    return false;
  }
};

module.exports = { sendOTPEmail };
