const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { validate } = require('../middleware/validator');

router.post('/', validate('inquiry'), async (req, res) => {
  try {
    const { name, contact, inquiry, userEmail } = req.body;

    console.log(`\n========================================\n[NEW INQUIRY RECEIVED]\nName: ${name}\nContact: ${contact}\nMessage: ${inquiry}\n========================================\n`);

    const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
    const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER || 'info@milganfoods.com';
    const smtpPass = process.env.SMTP_PASS;

    // Elegant simulated mode check to prevent server crashes if password is not configured yet
    if (!smtpPass || smtpPass === 'your_titan_webmail_password_here') {
      console.warn("WARNING: SMTP_PASS is not configured in backend/.env. Inquiries will log to the console but will not be sent.");
      return res.status(200).json({
        success: true,
        message: 'Inquiry logged successfully (Simulated Mode - SMTP configuration pending).'
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // True for 465, false for 587/other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL handshake failures with custom domains
      }
    });

    const clientEmail = userEmail || (contact.includes('@') ? contact : null);

    const mailOptions = {
      from: `"Milgan Foods" <${smtpUser}>`,
      to: smtpUser,
      replyTo: clientEmail || smtpUser, // Click "Reply" in email client to reply directly to the customer
      subject: `New Milgan Inquiry from ${name}`,
      text: `Dear Milgan Foods,

You have received a new inquiry from your Milgan Foods.

Inquiry Details:
${inquiry}

Client Contact Details:
Name: ${name}
User Email: ${userEmail || 'Not Provided'}

Warm regards,
Milgan Foods`,
      html: `
        <div style="font-family: 'Georgia', serif; color: #1B4332; max-width: 600px; margin: 0 auto; border: 1px solid #D49800; border-radius: 20px; padding: 40px; background-color: #FDFCFB;">
          <h2 style="font-style: italic; border-bottom: 1px solid #D49800; padding-bottom: 20px; color: #1B4332;">New Milgan Storefront Inquiry</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #1B4332;">
            Dear Milgan Foods,<br/><br/>
            You have received a new inquiry from your Milgan Foods.
          </p>
          
          <div style="background-color: #FCFAF7; padding: 25px; border-radius: 12px; border-left: 4px solid #D49800; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #D49800; text-transform: uppercase; font-size: 11px; letter-spacing: 0.2em;">Inquiry Message</h3>
            <p style="font-size: 15px; font-style: italic; line-height: 1.6; margin-bottom: 0;">"${inquiry}"</p>
          </div>
          
          <h3 style="color: #1B4332; text-transform: uppercase; font-size: 11px; letter-spacing: 0.2em; border-bottom: 1px solid #1B4332/10; padding-bottom: 8px;">Client Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #1B4332/60; width: 40%;">Name:</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1B4332/60;">User Email:</td>
              <td style="padding: 8px 0; font-weight: bold;">${userEmail || 'Not Provided'}</td>
            </tr>
          </table>
          
          <p style="margin-top: 40px; font-size: 12px; color: #1B4332/40; border-top: 1px solid #1B4332/10; padding-top: 20px; text-align: center;">
            Milgan Foods
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SUCCESS] Inquiry email sent to ${smtpUser} successfully!`);
    return res.status(200).json({ success: true, message: 'Inquiry sent directly to mail successfully!' });

  } catch (error) {
    console.error('Error sending email inquiry:', error);
    return res.status(500).json({ error: 'Failed to send inquiry to mail. Please try again.' });
  }
});

module.exports = router;
