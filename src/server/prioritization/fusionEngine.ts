import {
  BudgetLine,
  DemandSignal,
  DemographicUnit,
  FactorBreakdown,
  InfrastructureIndex,
  PriorityScore,
  Project,
  SectorCategory,
} from '../types/index.js';

export interface SimulationResult {
  selectedProjectIds: string[];
  totalCost: number;
  totalBeneficiaries: number;
  avgDeficitReductionPct: number;
  sectorBudgetUtilization: Record<
    SectorCategory,
    {
      allocated: number;
      used: number;
      available: number;
      remaining: number;
      isExceeded: boolean;
    }
  >;
  comparisonWithTopN: {
    recommendedTopNCost: number;
    scenarioCost: number;
    recommendedBeneficiaries: number;
    scenarioBeneficiaries: number;
  };
}

export class FusionPrioritizationEngine {
  public static readonly MODEL_VERSION = 'v1.2.0-brics-explainable';

  /**
   * Calculates explainable priority score for a demand signal against demographic,
   * infrastructure index, and budget data.
   */
  public static calculatePriority(
    signal: DemandSignal,
    demographic: DemographicUnit,
    infraIndex: InfrastructureIndex,
    budget: BudgetLine
  ): PriorityScore {
    // 1. Demand Pillar (Max 35 points)
    // - Volume (logarithmic scale up to 20 pts)
    const volumePoints = Math.min(20, Math.round(Math.log2(signal.report_count + 1) * 4));
    // - Urgency (up to 10 pts)
    const urgencyPoints = Math.min(10, Math.round((signal.urgency_score / 100) * 10));
    // - Sentiment distress (up to 5 pts)
    const sentimentPoints = signal.sentiment < 0 ? Math.min(5, Math.round(Math.abs(signal.sentiment) * 5)) : 1;
    const demand_points = Math.min(35, Math.max(0, volumePoints + urgencyPoints + sentimentPoints));

    // 2. Demographic Vulnerability Pillar (Max 25 points)
    // - Vulnerability index (0-100 -> max 15 pts)
    const vulnPoints = Math.round((demographic.vulnerability_index / 100) * 15);
    // - Density points (max 6 pts)
    let densityPoints = 2;
    if (demographic.density_sq_km > 10000) densityPoints = 6;
    else if (demographic.density_sq_km > 3000) densityPoints = 4;
    // - Scale points (max 4 pts)
    const scalePoints = Math.min(4, Math.round((demographic.population / 250000) * 4));
    const demographic_points = Math.min(25, Math.max(0, vulnPoints + densityPoints + scalePoints));

    // 3. Infrastructure Deficit Pillar (Max 25 points)
    // - Regional deficit index (0-100 -> max 25 pts)
    const deficit_points = Math.min(25, Math.max(0, Math.round((infraIndex.deficit_score / 100) * 25)));

    // 4. Budget Envelope Fit Pillar (Max 15 points)
    // Estimated cost based on sector scale and deficit depth
    const estimated_cost = this.estimateProjectCost(signal.category, infraIndex.deficit_score, signal.nation_id);
    let budget_points = 5;
    if (budget.amount_available > 0) {
      const costRatio = estimated_cost / budget.amount_available;
      if (costRatio <= 0.25) budget_points = 15; // easily absorbed
      else if (costRatio <= 0.5) budget_points = 12;
      else if (costRatio <= 0.8) budget_points = 9;
      else if (costRatio <= 1.0) budget_points = 6;
      else budget_points = 2; // exceeds available budget envelope
    }

    const total_score = Math.min(100, Math.max(5, demand_points + demographic_points + deficit_points + budget_points));

    // Calculate percentage contribution for SHAP-style breakdown
    const demand_pct = Math.round((demand_points / total_score) * 100);
    const demographic_pct = Math.round((demographic_points / total_score) * 100);
    const deficit_pct = Math.round((deficit_points / total_score) * 100);
    const budget_pct = Math.max(0, 100 - (demand_pct + demographic_pct + deficit_pct));

    // Generate human-readable explanation
    const explanation = this.generateExplanation(
      signal,
      demographic,
      infraIndex,
      total_score,
      demand_points,
      demographic_points,
      deficit_points,
      budget_points
    );

    const factor_breakdown: FactorBreakdown = {
      demand_points,
      demographic_points,
      deficit_points,
      budget_points,
      demand_pct,
      demographic_pct,
      deficit_pct,
      budget_pct,
      explanation,
    };

    const estimated_beneficiaries = Math.round(
      demographic.population * (infraIndex.deficit_score / 100) * 0.65
    );

    return {
      id: `PS-${signal.id}`,
      demand_signal_id: signal.id,
      nation_id: signal.nation_id,
      region_id: signal.region_id,
      sector: signal.category,
      score: total_score,
      rank: 0, // Assigned after sorting full queue
      factor_breakdown,
      estimated_cost,
      estimated_beneficiaries,
      model_version: this.MODEL_VERSION,
      generated_at: new Date().toISOString(),
    };
  }

  /**
   * Ranks an array of PriorityScores descending and assigns rank numbers
   */
  public static rankScores(scores: PriorityScore[]): PriorityScore[] {
    return [...scores]
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
  }

