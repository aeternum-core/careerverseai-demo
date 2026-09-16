import nodemailer from 'nodemailer';

export class EmailService {
  /**
   * Send an OTP verification email to the user.
   * Returns { sent: boolean, devOtp?: string }
   */
  static async sendOTP(toEmail: string, otp: string): Promise<{ sent: boolean; message: string; devOtp?: string }> {
    const user = process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const fromName = process.env.EMAIL_FROM_NAME || 'CareerVerse AI';

    // 1. Check if SMTP credentials are provided
    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0726; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 500px; margin: auto;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #818cf8; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px;">🌌 CAREERVERSE AI</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Your Cosmic Career & Academic Launchpad</p>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(129, 140, 248, 0.2); padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 15px;">Your verification one-time passcode is:</p>
              <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ec4899; font-family: monospace; padding: 10px; background: rgba(0,0,0,0.4); border-radius: 8px; display: inline-block;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 15px;">This code is valid for 10 minutes. Do not share this with anyone.</p>
            </div>

            <p style="color: #64748b; font-size: 11px; text-align: center;">If you did not request this verification, please ignore this email.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"${fromName}" <${user}>`,
          to: toEmail,
          subject: `✨ ${otp} is your CareerVerse AI Verification Code`,
          text: `Your CareerVerse AI verification code is: ${otp}. It expires in 10 minutes.`,
          html: htmlContent
        });

        console.log(`📧 Live email with OTP ${otp} successfully sent to ${toEmail}`);
        return { sent: true, message: `Verification code delivered to ${toEmail}.` };
      } catch (err: any) {
        console.error(`⚠️ Email dispatch failed: ${err.message}. Falling back to dev mode.`);
      }
    }

    // 2. Fallback for Local / Demo / Staging environment (no SMTP configured)
    console.log(`✉️ [DEMO MODE] OTP for verification sent to ${toEmail}: ${otp}`);
    return {
      sent: false,
      message: 'Demo mode active: OTP generated and available on screen / terminal.',
      devOtp: otp
    };
  }
}
