const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'VibeLog - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 2.5rem;">VibeLog</h1>
            <p style="color: white; margin: 10px 0 0 0;">Your Personal Mood Tracker</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You requested to reset your password for your VibeLog account. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                display: inline-block;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
              ">Reset Password</a>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 14px; margin-top: 25px;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #999; font-size: 14px;">
              If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 14px;">
              © 2025 VibeLog. Keep tracking your mood journey! 🌟
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, username) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to VibeLog! 🌟',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 2.5rem;">VibeLog</h1>
            <p style="color: white; margin: 10px 0 0 0;">Welcome to Your Mood Journey!</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! 👋</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Welcome to VibeLog! We're excited to help you track your mood journey and gain insights into your emotional well-being.
            </p>
            
            <h3 style="color: #667eea; margin: 25px 0 15px 0;">What you can do with VibeLog:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>📝 Log your daily moods with journal entries</li>
              <li>📊 Track your emotional patterns over time</li>
              <li>🤖 Get AI-powered insights about your mood trends</li>
              <li>🎯 Set goals for emotional wellness</li>
              <li>🌈 Discover what makes you happy</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                display: inline-block;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
              ">Start Your Journey</a>
            </div>
            
            <p style="color: #666; font-style: italic; text-align: center;">
              "The journey of a thousand miles begins with a single step." 🚀
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 14px;">
              © 2025 VibeLog. Here to support your emotional wellness! 💙
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Welcome email failed:', error);
      // Don't throw error for welcome email failure
      return false;
    }
  }
}

module.exports = new EmailService();
