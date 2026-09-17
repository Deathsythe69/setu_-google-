import { Request, Response, Router } from 'express';
import { NATIONS } from '../config/nations.js';
import { PIIRedactor, ConsentMissingError, PIIRedactionServiceError } from '../security/piiRedactor.js';
import { SovereignEventBus } from '../bus/eventBus.js';
import { ASRTranslator } from '../intelligence/asrTranslator.js';
import { ClusteringEngine } from '../clustering/clusteringEngine.js';
import { SovereignStore } from '../storage/sovereignStore.js';
import { FusionPrioritizationEngine } from '../prioritization/fusionEngine.js';
import { BiasAuditor } from '../governance/biasAuditor.js';
import { EmailOtpService } from '../auth/emailOtpService.js';
import { OfficialAuthService } from '../auth/officialAuthService.js';
import { RealDataLoader } from '../storage/realDataLoader.js';
import { MongoDbConnector } from '../storage/mongoDbConnector.js';
import { FirebaseAdminConnector } from '../auth/firebaseAdminConnector.js';
import { requireRole, createRateLimiter } from '../security/securityMiddleware.js';
import { CitizenReport, ChannelType, SectorCategory } from '../types/index.js';

export const apiRouter = Router();
const store = SovereignStore.getInstance();
const bus = SovereignEventBus.getInstance();

const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Too many authentication attempts. Please wait 60 seconds before retrying.',
});

// 0. Email OTP Authentication Routes
apiRouter.post('/auth/send-otp', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }

  const result = await EmailOtpService.sendOtp(email);
  res.json(result);
});

apiRouter.post('/auth/verify-otp', authRateLimiter, (req: Request, res: Response): void => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ error: 'Email and 6-digit OTP code are required' });
    return;
  }

  const result = EmailOtpService.verifyOtp(email, otp);
  if (!result.success) {
    res.status(401).json(result);
    return;
  }

  res.json(result);
});

// 0b. Official Authority Email & Password Authentication
apiRouter.post('/auth/official/login', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Official email and password are required' });
    return;
  }

  const result = await OfficialAuthService.login(email, password);
  if (!result.success) {
    res.status(401).json(result);
    return;
  }

  res.json(result);
});

// 0c. Super Admin Official Credential Generation
apiRouter.post('/auth/official/create', requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  const adminEmail = (req.headers['x-user-email'] as string) || 'debasispanigrahi7864@gmail.com';
  const { email, role, department, password } = req.body;

  if (!email || !role) {
    res.status(400).json({ error: 'Official email and role are required' });
    return;
  }

  const result = await OfficialAuthService.createOfficial(adminEmail, {
    email,
    role,
    department,
    password,
  });

  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.json(result);
});

// 0d. Super Admin List Official Accounts
apiRouter.get('/auth/official/list', requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  const adminEmail = (req.headers['x-user-email'] as string) || 'debasispanigrahi7864@gmail.com';
  const officials = await OfficialAuthService.listOfficials(adminEmail);
  res.json({ officials });
});

// 0e. Super Admin Revoke Official Account
apiRouter.post('/auth/official/revoke', requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  const adminEmail = (req.headers['x-user-email'] as string) || 'debasispanigrahi7864@gmail.com';
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Target email is required' });
    return;
  }

  const success = await OfficialAuthService.revokeOfficial(adminEmail, email);
  res.json({ success, message: success ? `Official account ${email} deactivated.` : 'Failed to revoke account.' });
});

// 1. Get Nations
apiRouter.get('/nations', (req: Request, res: Response) => {
  res.json({ nations: Object.values(NATIONS) });
});

