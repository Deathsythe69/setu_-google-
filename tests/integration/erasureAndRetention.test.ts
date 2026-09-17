import { describe, it, expect } from 'vitest';
import { SovereignStore } from '../../src/server/storage/sovereignStore.js';
import { CitizenReport } from '../../src/server/types/index.js';

describe('Erasure & Retention Policies Integration Tests', () => {
  const store = SovereignStore.getInstance();

  it('erases citizen submission link on request (Right to Erasure)', () => {
    const testReport: CitizenReport = {
      id: 'REP-ERASE-TEST-1',
      tracking_id: 'SETU-IND-ERASE-99',
      nation_id: 'IND',
      region_id: 'IND-VAR-01',
      channel: 'pwa',
      lang: 'en',
      raw_text: 'Report submitted by citizen with identifiable comments',
      original_script: 'Original citizen complaint',
      english_transcript: 'English transcript',
      category: 'roads',
      geo: { lat: 25.317, lng: 82.973 },
      urgency_score: 6,
      sentiment: -0.4,
      consent_flag: true,
      sender_hash: 'identifiable-hash-1234',
      submitted_at: new Date().toISOString(),
      status: 'received',
      retention_expires_at: new Date(Date.now() + 86400000 * 90).toISOString(),
    };

    store.saveReport(testReport);

    // Call erase
    const result = store.eraseReport(testReport.tracking_id);
    expect(result.success).toBe(true);

    const erased = store.getReportByTrackingId(testReport.tracking_id);
    expect(erased).toBeDefined();
    expect(erased?.status).toBe('erased');
    expect(erased?.sender_hash).toBe('ANONYMIZED_ERASED');
    expect(erased?.raw_text).toContain('erasure');
    expect(erased?.erased_at).toBeDefined();
  });

  it('purges raw text and media after 90-day retention expiration while preserving demand signal', () => {
    const expiredReport: CitizenReport = {
      id: 'REP-EXPIRED-TEST-1',
      tracking_id: 'SETU-IND-EXPIRED-88',
      nation_id: 'IND',
      region_id: 'IND-PAT-04',
      channel: 'voice',
      lang: 'en',
      raw_text: 'Expired voice text payload',
      original_script: 'Expired script',
      english_transcript: 'Expired transcript',
      audio_url: 'https://storage.sovereign.gov.in/audio/expired.mp3',
      category: 'drainage',
      geo: { lat: 25.594, lng: 85.137 },
      urgency_score: 7,
      sentiment: -0.6,
      consent_flag: true,
      sender_hash: 'old-sender',
      submitted_at: new Date(Date.now() - 86400000 * 95).toISOString(),
      status: 'clustered',
      retention_expires_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days expired
    };

    store.saveReport(expiredReport);

    const purgeResult = store.purgeExpiredRetention('IND');
    expect(purgeResult.purgedCount).toBeGreaterThanOrEqual(1);

    const checked = store.getReportByTrackingId(expiredReport.tracking_id);
    expect(checked?.raw_text).toContain('[Purged per 90-day retention rule]');
    expect(checked?.audio_url).toBeUndefined();
  });
});
