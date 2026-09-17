import { describe, it, expect } from 'vitest';
import {
  securityHeadersMiddleware,
  sanitizeRequestMiddleware,
  createRateLimiter,
  requireRole,
  globalErrorHandler,
} from '../../src/server/security/securityMiddleware.js';
import { apiRouter } from '../../src/server/api/routes.js';
import { SovereignStore } from '../../src/server/storage/sovereignStore.js';
import { EmailOtpService } from '../../src/server/auth/emailOtpService.js';

describe('Security & Protection Hardening Suite', () => {
  it('attaches comprehensive HTTP security headers to all responses', () => {
    const headersSet: Record<string, string> = {};
    const mockReq: any = {};
    const mockRes: any = {
      setHeader: (k: string, v: string) => {
        headersSet[k.toLowerCase()] = v;
      },
      removeHeader: () => {},
    };

    securityHeadersMiddleware(mockReq, mockRes, () => {});

    expect(headersSet['x-content-type-options']).toBe('nosniff');
    expect(headersSet['x-frame-options']).toBe('SAMEORIGIN');
    expect(headersSet['x-xss-protection']).toBe('1; mode=block');
    expect(headersSet['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headersSet['content-security-policy']).toBeDefined();
    expect(headersSet['strict-transport-security']).toContain('max-age=31536000');
  });

  it('rejects prototype pollution payloads in request body with HTTP 400', () => {
    let statusCode = 0;
    let jsonBody: any = null;

    // Use JSON.parse to create a direct __proto__ owned property
    const mockReq: any = {
      body: JSON.parse('{"__proto__": {"polluted": true}, "safeField": "valid text"}'),
    };
    const mockRes: any = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (body: any) => {
            jsonBody = body;
          },
        };
      },
    };

    sanitizeRequestMiddleware(mockReq, mockRes, () => {});
    expect(statusCode).toBe(400);
    expect(jsonBody?.error).toBe('InvalidPayload');
  });

  it('triggers HTTP 429 Too Many Requests when rate limit threshold is exceeded', () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 2,
      message: 'Rate limit exceeded for testing.',
    });

    const mockReq: any = {
      headers: { 'x-test-rate-limit': 'true' },
      socket: { remoteAddress: '192.168.1.100' },
      path: '/api/test-limit',
    };

    let callCount = 0;
    let resStatus = 200;
    let resBody: any = null;

    const mockRes: any = {
      setHeader: () => {},
      status: (code: number) => {
        resStatus = code;
        return {
          json: (body: any) => {
            resBody = body;
          },
        };
      },
    };

    // Request 1: OK
    limiter(mockReq, mockRes, () => {
      callCount++;
    });
    // Request 2: OK
    limiter(mockReq, mockRes, () => {
      callCount++;
    });
    // Request 3: Blocked (429)
    limiter(mockReq, mockRes, () => {
      callCount++;
    });

    expect(callCount).toBe(2);
    expect(resStatus).toBe(429);
    expect(resBody?.error).toBe('TooManyRequests');
  });

  it('enforces RBAC clearance: rejects unauthorized role with HTTP 403', () => {
    const middleware = requireRole(['policymaker', 'admin']);
    let resStatus = 200;
    let resBody: any = null;
    let nextCalled = false;

    const mockReq: any = {
      headers: { 'x-user-role': 'citizen' },
    };
    const mockRes: any = {
      status: (code: number) => {
        resStatus = code;
        return {
          json: (body: any) => {
            resBody = body;
          },
        };
      },
    };

    middleware(mockReq, mockRes, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(resStatus).toBe(403);
    expect(resBody?.error).toBe('ForbiddenRole');
    expect(resBody?.required_roles).toContain('policymaker');
  });

  it('allows authorized role to proceed through RBAC clearance', () => {
    const middleware = requireRole(['policymaker', 'admin']);
    let nextCalled = false;

    const mockReq: any = {
      headers: { 'x-user-role': 'policymaker' },
    };
    const mockRes: any = {};

    middleware(mockReq, mockRes, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it('formats server errors with incident correlation IDs without leaking internal stack traces', () => {
    let statusCode = 0;
    let jsonBody: any = null;

    const mockError = new Error('Simulated internal cluster timeout');
    const mockReq: any = { method: 'POST', originalUrl: '/api/test-fault' };
    const mockRes: any = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (body: any) => {
            jsonBody = body;
          },
        };
      },
    };

    globalErrorHandler(mockError, mockReq, mockRes, () => {});

    expect(statusCode).toBe(500);
    expect(jsonBody?.incident_id).toMatch(/^INC-/);
    expect(jsonBody?.message).toContain('Simulated internal cluster timeout');
    expect(jsonBody?.stack).toBeUndefined(); // No stack trace leakage
  });

  it('correctly infers and assigns sovereign roles in EmailOtpService', async () => {
    // 1. Send OTP for policymaker email
    await EmailOtpService.sendOtp('planner.patna@setu.gov.in');
    // @ts-ignore
    const entry1 = EmailOtpService['otpStore'].get('planner.patna@setu.gov.in');
    const verify1 = EmailOtpService.verifyOtp('planner.patna@setu.gov.in', entry1.otp);
    expect(verify1.success).toBe(true);
    expect(verify1.role).toBe('policymaker');

    // 2. Send OTP for governance auditor email
    await EmailOtpService.sendOtp('chief.auditor@setu.gov.in');
    // @ts-ignore
    const entry2 = EmailOtpService['otpStore'].get('chief.auditor@setu.gov.in');
    const verify2 = EmailOtpService.verifyOtp('chief.auditor@setu.gov.in', entry2.otp);
    expect(verify2.success).toBe(true);
    expect(verify2.role).toBe('governance_officer');
  });

  it('protects /projects/:id/fund with RBAC check via apiRouter', async () => {
    const store = SovereignStore.getInstance();
    const projects = store.getProjects('IND');
    const targetProject = projects[0];

    // 1. Citizen attempt (Blocked 403)
    let citizenStatus = 200;
    let citizenBody: any = null;

    const mockReqCitizen: any = {
      method: 'POST',
      url: `/projects/${targetProject.id}/fund`,
      params: { id: targetProject.id },
      headers: { 'x-user-role': 'citizen' },
      body: { approved_by: 'Unauthorized User' },
    };
    const mockResCitizen: any = {
      status: (c: number) => {
        citizenStatus = c;
        return { json: (b: any) => { citizenBody = b; } };
      },
    };

    await apiRouter.handle(mockReqCitizen, mockResCitizen, () => {});
    expect(citizenStatus).toBe(403);
    expect(citizenBody?.error).toBe('ForbiddenRole');

    // 2. Policymaker attempt (Allowed 200)
    let plannerStatus = 200;
    let plannerBody: any = null;

    const mockReqPlanner: any = {
      method: 'POST',
      url: `/projects/${targetProject.id}/fund`,
      params: { id: targetProject.id },
      headers: { 'x-user-role': 'policymaker' },
      body: { approved_by: 'Authorized Municipal Planner' },
    };
    const mockResPlanner: any = {
      status: (c: number) => {
        plannerStatus = c;
        return { json: (b: any) => { plannerBody = b; } };
      },
      json: (b: any) => {
        plannerBody = b;
      },
    };

    await apiRouter.handle(mockReqPlanner, mockResPlanner, () => {});
    expect(plannerStatus).toBe(200);
    expect(plannerBody?.success).toBe(true);
    expect(plannerBody?.project?.approved_by).toBe('Authorized Municipal Planner');
  });
});
