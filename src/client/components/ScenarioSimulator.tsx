import React, { useState, useEffect } from 'react';
import { Project, BudgetLine } from '../../server/types/index.js';
import { SimulationResult, FusionPrioritizationEngine } from '../../server/prioritization/fusionEngine.js';
import { Sliders, CheckSquare, Square, AlertTriangle, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ScenarioSimulatorProps {
  projects: Project[];
  budgetLines: BudgetLine[];
  currency?: string;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  projects,
  budgetLines,
  currency = '₹ Cr',
}) => {
  // Default: select the top 3 recommended projects
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (projects.length > 0 && selectedIds.length === 0) {
      const top3 = projects.slice(0, Math.min(3, projects.length)).map((p) => p.id);
      setSelectedIds(top3);
    }
  }, [projects]);

  useEffect(() => {
    if (projects.length > 0) {
      const sim = FusionPrioritizationEngine.simulateScenario(projects, selectedIds, budgetLines);
      setSimulation(sim);
    }
  }, [selectedIds, projects, budgetLines]);

  const toggleProject = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(projects.map((p) => p.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      padding: '20px',
      boxShadow: 'var(--elevation-1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Fiscal Scenario Simulator ("What If We Fund X Instead of Y?")</span>
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Model capital allocation tradeoffs and simulate impact across regional populations before formal authorization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={selectAll}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Real-Time Impact Metric Cards */}
      {simulation && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
          {/* Total Cost */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <DollarSign size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Simulated Capital Envelope</span>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)', marginTop: 4 }}>
              {simulation.totalCost} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{currency}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
              Top-{selectedIds.length} Baseline: {simulation.comparisonWithTopN.recommendedTopNCost} {currency}
            </div>
          </div>

          {/* Beneficiaries Reached */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <Users size={14} style={{ color: 'var(--color-success)' }} />
              <span>Citizens Served</span>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-success)', marginTop: 4 }}>
              {simulation.totalBeneficiaries.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
              Targeted across {selectedIds.length} sovereign wards
            </div>
          </div>

          {/* Deficit Reduction */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <TrendingUp size={14} style={{ color: 'var(--color-warning)' }} />
              <span>Avg Deficit Mitigation</span>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-warning)', marginTop: 4 }}>
              {simulation.avgDeficitReductionPct}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
              Reduction in structural infrastructure deficit
            </div>
          </div>
        </div>
      )}

      {/* Sector Budget Overflows & Warnings */}
      {simulation && Object.entries(simulation.sectorBudgetUtilization).map(([sec, data]) => {
        if (!data.isExceeded && data.used === 0) return null;
        return (
          <div
            key={sec}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 10,
              backgroundColor: data.isExceeded ? 'var(--color-critical-light)' : 'var(--color-success-light)',
              border: `1px solid ${data.isExceeded ? 'var(--color-critical-border)' : 'var(--color-success-border)'}`,
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {data.isExceeded && <AlertTriangle size={15} style={{ color: 'var(--color-critical)' }} />}
              <span>
                Sector <strong>{sec.toUpperCase()}</strong>: Simulated allocation {data.used} {currency} of {data.available} {currency} available
              </span>
            </div>
            <span style={{ fontWeight: 700, color: data.isExceeded ? 'var(--color-critical)' : 'var(--color-success)' }}>
              {data.isExceeded ? `EXCEEDS ENVELOPE BY ${Math.abs(data.remaining)} ${currency}` : `${data.remaining} ${currency} remaining`}
            </span>
          </div>
        );
      })}

      {/* Interactive Project Toggle List */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
          TOGGLE PROJECTS TO MODEL TRADE-OFFS ({selectedIds.length} OF {projects.length} SELECTED)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
          {projects.map((proj) => {
            const isSelected = selectedIds.includes(proj.id);
            return (
              <div
                key={proj.id}
                onClick={() => toggleProject(proj.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-app)',
                  border: `1px solid ${isSelected ? 'var(--color-primary-border)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isSelected ? (
                    <CheckSquare size={18} style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <Square size={18} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      #{proj.priority_rank} · {proj.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {proj.region_name} · Score: <strong>{proj.priority_score}/100</strong> · Citizens: {proj.citizen_report_count}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {proj.estimated_cost} {currency}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {proj.sector}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