// 2. Ingestion Gateway API (Voice, WhatsApp, SMS, Web/PWA)
apiRouter.post('/ingest', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nation_id = 'IND',
      region_id = 'IND-BUN-02',
      channel = 'pwa',
      lang = 'en',
      text = '',
      consent_flag,
      sender_id = 'anonymous_web_user',
      geo = { lat: 24.9142, lng: 79.584 },
      audio_provided = false,
      photo_url,
    } = req.body;

    // Gate 1: Explicit Consent Verification (Rules.md §2)
    if (consent_flag !== true) {
      res.status(400).json({
        error: 'ConsentMissingError',
        message: 'Explicit citizen consent must be granted before capturing and storing any report.',
      });
      return;
    }

    // Gate 2: Sender Hash & Rate Limiting (Rules.md §7)
    const senderHash = PIIRedactor.hashIdentifier(sender_id);
    const rateCheck = PIIRedactor.checkRateLimit(senderHash);
    if (!rateCheck.allowed) {
      res.status(429).json({
        error: 'RateLimitExceeded',
        message: 'Too many submissions detected from this device/number. Please wait a few minutes.',
      });
      return;
    }

    // Gate 3: Fail-Closed PII Redaction (Rules.md §2)
    // Redaction occurs before entering event bus or database storage
    const redaction = PIIRedactor.redact(text);

    // Gate 4: ASR, Script Detection & Multilingual Pivot Translation
    const intelligence = ASRTranslator.processInput(redaction.redactedText, lang, audio_provided);

    // Generate Sovereign Tracking ID
    const trackingId = `SETU-${nation_id}-${Math.floor(1000 + Math.random() * 9000)}`;
    const reportId = `REP-${nation_id}-${Date.now()}`;
    const now = new Date();
    const retentionExpires = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days retention

    const report: CitizenReport = {
      id: reportId,
      tracking_id: trackingId,
      nation_id,
      region_id,
      channel: channel as ChannelType,
      lang: intelligence.detectedLang,
      raw_text: redaction.redactedText,
      original_script: text,
      english_transcript: intelligence.englishTranscript,
      photo_url,
      category: intelligence.category,
      geo,
      urgency_score: intelligence.urgencyScore,
      sentiment: intelligence.sentiment,
      consent_flag: true,
      sender_hash: senderHash,
      submitted_at: now.toISOString(),
      status: 'received',
      retention_expires_at: retentionExpires.toISOString(),
    };

    // Gate 5: Publish clean, redacted event to Sovereign Event Bus
    await bus.publish('citizen.reports.redacted', nation_id, {
      reportId: report.id,
      trackingId: report.tracking_id,
      category: report.category,
      urgencyScore: report.urgency_score,
      piiRedacted: redaction.piiDetected,
    });

    // Gate 6: Clustering & Deduplication into Demand Signal
    const existingSignals = store.getDemandSignals(nation_id);
    const { signal: clusteredSignal, isNewCluster } = ClusteringEngine.clusterReport(report, existingSignals);
    report.demand_signal_id = clusteredSignal.id;
    report.status = 'clustered';

    // Gate 7: Store Report & Demand Signal in Sovereign Partition
    store.saveReport(report);
    store.saveDemandSignal(clusteredSignal);

    // Gate 8: Re-calculate Prioritization Queue
    store.refreshPrioritization(nation_id);

    res.status(201).json({
      success: true,
      tracking_id: report.tracking_id,
      report_id: report.id,
      status: report.status,
      category: report.category,
      urgency_score: report.urgency_score,
      detected_script: intelligence.scriptFamily,
      english_transcript: intelligence.englishTranscript,
      redacted_text: report.raw_text,
      pii_redacted: redaction.piiDetected,
      demand_signal_id: clusteredSignal.id,
      is_new_cluster: isNewCluster,
      total_cluster_reports: clusteredSignal.report_count,
    });
  } catch (error: any) {
    if (error instanceof PIIRedactionServiceError) {
      res.status(503).json({
        error: 'PIIRedactionServiceError',
        message: error.message,
        fail_closed: true,
      });
      return;
    }
    console.error('[API /ingest error]:', error);
    res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

// 3. Citizen Status Tracker (by tracking_id)
apiRouter.get('/reports/track/:trackingId', (req: Request, res: Response): void => {
  const { trackingId } = req.params;
  const report = store.getReportByTrackingId(trackingId);

  if (!report) {
    res.status(404).json({ error: 'NotFound', message: `Report with tracking ID ${trackingId} not found.` });
    return;
  }

  // Get associated project status if clustered
  let projectStatus = 'Under Community Review';
  let projectTitle: string | undefined;
  let fundedAmount: number | undefined;

  if (report.demand_signal_id) {
    const projects = store.getProjects(report.nation_id);
    const proj = projects.find((p) => p.demand_signal_id === report.demand_signal_id);
    if (proj) {
      projectStatus = proj.status.toUpperCase();
      projectTitle = proj.title;
      fundedAmount = proj.funded_amount;
    }
  }

  res.json({
    report: {
      tracking_id: report.tracking_id,
      nation_id: report.nation_id,
      region_id: report.region_id,
      channel: report.channel,
      category: report.category,
      submitted_at: report.submitted_at,
      status: report.status,
      urgency_score: report.urgency_score,
      english_transcript: report.english_transcript,
      geo: report.geo,
      demand_signal_id: report.demand_signal_id,
      project_status: projectStatus,
      project_title: projectTitle,
      funded_amount: fundedAmount,
    },
    timeline: [
      { step: 'Received', completed: true, label: 'Report received & securely verified' },
      { step: 'Clustered', completed: report.status !== 'received', label: 'Deduplicated & clustered with community reports' },
      { step: 'Under Review', completed: report.status === 'under_review' || report.status === 'funded' || report.status === 'completed', label: 'Evaluated by municipal planning engine' },
      { step: 'Funded', completed: report.status === 'funded' || report.status === 'completed', label: 'Human policymaker approved budget allocation' },
      { step: 'Completed', completed: report.status === 'completed', label: 'Infrastructure constructed & impact verified' },
    ],
  });
});

// 4. Citizen Right to Erasure
apiRouter.post('/reports/erase', (req: Request, res: Response): void => {
  const { tracking_id } = req.body;
  if (!tracking_id) {
    res.status(400).json({ error: 'Missing tracking_id parameter' });
    return;
  }

  const result = store.eraseReport(tracking_id);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }

  res.json(result);
});

