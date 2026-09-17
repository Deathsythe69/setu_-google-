import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import crypto from 'crypto';

interface OtpEntry {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
}

export class EmailOtpService {
  private static otpStore: Map<string, OtpEntry> = new Map();
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if real credentials exist (not default placeholders)
    if (!host || !user || !pass || user.includes('your_email') || pass.includes('your_email')) {
      return null;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
      });
      return this.transporter;
    } catch (err) {
      console.warn('[EmailOtpService] Could not initialize SMTP transporter:', err);
      return null;
    }
  }

  /**
   * Generates and sends a 6-digit OTP code to the citizen/official email
   */
  public static async sendOtp(email: string): Promise<{ success: boolean; message: string; devOtp?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

    this.otpStore.set(normalizedEmail, {
      email: normalizedEmail,
      otp,
      expiresAt,
      attempts: 0,
    });

    const transporter = this.getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Setu Platform" <noreply@setu.gov.in>';

    if (transporter) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: normalizedEmail,
          subject: `Your Setu Verification Code: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #2563eb; margin-bottom: 8px;">Setu Platform Authentication</h2>
              <p style="color: #475569; font-size: 14px;">Use the verification code below to log in to the Setu Citizen-to-Infrastructure Platform.</p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e293b; background: #eff6ff; padding: 12px 24px; border-radius: 6px; border: 1px dashed #3b82f6;">
                  ${otp}
                </span>
              </div>
              <p style="color: #64748b; font-size: 12px;">This code is valid for <strong>${expiryMinutes} minutes</strong>. If you did not request this code, you can safely ignore this message.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #94a3b8; font-size: 11px;">Setu: BRICS Citizen-to-Infrastructure Intelligence · Digital Public Good (Apache-2.0)</p>
            </div>
          `,
        });

        return {
          success: true,
          message: `Verification code sent to ${normalizedEmail}`,
        };
      } catch (err: any) {
        console.error('[EmailOtpService] Error sending email via SMTP:', err);
        // Fall back to dev mode if SMTP transmission failed
        return {
          success: true,
          message: `Verification code generated (SMTP error; test mode enabled)`,
          devOtp: otp,
        };
      }
    } else {
      // SMTP credentials are not yet configured in .env; provide simulated code for instant testing
      console.log(`\n======================================================`);
      console.log(`[Setu Dev OTP Service] Email: ${normalizedEmail}`);
      console.log(`[Setu Dev OTP Service] Generated Code: ${otp}`);
      console.log(`[Setu Dev OTP Service] Add real SMTP credentials in .env to send via email!`);
      console.log(`======================================================\n`);

      return {
        success: true,
        message: `Verification code dispatched (Simulated test mode: OTP printed in server console)`,
        devOtp: otp,
      };
    }
  }

  /**
   * Verifies the provided 6-digit OTP code
   */
  public static verifyOtp(email: string, userOtp: string): { success: boolean; message: string; token?: string; role?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = this.otpStore.get(normalizedEmail);

    if (!entry) {
      return { success: false, message: 'No active OTP request found for this email. Please request a new code.' };
    }

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(normalizedEmail);
      return { success: false, message: 'Verification code has expired. Please request a new code.' };
    }

    if (entry.attempts >= 5) {
      this.otpStore.delete(normalizedEmail);
      return { success: false, message: 'Too many incorrect attempts. Please request a new verification code.' };
    }

    if (entry.otp !== userOtp.trim()) {
      entry.attempts += 1;
      return { success: false, message: `Invalid verification code. ${5 - entry.attempts} attempts remaining.` };
    }

    // Invalidate OTP entry to prevent replay attacks
    this.otpStore.delete(normalizedEmail);

    // Configured admin and official email lists (from .env or platform defaults)
    const adminEmails = (process.env.ADMIN_EMAILS || 'debasispanigrahi7864@gmail.com')
      .toLowerCase()
      .split(',')
      .map(e => e.trim());

    const officialEmails = (process.env.OFFICIAL_EMAILS || 'debasis6269@gmail.com')
      .toLowerCase()
      .split(',')
      .map(e => e.trim());

    // Resolve sovereign role from designated email identity
    let role: 'citizen' | 'policymaker' | 'governance_officer' | 'admin' = 'citizen';

    if (adminEmails.includes(normalizedEmail) || normalizedEmail.includes('admin')) {
      role = 'admin';
    } else if (
      officialEmails.includes(normalizedEmail) ||
      normalizedEmail.includes('official') ||
      normalizedEmail.includes('policymaker') ||
      normalizedEmail.includes('planner')
    ) {
      role = 'policymaker';
    } else if (
      normalizedEmail.includes('auditor') ||
      normalizedEmail.includes('governance') ||
      normalizedEmail.includes('compliance')
    ) {
      role = 'governance_officer';
    } else {
      // All other registered emails are standard public users / citizens
      role = 'citizen';
    }

    // Generate authenticated session token
    const tokenPayload = `${normalizedEmail}:${role}:${Date.now()}`;
    const token = crypto.createHmac('sha256', process.env.JWT_SECRET || 'setu_secret').update(tokenPayload).digest('hex');

    return {
      success: true,
      message: 'Email successfully verified.',
      token,
      role,
    };
  }

  /**
   * Returns safe diagnostic status of the SMTP configuration
   */
  public static getStatus(): { configured: boolean; host?: string; port?: number; userMasked?: string; from?: string; error?: string } {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const configured = Boolean(
      host &&
      user &&
      pass &&
      !user.includes('your_email') &&
      !pass.includes('your_email')
    );

    let userMasked: string | undefined;
    if (user && !user.includes('your_email')) {
      const parts = user.split('@');
      if (parts.length === 2) {
        userMasked = `${parts[0].slice(0, 2)}***@${parts[1]}`;
      } else {
        userMasked = '***';
      }
    }

    return {
      configured,
      host: configured ? host : undefined,
      port: configured ? parseInt(process.env.SMTP_PORT || '587', 10) : undefined,
      userMasked,
      from: process.env.EMAIL_FROM,
      error: !configured ? 'Contains default placeholder (your_email_sender@gmail.com) or missing credentials' : undefined,
    };
  }
}
