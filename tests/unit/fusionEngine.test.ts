import { describe, it, expect } from 'vitest';
import { FusionPrioritizationEngine } from '../../src/server/prioritization/fusionEngine.js';
import { DemandSignal, DemographicUnit, InfrastructureIndex, BudgetLine, Project } from '../../src/server/types/index.js';

describe('FusionPrioritizationEngine - Unit Tests (Scoring & Explainability)', () => {
  const sampleSignal: DemandSignal = {
    id: 'DS-IND-WATER-101',
    nation_id: 'IND',
    region_id: 'IND-BUN-02',
    category: 'water',
    report_ids: ['REP-1', 'REP-2', 'REP-3', 'REP-4', 'REP-5'],
    report_count: 5,
    title: 'Water Supply Breakdown',
    summary: 'Acute drinking water deficit',
    urgency_score: 90,
    sentiment: -0.85,
    geo_cluster: { lat: 24.914, lng: 79.584 },
    radius_meters: 1500,
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  const sampleDemographic: DemographicUnit = {
    region_id: 'IND-BUN-02',
    region_name: 'Bundelkhand Rural Drought Belt',
    nation_id: 'IND',
    population: 850000,
    density_sq_km: 320,
    vulnerability_index: 88,
  };

  const sampleInfra: InfrastructureIndex = {
    region_id: 'IND-BUN-02',
    region_name: 'Bundelkhand',
    nation_id: 'IND',
    sector: 'water',
    deficit_score: 94,
    existing_coverage_pct: 18,
    last_updated: '2026-08-20',
  };

  const sampleBudget: BudgetLine = {
    id: 'BL-IND-WATER',
    nation_id: 'IND',
    sector: 'water',
    fiscal_year: '2026-27',
    amount_allocated: 450,
    amount_available: 290,
    currency: '₹ Cr',
  };

  it('calculates bounded priority score between 0 and 100 with all 4 pillars', () => {
    const priority = FusionPrioritizationEngine.calculatePriority(
      sampleSignal,
      sampleDemographic,
      sampleInfra,
      sampleBudget
    );

    expect(priority.score).toBeGreaterThanOrEqual(0);
    expect(priority.score).toBeLessThanOrEqual(100);
    expect(priority.factor_breakdown).toBeDefined();

    // Check individual pillar points
    expect(priority.factor_breakdown.demand_points).toBeGreaterThan(0);
    expect(priority.factor_breakdown.demand_points).toBeLessThanOrEqual(35);

    expect(priority.factor_breakdown.demographic_points).toBeGreaterThan(0);
    expect(priority.factor_breakdown.demographic_points).toBeLessThanOrEqual(25);

    expect(priority.factor_breakdown.deficit_points).toBeGreaterThan(0);
    expect(priority.factor_breakdown.deficit_points).toBeLessThanOrEqual(25);

    expect(priority.factor_breakdown.budget_points).toBeGreaterThan(0);
    expect(priority.factor_breakdown.budget_points).toBeLessThanOrEqual(15);
  });

  it('ensures percentage breakdown sums to 100% for SHAP-style explainability', () => {
    const priority = FusionPrioritizationEngine.calculatePriority(
      sampleSignal,
      sampleDemographic,
      sampleInfra,
      sampleBudget
    );

    const { demand_pct, demographic_pct, deficit_pct, budget_pct } = priority.factor_breakdown;
    const sum = demand_pct + demographic_pct + deficit_pct + budget_pct;
    expect(sum).toBe(100);
  });

  it('includes human-readable explainable narrative explaining why prioritized', () => {
    const priority = FusionPrioritizationEngine.calculatePriority(
      sampleSignal,
      sampleDemographic,
      sampleInfra,
      sampleBudget
    );

    expect(priority.factor_breakdown.explanation).toContain('Prioritized with Score');
    expect(priority.factor_breakdown.explanation.length).toBeGreaterThan(30);
  });

  it('stores and asserts model version v1.2.0-brics-explainable', () => {
    const priority = FusionPrioritizationEngine.calculatePriority(
      sampleSignal,
      sampleDemographic,
      sampleInfra,
      sampleBudget
    );

    expect(priority.model_version).toBe(FusionPrioritizationEngine.MODEL_VERSION);
  });

  it('ranks priority scores descending with sequential rank assignments', () => {
    const scoreA = FusionPrioritizationEngine.calculatePriority(
      sampleSignal,
      sampleDemographic,
      sampleInfra,
      sampleBudget
    );

    const lowSignal = { ...sampleSignal, report_count: 1, urgency_score: 20 };
    const lowInfra = { ...sampleInfra, deficit_score: 20 };
    const scoreB = FusionPrioritizationEngine.calculatePriority(
      lowSignal,
      sampleDemographic,
      lowInfra,
      sampleBudget
    );

    const ranked = FusionPrioritizationEngine.rankScores([scoreB, scoreA]);

    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });

  it('runs scenario simulation to test funding tradeoffs ("What if we fund X instead of Y?")', () => {
    const sampleProjects: Project[] = [
      {
        id: 'PRJ-1',
        priority_score_id: 'PS-1',
        demand_signal_id: 'DS-1',
        title: 'Water Project',
        description: 'Water pipeline',
        sector: 'water',
        region_id: 'IND-BUN-02',
        region_name: 'Bundelkhand',
        nation_id: 'IND',
        status: 'recommended',
        priority_rank: 1,
        priority_score: 92,
        factor_breakdown: {
          demand_points: 30,
          demographic_points: 22,
          deficit_points: 24,
          budget_points: 14,
          demand_pct: 33,
          demographic_pct: 24,
          deficit_pct: 26,
          budget_pct: 17,
          explanation: 'Test',
        },
        funded_amount: 0,
        estimated_cost: 35,
        citizen_report_count: 12,
        impact_indicators: [{ metric: 'Beneficiaries', baseline: 0, projected: 120000, unit: 'citizens' }],
        timeline: [],
      },
      {
        id: 'PRJ-2',
        priority_score_id: 'PS-2',
        demand_signal_id: 'DS-2',
        title: 'Roads Project',
        description: 'Highway repair',
        sector: 'roads',
        region_id: 'IND-MUM-03',
        region_name: 'Dharavi',
        nation_id: 'IND',
        status: 'recommended',
        priority_rank: 2,
        priority_score: 84,
        factor_breakdown: {
          demand_points: 25,
          demographic_points: 20,
          deficit_points: 20,
          budget_points: 12,
          demand_pct: 32,
          demographic_pct: 26,
          deficit_pct: 26,
          budget_pct: 16,
          explanation: 'Test',
        },
        funded_amount: 0,
        estimated_cost: 50,
        citizen_report_count: 8,
        impact_indicators: [{ metric: 'Beneficiaries', baseline: 0, projected: 250000, unit: 'citizens' }],
        timeline: [],
      },
    ];

    const budgetLines: BudgetLine[] = [
      { id: 'BL-1', nation_id: 'IND', sector: 'water', fiscal_year: '2026-27', amount_allocated: 100, amount_available: 50, currency: '₹ Cr' },
      { id: 'BL-2', nation_id: 'IND', sector: 'roads', fiscal_year: '2026-27', amount_allocated: 120, amount_available: 40, currency: '₹ Cr' },
    ];

    // Selecting PRJ-1 (Cost 35 within Water 50 available)
    const result = FusionPrioritizationEngine.simulateScenario(sampleProjects, ['PRJ-1'], budgetLines);
    expect(result.totalCost).toBe(35);
    expect(result.totalBeneficiaries).toBe(120000);
    expect(result.sectorBudgetUtilization.water.used).toBe(35);
    expect(result.sectorBudgetUtilization.water.remaining).toBe(15);
    expect(result.sectorBudgetUtilization.water.isExceeded).toBe(false);

    // Selecting PRJ-2 (Cost 50 exceeds Roads 40 available)
    const resultOver = FusionPrioritizationEngine.simulateScenario(sampleProjects, ['PRJ-2'], budgetLines);
    expect(resultOver.sectorBudgetUtilization.roads.isExceeded).toBe(true);
  });
});