  /**
   * Scenario Simulator ("What if we fund X instead of Y?")
   */
  public static simulateScenario(
    allProjects: Project[],
    selectedProjectIds: string[],
    budgetLines: BudgetLine[]
  ): SimulationResult {
    const selectedSet = new Set(selectedProjectIds);
    const selectedProjects = allProjects.filter((p) => selectedSet.has(p.id));

    let totalCost = 0;
    let totalBeneficiaries = 0;
    let totalDeficitPts = 0;

    // Sector budget tracking
    const sectorBudgetMap: Record<SectorCategory, { allocated: number; used: number; available: number; remaining: number; isExceeded: boolean }> = {
      roads: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      water: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      electricity: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      sanitation: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      transit: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      healthcare: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      schools: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
      drainage: { allocated: 0, used: 0, available: 0, remaining: 0, isExceeded: false },
    };

    budgetLines.forEach((bl) => {
      if (sectorBudgetMap[bl.sector]) {
        sectorBudgetMap[bl.sector].allocated += bl.amount_allocated;
        sectorBudgetMap[bl.sector].available += bl.amount_available;
        sectorBudgetMap[bl.sector].remaining += bl.amount_available;
      }
    });

    selectedProjects.forEach((p) => {
      totalCost += p.estimated_cost;
      const beneficiaries = p.impact_indicators?.find((i) => 
        i.metric.toLowerCase().includes('people') || 
        i.metric.toLowerCase().includes('residents') || 
        i.metric.toLowerCase().includes('beneficiar')
      )?.projected || 45000;
      totalBeneficiaries += beneficiaries;
      totalDeficitPts += p.factor_breakdown.deficit_points;

      if (sectorBudgetMap[p.sector]) {
        sectorBudgetMap[p.sector].used += p.estimated_cost;
        sectorBudgetMap[p.sector].remaining = sectorBudgetMap[p.sector].available - sectorBudgetMap[p.sector].used;
        sectorBudgetMap[p.sector].isExceeded = sectorBudgetMap[p.sector].remaining < 0;
      }
    });

    // Baseline Top-N for comparison
    const topN = allProjects.slice(0, selectedProjects.length);
    const recommendedTopNCost = topN.reduce((acc, p) => acc + p.estimated_cost, 0);
    const recommendedBeneficiaries = topN.reduce((acc, p) => {
      const b = p.impact_indicators?.find((i) => 
        i.metric.toLowerCase().includes('people') || 
        i.metric.toLowerCase().includes('residents') || 
        i.metric.toLowerCase().includes('beneficiar')
      )?.projected || 45000;
      return acc + b;
    }, 0);

    const avgDeficitReductionPct = selectedProjects.length > 0 
      ? Math.round((totalDeficitPts / (selectedProjects.length * 25)) * 100) 
      : 0;

    return {
      selectedProjectIds,
      totalCost,
      totalBeneficiaries,
      avgDeficitReductionPct,
      sectorBudgetUtilization: sectorBudgetMap,
      comparisonWithTopN: {
        recommendedTopNCost,
        scenarioCost: totalCost,
        recommendedBeneficiaries,
        scenarioBeneficiaries: totalBeneficiaries,
      },
    };
  }

  private static estimateProjectCost(sector: SectorCategory, deficitScore: number, nation_id: string): number {
    // Multipliers calibrated to respective nation currency denominations
    // India in ₹ Crores (e.g., 15 - 85 Cr)
    // Brazil in R$ Millions (e.g., 8 - 45 M)
    // South Africa in R Millions (e.g., 20 - 95 M)
    const baseCosts: Record<SectorCategory, number> = {
      water: 28,
      roads: 45,
      drainage: 22,
      sanitation: 18,
      transit: 38,
      electricity: 26,
      healthcare: 32,
      schools: 19,
    };

    const base = baseCosts[sector] || 25;
    const severityFactor = 0.5 + (deficitScore / 100) * 0.8;
    const rawCost = Math.round(base * severityFactor);

    if (nation_id === 'BRA') return Math.round(rawCost * 0.6);
    if (nation_id === 'ZAF') return Math.round(rawCost * 1.2);
    return rawCost;
  }

  private static generateExplanation(
    signal: DemandSignal,
    demographic: DemographicUnit,
    infra: InfrastructureIndex,
    score: number,
    demandPts: number,
    demographicPts: number,
    deficitPts: number,
    budgetPts: number
  ): string {
    const drivers: string[] = [];

    if (demandPts >= 24) {
      drivers.push(`high citizen report intensity (${signal.report_count} clustered submissions, ${demandPts}/35 pts)`);
    }
    if (deficitPts >= 18) {
      drivers.push(`acute baseline infrastructure deficit of ${infra.deficit_score}% in ${signal.category} (${deficitPts}/25 pts)`);
    }
    if (demographicPts >= 18) {
      drivers.push(`high socio-economic vulnerability (${demographic.vulnerability_index}/100) in ${demographic.region_name} (${demographicPts}/25 pts)`);
    }
    if (budgetPts >= 12) {
      drivers.push(`immediate fiscal feasibility within available sector budget envelope (${budgetPts}/15 pts)`);
    }

    if (drivers.length === 0) {
      drivers.push(`balanced demand volume and regional deficit alignment`);
    }

    return `Prioritized with Score ${score}/100 driven by ${drivers.join(' and ')}.`;
  }
}
