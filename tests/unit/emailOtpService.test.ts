import { describe, it, expect } from 'vitest';
import { EmailOtpService } from '../../src/server/auth/emailOtpService.js';

describe('EmailOtpService - Unit Tests (OTP Email Authentication)', () => {
  const testEmail = 'citizen.tester@setu.gov.in';

  it('generates a 6-digit OTP code and dispatches without error', async () => {
    const result = await EmailOtpService.sendOtp(testEmail);

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
    // In dev mode when real SMTP credentials are not yet configured in .env, returns devOtp for testing
    expect(result.devOtp).toMatch(/^\d{6}$/);
  });

  it('rejects an incorrect OTP code', async () => {
    await EmailOtpService.sendOtp(testEmail);
    const verifyResult = EmailOtpService.verifyOtp(testEmail, '000000');

    expect(verifyResult.success).toBe(false);
    expect(verifyResult.message).toContain('Invalid verification code');
  });

  it('successfully verifies a valid OTP code and returns an authenticated session token', async () => {
    const sendResult = await EmailOtpService.sendOtp(testEmail);
    const validOtp = sendResult.devOtp!;

    const verifyResult = EmailOtpService.verifyOtp(testEmail, validOtp);
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.token).toBeDefined();
    expect(verifyResult.token!.length).toBe(64); // SHA-256 hex length
  });

  it('invalidates the OTP code after a successful verification to prevent replay attacks', () => {
    // Attempting to verify the same OTP again should fail
    const replayResult = EmailOtpService.verifyOtp(testEmail, '123456');
    expect(replayResult.success).toBe(false);
    expect(replayResult.message).toContain('No active OTP request found');
  });

  it('assigns admin role to debasispanigrahi7864@gmail.com upon OTP verification', async () => {
    const adminEmail = 'debasispanigrahi7864@gmail.com';
    const sendResult = await EmailOtpService.sendOtp(adminEmail);
    const verifyResult = EmailOtpService.verifyOtp(adminEmail, sendResult.devOtp!);

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.role).toBe('admin');
  });

  it('assigns official policymaker role to debasis6269@gmail.com upon OTP verification', async () => {
    const officialEmail = 'debasis6269@gmail.com';
    const sendResult = await EmailOtpService.sendOtp(officialEmail);
    const verifyResult = EmailOtpService.verifyOtp(officialEmail, sendResult.devOtp!);

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.role).toBe('policymaker');
  });

  it('assigns citizen public role to general user emails upon OTP verification', async () => {
    const citizenEmail = 'ananya.sharma@example.com';
    const sendResult = await EmailOtpService.sendOtp(citizenEmail);
    const verifyResult = EmailOtpService.verifyOtp(citizenEmail, sendResult.devOtp!);

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.role).toBe('citizen');
  });
});
