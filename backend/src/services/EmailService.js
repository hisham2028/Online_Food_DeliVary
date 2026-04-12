import nodemailer from 'nodemailer';

class EmailService {
  constructor() {}

  async sendEmail(to, subject, text, html = null) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email is not configured. Set EMAIL_USER and EMAIL_PASSWORD in the backend environment.');
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

      const mailOptions = { from: process.env.EMAIL_USER, to, subject, text, html };
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
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