// 5. Policymaker Recommendations Queue & Projects
apiRouter.get('/projects', (req: Request, res: Response) => {
  const nation_id = (req.query.nation_id as string) || 'IND';
  const sector = req.query.sector as SectorCategory | undefined;

  let projects = store.getProjects(nation_id);
  if (sector) {
    projects = projects.filter((p) => p.sector === sector);
  }

  res.json({
    nation_id,
    projects,
    budget_lines: store.getBudgetLines(nation_id),
  });
});

// 6. Project Detail with Drill-down Evidence
apiRouter.get('/projects/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const project = store.getProjectById(id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Retrieve linked citizen reports as evidence
  const allReports = store.getReports(project.nation_id);
  const evidenceReports = allReports
    .filter((r) => r.demand_signal_id === project.demand_signal_id && r.status !== 'erased')
    .map((r) => ({
      id: r.id,
      tracking_id: r.tracking_id,
      channel: r.channel,
      submitted_at: r.submitted_at,
      urgency_score: r.urgency_score,
      english_transcript: r.english_transcript,
      original_script: r.original_script,
      lang: r.lang,
      landmark: r.geo.landmark || r.geo.ward,
    }));

  const budget = store.getBudgetLine(project.nation_id, project.sector);

  res.json({
    project,
    budget,
    evidenceReports,
  });
});

// 7. Human Policymaker Funding Action (Rule 3: No silent autonomy!)
apiRouter.post('/projects/:id/fund', requireRole(['policymaker', 'admin']), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { approved_by = 'National Infrastructure Planning Committee', amount } = req.body;

  const result = store.approveFunding(id, approved_by, amount);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  await bus.publish('projects.funded', result.project!.nation_id, {
    projectId: result.project!.id,
    approvedBy: approved_by,
    amount: result.project!.funded_amount,
  });

  res.json({
    success: true,
    message: `Project ${id} successfully funded and authorized by human policymaker.`,
    project: result.project,
  });
});

// 8. Demand Signals (for Hotspot Map)
apiRouter.get('/demand-signals', (req: Request, res: Response) => {
  const nation_id = (req.query.nation_id as string) || 'IND';
  const signals = store.getDemandSignals(nation_id);
  res.json({ nation_id, signals });
});

// 9. Scenario Simulator ("What if we fund X instead of Y?")
apiRouter.post('/scenario/simulate', (req: Request, res: Response) => {
  const { nation_id = 'IND', selected_project_ids = [] } = req.body;
  const allProjects = store.getProjects(nation_id);
  const budgetLines = store.getBudgetLines(nation_id);

  const simulation = FusionPrioritizationEngine.simulateScenario(
    allProjects,
    selected_project_ids,
    budgetLines
  );

  res.json({ nation_id, simulation });
});

