import { describe, it, expect } from 'vitest';
import { BiasAuditor } from '../../src/server/governance/biasAuditor.js';

describe('BiasAuditor - Unit Tests (AI Governance & Language Equity)', () => {
  it('evaluates all 10 language cohorts across 5 script families', () => {
    const audit = BiasAuditor.runLanguageCohortAudit();

    expect(audit.modelVersion).toBe('v1.2.0-brics-explainable');
    expect(audit.evaluatedCohorts.length).toBeGreaterThanOrEqual(10);
    expect(audit.auditDate).toBeDefined();

    const languages = audit.evaluatedCohorts.map((c) => c.language);
    expect(languages).toContain('hi'); // Hindi (Devanagari)
    expect(languages).toContain('en'); // English (Latin)
    expect(languages).toContain('mr'); // Marathi (Devanagari)
    expect(languages).toContain('bn'); // Bengali (Bengali)
    expect(languages).toContain('ta'); // Tamil (Tamil)
    expect(languages).toContain('pt'); // Portuguese (Latin)
    expect(languages).toContain('ru'); // Russian (Cyrillic)
    expect(languages).toContain('zh'); // Chinese (Han)
    expect(languages).toContain('ar'); // Arabic (Arabic RTL)
    expect(languages).toContain('sw'); // Swahili (Latin)
  });

  it('guarantees all cohorts satisfy the mandatory threshold of >= 85% ASR accuracy', () => {
    const audit = BiasAuditor.runLanguageCohortAudit();

    audit.evaluatedCohorts.forEach((cohort) => {
      expect(cohort.asr_wer_accuracy).toBeGreaterThanOrEqual(85.0);
      expect(cohort.disparity_flag).toBe(false);
      expect(cohort.classification_f1).toBeGreaterThanOrEqual(0.85);
    });

    expect(audit.overallStatus).toBe('PASSED');
  });

  it('verifies score variance remains equitable across language cohorts (+/- 5%)', () => {
    const audit = BiasAuditor.runLanguageCohortAudit();

    const scores = audit.evaluatedCohorts.map((c) => c.avg_priority_score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    // Max delta should be within 10 points
    expect(maxScore - minScore).toBeLessThan(10);
    expect(audit.recommendations.length).toBeGreaterThanOrEqual(3);
  });
});
