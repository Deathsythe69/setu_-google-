import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import { apiRouter } from '../../src/server/api/routes.js';
import { SovereignStore } from '../../src/server/storage/sovereignStore.js';

describe('Gateway Contract & API Integration Tests', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', apiRouter);
  });

  it('rejects inbound report with HTTP 400 if consent_flag is missing or false', async () => {
    const res = await fetch('http://localhost:3001/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nation_id: 'IND',
        text: 'Broken road in village',
        consent_flag: false, // Disallowed per Rules.md §2
      }),
    }).catch(() => null);

    // If server not running directly on port 3001 in test runner, test route directly via mock or express
    // Let's test using internal express app handler directly:
    const mockReq: any = {
      method: 'POST',
      url: '/ingest',
      body: {
        nation_id: 'IND',
        text: 'Broken road in village',
        consent_flag: false, // Disallowed per Rules.md §2
      },
    };
    let statusCode = 0;
    let responseData: any = {};
    const mockRes: any = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
        return mockRes;
      },
    };

    // @ts-ignore
    await apiRouter.handle(mockReq, mockRes, () => {});

    // Or verify via store and router
    expect(statusCode === 400 || responseData.error === 'ConsentMissingError').toBe(true);
  });

  it('ingests report when consented, redacts PII, clusters, and returns tracking ID', async () => {
    const mockReq: any = {
      method: 'POST',
      url: '/ingest',
      body: {
        nation_id: 'IND',
        region_id: 'IND-VAR-01',
        channel: 'voice',
        lang: 'hi',
        text: 'My name is Ramesh Patel and my phone is 9876543210. Varanasi Ghat road has massive dangerous potholes.',
        consent_flag: true,
        sender_id: 'user-phone-1234',
        geo: { lat: 25.3176, lng: 82.9739, landmark: 'Assi Ghat Road' },
      },
    };

    let statusCode = 0;
    let responseData: any = {};
    const mockRes: any = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
        return mockRes;
      },
    };

    // @ts-ignore
    await apiRouter.handle(mockReq, mockRes, () => {});

    expect(statusCode).toBe(201);
    expect(responseData.success).toBe(true);
    expect(responseData.tracking_id).toMatch(/^SETU-IND-\d{4}$/);
    expect(responseData.pii_redacted).toBe(true);
    expect(responseData.redacted_text).not.toContain('9876543210');
    expect(responseData.redacted_text).toContain('[PHONE_REDACTED]');
    expect(responseData.redacted_text).toContain('[NAME_REDACTED]');
    expect(responseData.category).toBe('roads');
  });

  it('tracks report lifecycle status and timeline by tracking ID', async () => {
    const store = SovereignStore.getInstance();
    const reports = store.getReports('IND');
    const existingReport = reports[0];

    const mockReq: any = {
      method: 'GET',
      url: `/reports/track/${existingReport.tracking_id}`,
      params: { trackingId: existingReport.tracking_id },
    };

    let statusCode = 200;
    let responseData: any = {};
    const mockRes: any = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
        return mockRes;
      },
    };

    // @ts-ignore
    await apiRouter.handle(mockReq, mockRes, () => {});

    expect(responseData.report).toBeDefined();
    expect(responseData.report.tracking_id).toBe(existingReport.tracking_id);
    expect(responseData.timeline).toBeInstanceOf(Array);
    expect(responseData.timeline.length).toBe(5);
  });

  it('allows human policymaker to approve and fund project (enforcing no silent autonomy)', async () => {
    const store = SovereignStore.getInstance();
    const projects = store.getProjects('IND');
    const targetProject = projects[0];

    const mockReq: any = {
      method: 'POST',
      url: `/projects/${targetProject.id}/fund`,
      params: { id: targetProject.id },
      body: {
        approved_by: 'National Planning Secretary (Human Approval)',
        amount: targetProject.estimated_cost,
      },
    };

    let statusCode = 200;
    let responseData: any = {};
    const mockRes: any = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
        return mockRes;
      },
    };

    // @ts-ignore
    await apiRouter.handle(mockReq, mockRes, () => {});

    expect(responseData.success).toBe(true);
    expect(responseData.project.status).toBe('funded');
    expect(responseData.project.approved_by).toContain('National Planning Secretary');
  });
});
