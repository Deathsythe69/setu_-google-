import crypto from 'crypto';

export class PIIRedactionServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PIIRedactionServiceError';
  }
}

export class ConsentMissingError extends Error {
  constructor(message: string = 'Citizen consent must be explicitly granted before ingestion') {
    super(message);
    this.name = 'ConsentMissingError';
  }
}

export interface RedactionResult {
  redactedText: string;
  piiDetected: boolean;
  redactedTokensCount: number;
  redactedCategories: string[];
}

/**
 * PII Redaction Service
 * Enforces strict fail-closed redaction before any inbound citizen report
 * enters the sovereign event bus or database storage.
 */
export class PIIRedactor {
  private static isServiceOperational: boolean = true;
  private static rateLimitMap: Map<string, { count: number; windowStart: number }> = new Map();
  private static readonly RATE_LIMIT_MAX = 10; // Max 10 reports per 10 minutes per identity hash
  private static readonly RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

  /**
   * Set operational status (used for fail-closed resilience testing)
   */
  public static setServiceStatus(operational: boolean) {
    this.isServiceOperational = operational;
  }

  public static isOperational(): boolean {
    return this.isServiceOperational;
  }

  /**
   * Generates a one-way anonymized SHA-256 hash of sender identifier (phone, IMEI, or session)
   * used strictly for rate-limiting and duplicate prevention without retaining KYC.
   */
  public static hashIdentifier(rawIdentifier: string): string {
    return crypto.createHash('sha256').update(rawIdentifier.trim().toLowerCase()).digest('hex').substring(0, 16);
  }

  /**
   * Verifies explicit consent.
   * Throws ConsentMissingError if consent_flag is not true.
   */
  public static verifyConsent(consentFlag: boolean): void {
    if (consentFlag !== true) {
      throw new ConsentMissingError();
    }
  }

  /**
   * Rate limit check per identity hash
   */
  public static checkRateLimit(senderHash: string): { allowed: boolean; count: number; remaining: number } {
    const now = Date.now();
    const record = this.rateLimitMap.get(senderHash);

    if (!record || now - record.windowStart > this.RATE_LIMIT_WINDOW_MS) {
      this.rateLimitMap.set(senderHash, { count: 1, windowStart: now });
      return { allowed: true, count: 1, remaining: this.RATE_LIMIT_MAX - 1 };
    }

    if (record.count >= this.RATE_LIMIT_MAX) {
      return { allowed: false, count: record.count, remaining: 0 };
    }

    record.count += 1;
    return { allowed: true, count: record.count, remaining: this.RATE_LIMIT_MAX - record.count };
  }

  /**
   * Redacts all Personally Identifiable Information (PII) from text.
   * Fails closed if service is down or unexpected errors occur.
   */
  public static redact(text: string): RedactionResult {
    if (!this.isServiceOperational) {
      throw new PIIRedactionServiceError(
        'PII Redaction Service is offline or degraded. Fail-Closed policy active: ingestion blocked to prevent PII leakage.'
      );
    }

    if (!text || typeof text !== 'string') {
      return {
        redactedText: '',
        piiDetected: false,
        redactedTokensCount: 0,
        redactedCategories: [],
      };
    }

    let processed = text;
    let tokensCount = 0;
    const detectedCategories = new Set<string>();

    // 1. Email Addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    processed = processed.replace(emailRegex, () => {
      tokensCount++;
      detectedCategories.add('email');
      return '[EMAIL_REDACTED]';
    });

    // 2. National Identity Numbers (Aadhaar 12 digits, CPF 11 digits, SA ID 13 digits)
    const nationalIdRegex = /\b(\d{4}[-\s]\d{4}[-\s]\d{4}|\d{3}\.\d{3}\.\d{3}-\d{2}|\b\d{12,13}\b)\b/g;
    processed = processed.replace(nationalIdRegex, () => {
      tokensCount++;
      detectedCategories.add('national_id');
      return '[NATIONAL_ID_REDACTED]';
    });

    // 3. Phone Numbers (Indian 10-digit, +91, +55 Brazil, +27 SA, general international & domestic)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,6}/g;
    processed = processed.replace(phoneRegex, (match) => {
      // Avoid matching simple 4-digit years like 2026 or small road numbers or already redacted
      if (match.includes('[') && match.includes(']')) return match;
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
        tokensCount++;
        detectedCategories.add('phone');
        return '[PHONE_REDACTED]';
      }
      return match;
    });

    // 4. Precise House/Door/Apartment street numbers (protecting exact domestic residence while preserving ward/locality)
    const addressRegex = /\b(house\s*no\.?|flat\s*no\.?|apt\s*no\.?|door\s*no\.?|plot\s*no\.?|rua|casa|número)\s*[:#-]?\s*\d+[a-zA-Z0-9/-]*/gi;
    processed = processed.replace(addressRegex, () => {
      tokensCount++;
      detectedCategories.add('precise_address');
      return '[STREET_ADDRESS_REDACTED]';
    });

    // 5. Citizen self-introduction name patterns across multilingual phrases
    // "My name is John Doe", "I am Rajesh Kumar", "Mera naam Priya hai", "Meu nome é Carlos"
    const nameIntroRegex = /\b(my name is|i am|mera naam|naam mera|meu nome é|eu sou)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
    processed = processed.replace(nameIntroRegex, (match, prefix) => {
      tokensCount++;
      detectedCategories.add('name');
      return `${prefix} [NAME_REDACTED]`;
    });

    return {
      redactedText: processed,
      piiDetected: tokensCount > 0,
      redactedTokensCount: tokensCount,
      redactedCategories: Array.from(detectedCategories),
    };
  }
}
