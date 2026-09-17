import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './api/routes.js';
import { SovereignStore } from './storage/sovereignStore.js';
import { SovereignEventBus } from './bus/eventBus.js';
import { MongoDbConnector } from './storage/mongoDbConnector.js';
import { FirebaseAdminConnector } from './auth/firebaseAdminConnector.js';

import {
  securityHeadersMiddleware,
  sanitizeRequestMiddleware,
  createRateLimiter,
  globalErrorHandler,
} from './security/securityMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Security & Protection Middlewares
app.use(securityHeadersMiddleware);
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(sanitizeRequestMiddleware);

// 2. Global Rate Limiter (150 requests per minute per IP)
app.use(
  '/api',
  createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 150,
    message: 'Too many API requests from this client. Please throttle requests.',
  })
);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Setu BRICS Sovereign Platform Core',
    timestamp: new Date().toISOString(),
    dpg_compliant: true,
    security_hardened: true,
  });
});

// Mount Main API Router
app.use('/api', apiRouter);

// Unmatched API route handler (404)
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Sovereign API endpoint ${req.method} ${req.originalUrl} not found.`,
    status_code: 404,
  });
});

// Global Centralized Error Handler (500/etc.)
app.use(globalErrorHandler);

// Initialize Sovereign Store & Event Bus
const store = SovereignStore.getInstance();
const bus = SovereignEventBus.getInstance();

// Subscribe Event Bus listeners for real-time telemetry logging
bus.subscribe('citizen.reports.redacted', (evt) => {
  console.log(`[EventBus -> Ingested] ${evt.topic} (${evt.nation_id}): Report ${evt.payload.reportId}, Category: ${evt.payload.category}`);
});

bus.subscribe('projects.funded', (evt) => {
  console.log(`[EventBus -> Funded] ${evt.topic} (${evt.nation_id}): Project ${evt.payload.projectId} authorized by ${evt.payload.approvedBy}`);
});

export const server = app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`  SETU: BRICS Citizen-to-Infrastructure Intelligence  `);
  console.log(`  Backend Engine listening on http://localhost:${PORT}   `);
  console.log(`  Digital Public Good (Apache-2.0)                     `);
  console.log(`=======================================================`);

  // Asynchronously initialize database and auth integrations if credentials provided
  if (MongoDbConnector.isConfigured()) {
    console.log(`[Database] Connecting to configured MongoDB instance...`);
    await MongoDbConnector.connect();
  } else {
    console.log(`[Database] MONGODB_URI contains placeholder or is unset. Running in SovereignStore mode.`);
  }

  if (FirebaseAdminConnector.isConfigured()) {
    console.log(`[Auth] Initializing Firebase Admin SDK...`);
    FirebaseAdminConnector.init();
  } else {
    console.log(`[Auth] Firebase credentials contain placeholders or are unset. Running in Sovereign Auth mode.`);
  }
});

export default app;
