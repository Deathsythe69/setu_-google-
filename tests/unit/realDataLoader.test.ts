import { describe, it, expect } from 'vitest';
import { RealDataLoader } from '../../src/server/storage/realDataLoader.js';
import { SovereignStore } from '../../src/server/storage/sovereignStore.js';

describe('RealDataLoader & Open Dataset Ingestion Engine', () => {
  it('loads authentic demographic units with valid census & vulnerability indices', () => {
    const demos = RealDataLoader.loadRealDemographics();
    expect(demos.length).toBeGreaterThanOrEqual(10);

    const chhatarpur = demos.find((d) => d.region_id === 'IND-BUN-02');
    expect(chhatarpur).toBeDefined();
    expect(chhatarpur?.population).toBe(1762375);
    expect(chhatarpur?.vulnerability_index).toBe(82.4);

    const dharavi = demos.find((d) => d.region_id === 'IND-MUM-03');
    expect(dharavi).toBeDefined();
    expect(dharavi?.density_sq_km).toBe(66000);
  });

  it('loads authentic infrastructure deficit indices grounded in Jal Jeevan Mission & PMGSY', () => {
    const infra = RealDataLoader.loadRealInfrastructureIndices();
    expect(infra.length).toBeGreaterThanOrEqual(15);

    const jjmWater = infra.find((i) => i.region_id === 'IND-BUN-02' && i.sector === 'water');
    expect(jjmWater).toBeDefined();
    expect(jjmWater?.deficit_score).toBe(89);
    expect(jjmWater?.existing_coverage_pct).toBe(21);
  });

  it('loads authentic budget lines from Union Budget & Novo PAC', () => {
    const budgets = RealDataLoader.loadRealBudgetLines();
    expect(budgets.length).toBeGreaterThanOrEqual(10);

    const jjmBudget = budgets.find((b) => b.id === 'BL-IND-WATER-26');
    expect(jjmBudget).toBeDefined();
    expect(jjmBudget?.amount_allocated).toBe(70163);
    expect(jjmBudget?.currency).toBe('₹ Cr');
  });

  it('loads curated authentic citizen grievances from CPGRAMS, BMC, BBMP, and Fala.BR', () => {
    const grievances = RealDataLoader.loadRealCitizenReports();
    expect(grievances.length).toBeGreaterThanOrEqual(8);

    const bundelkhandRep = grievances.find((g) => g.id === 'REP-IND-101');
    expect(bundelkhandRep).toBeDefined();
    expect(bundelkhandRep?.category).toBe('water');
    expect(bundelkhandRep?.urgency_score).toBeGreaterThanOrEqual(9.0);
    expect(bundelkhandRep?.geo.lat).toBeCloseTo(24.9152, 2);
  });

  it('accurately parses uploaded Kaggle CSV files and infers dataset category', () => {
    const sampleCsv = `district,sector,deficit_score,existing_coverage_pct,last_updated
IND-VAR-01,water,85,30,2026-09-17
IND-BLR-05,water,70,45,2026-09-17`;

    const result = RealDataLoader.parseUploadedDataset(sampleCsv, 'kaggle_water_deficit.csv');
    expect(result.success).toBe(true);
    expect(result.type).toBe('infrastructure');
    expect(result.count).toBe(2);
    expect(result.data[0].deficit_score).toBe(85);
  });

  it('accurately parses uploaded Kaggle JSON datasets and infers demographics', () => {
    const sampleJson = JSON.stringify([
      { region_id: 'IND-TEST-01', region_name: 'Test District', population: 650000, density_sq_km: 4200, vulnerability_index: 74 },
    ]);

    const result = RealDataLoader.parseUploadedDataset(sampleJson, 'census_aspirational.json');
    expect(result.success).toBe(true);
    expect(result.type).toBe('demographics');
    expect(result.count).toBe(1);
    expect(result.data[0].population).toBe(650000);
  });

  it('gracefully handles empty or malformed dataset files', () => {
    const emptyResult = RealDataLoader.parseUploadedDataset('', 'empty.csv');
    expect(emptyResult.success).toBe(false);

    const malformedJson = RealDataLoader.parseUploadedDataset('{invalid json', 'bad.json');
    expect(malformedJson.success).toBe(false);
  });

  it('dynamically ingests uploaded records into SovereignStore partition', () => {
    const store = SovereignStore.getInstance();
    const initialReportCount = store.getReports('IND').length;

    const count = store.ingestCitizenReports([
      {
        id: `REP-IND-TEST-INGEST-${Date.now()}`,
        tracking_id: `SETU-IND-9999`,
        nation_id: 'IND',
        region_id: 'IND-BUN-02',
        channel: 'pwa',
        lang: 'en',
        raw_text: 'Emergency deep well contamination',
        original_script: 'Emergency deep well contamination',
        english_transcript: 'Emergency deep well contamination',
        category: 'water',
        geo: { lat: 24.914, lng: 79.584, landmark: 'Well Head', ward: 'Ward 1' },
        urgency_score: 9.5,
        sentiment: -0.9,
        consent_flag: true,
        sender_hash: 'test_hash_dynamic',
        status: 'under_review',
        submitted_at: new Date().toISOString(),
        retention_expires_at: new Date(Date.now() + 86400000 * 90).toISOString(),
      },
    ]);

    expect(count).toBe(1);
    expect(store.getReports('IND').length).toBe(initialReportCount + 1);
  });
});
