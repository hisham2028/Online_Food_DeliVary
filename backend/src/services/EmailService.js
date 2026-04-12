import nodemailer from 'nodemailer';

class EmailService {
  constructor() {}

  getSenderEmail() {
    return process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }

  useBrevoApi() {
    return Boolean(process.env.BREVO_API_KEY);
  }

  async sendEmailWithBrevoApi(to, subject, text, html = null) {
    const sender = this.getSenderEmail();

    if (!sender) {
      throw new Error('Email sender is not configured. Set EMAIL_FROM or EMAIL_USER in the backend environment.');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: sender,
          name: process.env.EMAIL_FROM_NAME || 'Crave Yard'
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html || text,
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(`Brevo API failed (${response.status}): ${raw}`);
    }

    return await response.json();
  }

  async sendEmailWithSmtp(to, subject, text, html = null) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('SMTP email is not configured. Set EMAIL_USER and EMAIL_PASSWORD in the backend environment.');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = { from: this.getSenderEmail(), to, subject, text, html };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent via SMTP: ' + info.messageId);
    return info;
  }

  async sendEmail(to, subject, text, html = null) {
    try {
      if (this.useBrevoApi()) {
        const info = await this.sendEmailWithBrevoApi(to, subject, text, html);
        console.log('Email sent via Brevo API:', info?.messageId || 'ok');
        return info;
      }

      return await this.sendEmailWithSmtp(to, subject, text, html);
    } catch (error) {
      console.error('Error sending email:', error);

      if (error?.code === 'ETIMEDOUT') {
        throw new Error('SMTP connection timeout. If you use Brevo, set BREVO_API_KEY to send via HTTPS API and avoid SMTP network timeouts.');
      }

      throw error;
    }
  }

  // ✅ New — verification email
  async sendVerificationEmail(userEmail, verificationUrl) {
    const subject = 'Verify Your Email Address';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">Verify Your Email</h2>
        <p>Thank you for registering! Please click the button below to verify your email address.</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background: #ff6b35; color: white; 
                  padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't register, ignore this email.</p>
      </div>
    `;
    return await this.sendEmail(userEmail, subject, 'Verify your email: ' + verificationUrl, html);
  }

  async sendOrderStatusUpdate(userEmail, orderId, newStatus) {
    const subject = `Order Status Update - Order #${orderId}`;
    const text = `Your order status has been updated to: ${newStatus}`;
    const html = `
      <h2>Order Status Update</h2>
      <p>Dear Customer,</p>
      <p>Your order <strong>#${orderId}</strong> status has been updated to: <strong>${newStatus}</strong></p>
      <p>Thank you for choosing our service!</p>
    `;
    return await this.sendEmail(userEmail, subject, text, html);
  }

  async sendPasswordResetEmail(userEmail, resetUrl) {
    const subject = 'Reset Your Password';
    const text = `Reset your password using this link: ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">Reset Your Password</h2>
        <p>We received a request to reset your password. Use the button below to continue.</p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #ff6b35; color: white;
                  padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this change, you can ignore this email.</p>
      </div>
    `;
    return await this.sendEmail(userEmail, subject, text, html);
  }
}

export default new EmailService();