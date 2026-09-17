import { describe, it, expect, beforeEach } from 'vitest';
import { PIIRedactor, PIIRedactionServiceError, ConsentMissingError } from '../../src/server/security/piiRedactor.js';

describe('PIIRedactor - Unit Tests (Security & Privacy)', () => {
  beforeEach(() => {
    PIIRedactor.setServiceStatus(true);
  });

  it('redacts telephone numbers across domestic and international formats', () => {
    const input = 'Call me on +91 9876543210 or 9820112233 regarding the road issue.';
    const result = PIIRedactor.redact(input);

    expect(result.piiDetected).toBe(true);
    expect(result.redactedText).not.toContain('9876543210');
    expect(result.redactedText).not.toContain('9820112233');
    expect(result.redactedText).toContain('[PHONE_REDACTED]');
  });

  it('redacts email addresses accurately', () => {
    const input = 'Send official notice to resident.council@example.org immediately.';
    const result = PIIRedactor.redact(input);

    expect(result.piiDetected).toBe(true);
    expect(result.redactedText).not.toContain('resident.council@example.org');
    expect(result.redactedText).toContain('[EMAIL_REDACTED]');
  });

  it('redacts national identity numbers (Aadhaar, CPF, etc.)', () => {
    const aadhaarInput = 'My Aadhaar number is 5432-8765-1098 please verify.';
    const result = PIIRedactor.redact(aadhaarInput);

    expect(result.piiDetected).toBe(true);
    expect(result.redactedText).not.toContain('5432-8765-1098');
    expect(result.redactedText).toContain('[NATIONAL_ID_REDACTED]');
  });

  it('redacts precise home/door addresses while preserving locality/ward', () => {
    const input = 'Drainage overflowing right outside Flat No 402 in Ward 14 Ghat area.';
    const result = PIIRedactor.redact(input);

    expect(result.piiDetected).toBe(true);
    expect(result.redactedText).not.toContain('Flat No 402');
    expect(result.redactedText).toContain('[STREET_ADDRESS_REDACTED]');
    expect(result.redactedText).toContain('Ward 14 Ghat area');
  });

  it('redacts citizen name self-introductions in multilingual patterns', () => {
    const inputEn = 'My name is Ramesh Patel and the water pipe is burst.';
    const resultEn = PIIRedactor.redact(inputEn);
    expect(resultEn.piiDetected).toBe(true);
    expect(resultEn.redactedText).toContain('My name is [NAME_REDACTED]');

    const inputHi = 'Mera naam Rajesh Kumar hai aur yahan paani nahi aa raha.';
    const resultHi = PIIRedactor.redact(inputHi);
    expect(resultHi.piiDetected).toBe(true);
    expect(resultHi.redactedText).toContain('Mera naam [NAME_REDACTED]');
  });

  it('strictly enforces FAIL-CLOSED policy when redaction service is unavailable', () => {
    // Simulate service outage
    PIIRedactor.setServiceStatus(false);

    expect(() => {
      PIIRedactor.redact('Sample citizen report text.');
    }).toThrow(PIIRedactionServiceError);
  });

  it('strictly requires explicit consent flag to be true', () => {
    expect(() => {
      PIIRedactor.verifyConsent(false);
    }).toThrow(ConsentMissingError);

    // Should not throw when consent is true
    expect(() => {
      PIIRedactor.verifyConsent(true);
    }).not.toThrow();
  });

  it('hashes identity for privacy-preserving rate limiting without KYC', () => {
    const phoneA = '+919876543210';
    const hash1 = PIIRedactor.hashIdentifier(phoneA);
    const hash2 = PIIRedactor.hashIdentifier(phoneA);

    expect(hash1).toBe(hash2);
    expect(hash1).not.toContain(phoneA);
    expect(hash1.length).toBe(16);

    // Test rate limiter
    for (let i = 0; i < 10; i++) {
      const check = PIIRedactor.checkRateLimit(hash1);
      expect(check.allowed).toBe(true);
    }
    // 11th should be rate-limited
    const blocked = PIIRedactor.checkRateLimit(hash1);
    expect(blocked.allowed).toBe(false);
  });
});