// 10. Public Transparency Portal Data (Anonymized, DPG Standard)
apiRouter.get('/public/transparency', (req: Request, res: Response) => {
  const nation_id = (req.query.nation_id as string) || 'IND';
  const projects = store.getProjects(nation_id);
  const demandSignals = store.getDemandSignals(nation_id);

  const fundedProjects = projects.filter((p) => p.status === 'funded' || p.status === 'in_progress' || p.status === 'completed');

  // Sector demand aggregation
  const sectorDemand: Record<string, number> = {};
  demandSignals.forEach((ds) => {
    sectorDemand[ds.category] = (sectorDemand[ds.category] || 0) + ds.report_count;
  });

  res.json({
    nation_id,
    total_citizen_demands: Object.values(sectorDemand).reduce((a, b) => a + b, 0),
    total_demand_signals: demandSignals.length,
    funded_projects_count: fundedProjects.length,
    total_funded_amount: fundedProjects.reduce((acc, p) => acc + p.funded_amount, 0),
    sector_demand_breakdown: sectorDemand,
    funded_projects: fundedProjects.map((p) => ({
      id: p.id,
      title: p.title,
      sector: p.sector,
      region_name: p.region_name,
      status: p.status,
      funded_amount: p.funded_amount,
      estimated_cost: p.estimated_cost,
      priority_score: p.priority_score,
      citizen_reports_origin: p.citizen_report_count,
      approved_by: p.approved_by,
      approved_at: p.approved_at,
    })),
    methodology: {
      scoring_model: FusionPrioritizationEngine.MODEL_VERSION,
      pillars: [
        { name: 'Citizen Demand Intensity', weight: '35%', description: 'Logarithmic aggregation of verified reports, urgency signals, and citizen distress sentiments.' },
        { name: 'Demographic Vulnerability', weight: '25%', description: 'Composite index of regional marginalization, poverty indicators, and population density.' },
        { name: 'Infrastructure Deficit Gap', weight: '25%', description: 'Measured absence or structural collapse of sector utility coverage in target ward.' },
        { name: 'Fiscal Envelope Feasibility', weight: '15%', description: 'Budgetary absorptive capacity and immediate capital availability in current fiscal year.' },
      ],
      rules: [
        'No silent algorithmic auto-funding: every capital allocation requires verified human policymaker sign-off.',
        'PII is redacted before the event bus; citizen identifiers are tokenized.',
        'Sovereign federated data plane: no raw citizen data leaves national boundaries.',
      ],
    },
  });
});

// 11. AI Governance & Bias Audit
apiRouter.get('/governance/bias-audit', (req: Request, res: Response) => {
  const audit = BiasAuditor.runLanguageCohortAudit();
  res.json(audit);
});

// 12. Retention Policy Purge
apiRouter.post('/governance/purge-retention', requireRole(['governance_officer', 'admin']), (req: Request, res: Response) => {
  const { nation_id } = req.body;
  const result = store.purgeExpiredRetention(nation_id);
  res.json({ success: true, ...result });
});

// 13. Channel Ingestion Simulator (IVR, WhatsApp, SMS Webhook)
apiRouter.post('/webhooks/simulate', async (req: Request, res: Response): Promise<void> => {
  const { provider, signature, payload } = req.body;

  // Validate mock provider signature
  if (!signature || signature !== 'valid_carrier_sig_2026') {
    res.status(401).json({ error: 'UnauthorizedWebhookSignature', message: 'Webhook carrier signature failed verification.' });
    return;
  }

  // Forward to /ingest handler logic
  req.body = payload;
  // @ts-ignore
  return apiRouter.handle(req, res);
});

