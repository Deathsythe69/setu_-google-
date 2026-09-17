import { describe, it, expect } from 'vitest';
import { apiRouter } from '../../src/server/api/routes.js';
import { SovereignStore } from '../../src/server/storage/sovereignStore.js';

describe('End-to-End Citizen-to-Infrastructure Intelligence Flow', () => {
  const store = SovereignStore.getInstance();

  it('completes the full loop: Citizen Report -> PII Redaction -> Translation -> Clustering -> Priority Queue -> Human Funding -> Status Tracker', async () => {
    // 1. Citizen submits voice report in Hindi with personal contact details and explicit consent
    const reportPayload = {
      nation_id: 'IND',
      region_id: 'IND-BUN-02',
      channel: 'voice',
      lang: 'hi',
      text: 'Mera naam Suresh Sharma है, फोन 9123456780. बुंदेलखंड छतरपुर में पानी बिल्कुल नहीं आ रहा, पाइपलाइन टूट गई है और बच्चे बीमार हो रहे हैं। कृपया तत्काल सहायता करें!',
      consent_flag: true,
      sender_id: 'citizen-device-sim-99',
      geo: { lat: 24.9142, lng: 79.5840, landmark: 'Chhatarpur Tank Road' },
      audio_provided: true,
    };

    let statusCode = 0;
    let ingestResponse: any = {};
    const mockResIngest: any = {
      status: (code: number) => {
        statusCode = code;
        return mockResIngest;
      },
      json: (data: any) => {
        ingestResponse = data;
        return mockResIngest;
      },
    };

    // @ts-ignore
    await apiRouter.handle({ method: 'POST', url: '/ingest', body: reportPayload }, mockResIngest, () => {});

    expect(statusCode).toBe(201);
    expect(ingestResponse.success).toBe(true);
    const trackingId = ingestResponse.tracking_id;
    expect(trackingId).toBeDefined();

    // 2. Verify PII Redaction
    expect(ingestResponse.pii_redacted).toBe(true);
    expect(ingestResponse.redacted_text).not.toContain('9123456780');
    expect(ingestResponse.redacted_text).not.toContain('Suresh Sharma');
    expect(ingestResponse.redacted_text).toContain('[PHONE_REDACTED]');
    expect(ingestResponse.redacted_text).toContain('[NAME_REDACTED]');

    // 3. Verify Multilingual ASR & Sector Detection
    expect(ingestResponse.detected_script).toBe('Devanagari');
    expect(ingestResponse.category).toBe('water');
    expect(ingestResponse.urgency_score).toBeGreaterThanOrEqual(7);

    // 4. Verify Clustered into Demand Signal
    const demandSignalId = ingestResponse.demand_signal_id;
    expect(demandSignalId).toBeDefined();

    // 5. Verify Policymaker Recommendations Queue
    const projects = store.getProjects('IND');
    const matchedProject = projects.find((p) => p.demand_signal_id === demandSignalId);
    expect(matchedProject).toBeDefined();
    expect(matchedProject?.sector).toBe('water');
    expect(matchedProject?.priority_score).toBeGreaterThan(60);
    expect(matchedProject?.factor_breakdown).toBeDefined();
    expect(matchedProject?.factor_breakdown.demand_pct).toBeGreaterThan(0);
    expect(matchedProject?.factor_breakdown.deficit_pct).toBeGreaterThan(0);

    // 6. Policymaker reviews evidence and explicitly authorizes funding
    let fundResponse: any = {};
    const mockResFund: any = {
      status: (code: number) => mockResFund,
      json: (data: any) => {
        fundResponse = data;
        return mockResFund;
      },
    };

    // @ts-ignore
    await apiRouter.handle(
      {
        method: 'POST',
        url: `/projects/${matchedProject!.id}/fund`,
        params: { id: matchedProject!.id },
        body: {
          approved_by: 'State Water Works Committee Chair (Dr. V. Sharma)',
          amount: matchedProject!.estimated_cost,
        },
      },
      mockResFund,
      () => {}
    );

    expect(fundResponse.success).toBe(true);
    expect(fundResponse.project.status).toBe('funded');
    expect(fundResponse.project.approved_by).toContain('Dr. V. Sharma');

    // 7. Citizen checks their submission via tracking ID: closed loop verified!
    let trackResponse: any = {};
    const mockResTrack: any = {
      status: (code: number) => mockResTrack,
      json: (data: any) => {
        trackResponse = data;
        return mockResTrack;
      },
    };

    // @ts-ignore
    await apiRouter.handle(
      {
        method: 'GET',
        url: `/reports/track/${trackingId}`,
        params: { trackingId },
      },
      mockResTrack,
      () => {}
    );

    expect(trackResponse.report).toBeDefined();
    expect(trackResponse.report.tracking_id).toBe(trackingId);
    expect(trackResponse.report.status).toBe('funded');
    expect(trackResponse.timeline[3].completed).toBe(true); // 'Funded' stage completed
  });
});