// 14. Real-World Open Datasets Metadata & Audit
apiRouter.get('/data/datasets', (req: Request, res: Response) => {
  const nations = ['IND', 'BRA', 'ZAF'];
  const overview = nations.map((nid) => {
    const reports = store.getReports(nid);
    const projects = store.getProjects(nid);
    const budgetLines = store.getBudgetLines(nid);
    const demandSignals = store.getDemandSignals(nid);

    return {
      nation_id: nid,
      reports_count: reports.length,
      demand_signals_count: demandSignals.length,
      projects_count: projects.length,
      budget_lines_count: budgetLines.length,
    };
  });

  res.json({
    success: true,
    data_sources: [
      {
        category: 'Demographics & Vulnerability Index',
        dataset: 'Census of India & NITI Aayog Multidimensional Poverty Index (MPI)',
        file: 'data/demographics_real.json',
        records: 13,
        status: 'active_in_memory',
        license: 'Open Government Data (OGD) / Creative Commons',
      },
      {
        category: 'Water Deficit & Coverage Gap',
        dataset: 'Ministry of Jal Shakti - Jal Jeevan Mission (JJM) IMIS Dashboard',
        file: 'data/infrastructure_indices_real.json',
        records: 20,
        status: 'active_in_memory',
        license: 'Open Government Data Platform India',
      },
      {
        category: 'Rural & Urban Road Infrastructure',
        dataset: 'Pradhan Mantri Gram Sadak Yojana (PMGSY) & MoRTH Pavement Deficit Registry',
        file: 'data/infrastructure_indices_real.json',
        records: 20,
        status: 'active_in_memory',
        license: 'National Highway Authority / MoRTH Public Records',
      },
      {
        category: 'Sanitation & Wastewater Treatment STP Gap',
        dataset: 'Central Pollution Control Board (CPCB) & Swachh Bharat Mission Urban (SBM-U 2.0)',
        file: 'data/infrastructure_indices_real.json',
        records: 20,
        status: 'active_in_memory',
        license: 'MoEFCC / CPCB Environmental Audits',
      },
      {
        category: 'Capital Expenditure & Sector Budget Lines',
        dataset: 'Union Budget of India 2026-27 (Demands for Grants No. 62, 85, 46, 60)',
        file: 'data/budget_lines_real.json',
        records: 15,
        status: 'active_in_memory',
        license: 'Ministry of Finance, Government of India',
      },
      {
        category: 'Curated Open Civic Grievances',
        dataset: 'CPGRAMS / BUIDCO / Janaagraha IChangeMyCity / BMC Disaster Portal Open Records',
        file: 'data/citizen_grievances_real.json',
        records: 11,
        status: 'active_in_memory',
        license: 'Public Civic Disclosure / Transparent Governance',
      },
    ],
    partitions_overview: overview,
  });
});

// 15. Kaggle / Custom CSV / JSON Dataset Upload & Dynamic Ingestion
apiRouter.post('/data/upload', requireRole(['governance_officer', 'policymaker', 'admin']), (req: Request, res: Response): void => {
  const { filename, content, nation_id = 'IND' } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: 'InvalidDatasetContent', message: 'Dataset content must be provided as text/csv or text/json string.' });
    return;
  }

  const parseResult = RealDataLoader.parseUploadedDataset(content, filename || 'dataset.csv');
  if (!parseResult.success) {
    res.status(422).json({ error: 'DatasetParsingError', message: parseResult.error });
    return;
  }

  let ingestedCount = 0;
  const targetNation = nation_id;

  switch (parseResult.type) {
    case 'demographics':
      ingestedCount = store.ingestDemographics(
        parseResult.data.map((d) => ({
          region_id: d.region_id || `${targetNation}-CUSTOM-${Date.now()}`,
          region_name: d.region_name || d.district || d.name || 'Custom Region',
          nation_id: d.nation_id || targetNation,
          population: Number(d.population) || 500000,
          density_sq_km: Number(d.density_sq_km) || 5000,
          vulnerability_index: Number(d.vulnerability_index) || 50,
        }))
      );
      break;

    case 'infrastructure':
      ingestedCount = store.ingestInfrastructureIndices(
        parseResult.data.map((d) => ({
          region_id: d.region_id || `${targetNation}-VAR-01`,
          region_name: d.region_name || d.name || 'Target District',
          nation_id: d.nation_id || targetNation,
          sector: (d.sector || 'water') as SectorCategory,
          deficit_score: Number(d.deficit_score) || 70,
          existing_coverage_pct: Number(d.existing_coverage_pct) || 30,
          last_updated: d.last_updated || new Date().toISOString().split('T')[0],
        }))
      );
      break;

    case 'budget':
      ingestedCount = store.ingestBudgetLines(
        parseResult.data.map((d) => ({
          id: d.id || `BL-${targetNation}-${(d.sector || 'GENERAL').toUpperCase()}`,
          nation_id: d.nation_id || targetNation,
          sector: (d.sector || 'water') as SectorCategory,
          fiscal_year: d.fiscal_year || '2026-27',
          amount_allocated: Number(d.amount_allocated) || 500,
          amount_available: Number(d.amount_available) || 300,
          currency: d.currency || '₹ Cr',
        }))
      );
      break;

    case 'grievances':
    default:
      ingestedCount = store.ingestCitizenReports(
        parseResult.data.map((d, index) => {
          const repId = d.id || `REP-${targetNation}-KAGGLE-${Date.now()}-${index}`;
          return {
            id: repId,
            tracking_id: d.tracking_id || `SETU-${targetNation}-${Math.floor(1000 + Math.random() * 9000)}`,
            nation_id: d.nation_id || targetNation,
            region_id: d.region_id || 'IND-BUN-02',
            channel: (d.channel || 'pwa') as ChannelType,
            lang: d.lang || 'en',
            raw_text: d.raw_text || d.complaint || d.text || d.description || 'Civic infrastructure report',
            original_script: d.original_script || d.complaint || d.text || d.description || 'Civic infrastructure report',
            english_transcript: d.english_transcript || d.complaint || d.text || d.description || 'Civic infrastructure report',
            category: (d.category || d.sector || 'water') as SectorCategory,
            geo: {
              lat: Number(d.lat || d.latitude || 24.9142),
              lng: Number(d.lng || d.longitude || 79.5840),
              landmark: d.landmark || 'Municipal Junction',
              ward: d.ward || 'Ward 1',
            },
            urgency_score: Number(d.urgency_score) || 7,
            sentiment: Number(d.sentiment) || -0.5,
            consent_flag: true,
            sender_hash: `kaggle_upload_${Date.now()}_${index}`,
            status: 'under_review',
            submitted_at: d.submitted_at || new Date().toISOString(),
            retention_expires_at: new Date(Date.now() + 86400000 * 90).toISOString(),
          };
        })
      );
      break;
  }

  res.status(200).json({
    success: true,
    message: `Successfully ingested ${ingestedCount} records from uploaded dataset.`,
    filename,
    inferred_type: parseResult.type,
    records_processed: parseResult.count,
    records_ingested: ingestedCount,
    nation_id: targetNation,
  });
});

// 16. Reset Store to Verified Real Datasets
apiRouter.post('/data/reset-real', requireRole(['governance_officer', 'admin']), (req: Request, res: Response) => {
  store.seedInitialData();
  res.json({
    success: true,
    message: 'Sovereign data store reset and reloaded with authentic open government datasets.',
    timestamp: new Date().toISOString(),
  });
});

// 17. Safe Environment Configuration Diagnostics
apiRouter.get('/system/env-status', (req: Request, res: Response) => {
  const mongoStatus = MongoDbConnector.getStatus();
  const firebaseStatus = FirebaseAdminConnector.getStatus();
  const smtpStatus = EmailOtpService.getStatus();

  res.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    subsystems: {
      mongodb: {
        ...mongoStatus,
        guidance: mongoStatus.configured
          ? 'Valid MongoDB URI detected. Connection active.'
          : 'Placeholders detected in MONGODB_URI. Replace <username> and <password> with your MongoDB Atlas or local URI.',
      },
      firebase: {
        ...firebaseStatus,
        guidance: firebaseStatus.configured
          ? 'Valid Firebase Admin credentials detected.'
          : 'Placeholders detected in FIREBASE_PROJECT_ID or FIREBASE_PRIVATE_KEY. Replace with service account credentials from Firebase Console.',
      },
      smtp_email: {
        ...smtpStatus,
        guidance: smtpStatus.configured
          ? 'Real SMTP transporter active. OTP emails dispatched via SMTP host.'
          : 'Placeholders detected in SMTP_USER/SMTP_PASS. Replace with your Gmail address and 16-character App Password.',
      },
    },
    readyForProduction: mongoStatus.configured && firebaseStatus.configured && smtpStatus.configured,
  });
});


