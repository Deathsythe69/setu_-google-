import React from 'react';
import { FactorBreakdown } from '../../server/types/index.js';

interface ExplainabilityBarProps {
  breakdown: FactorBreakdown;
  score: number;
  rank?: number;
  compact?: boolean;
}

export const ExplainabilityBar: React.FC<ExplainabilityBarProps> = ({
  breakdown,
  score,
  rank,
  compact = false,
}) => {
  const pillars = [
    { label: 'Citizen Demand', pct: breakdown.demand_pct, pts: breakdown.demand_points, max: 35, color: '#3B82F6' },
    { label: 'Demographic Need', pct: breakdown.demographic_pct, pts: breakdown.demographic_points, max: 25, color: '#8B5CF6' },
    { label: 'Infra Deficit', pct: breakdown.deficit_pct, pts: breakdown.deficit_points, max: 25, color: '#F59E0B' },
    { label: 'Budget Fit', pct: breakdown.budget_pct, pts: breakdown.budget_points, max: 15, color: '#10B981' },
  ];

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {rank ? `#${rank} · ` : ''}Score: <strong style={{ color: 'var(--color-primary)' }}>{score}/100</strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>SHAP Explainability</span>
        </div>

        {/* Stacked Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Score ${score}: Demand ${breakdown.demand_pct}%, Vulnerability ${breakdown.demographic_pct}%, Deficit ${breakdown.deficit_pct}%, Budget ${breakdown.budget_pct}%`}
          style={{
            display: 'flex',
            height: 10,
            width: '100%',
            backgroundColor: 'var(--color-neutral-200)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          {pillars.map((p, idx) => (
            <div
              key={idx}
              title={`${p.label}: ${p.pts}/${p.max} pts (${p.pct}%)`}
              style={{
                width: `${p.pct}%`,
                backgroundColor: p.color,
                height: '100%',
                transition: 'width var(--duration-base)',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-app)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
          Explainable Factor Breakdown ({score} Points Total)
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--color-primary)',
          backgroundColor: 'var(--color-primary-light)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)'
        }}>
          AUDITED v1.2.0
        </div>
      </div>

      {/* Stacked Bar */}
      <div style={{
        display: 'flex',
        height: 14,
        width: '100%',
        backgroundColor: 'var(--color-neutral-200)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        marginBottom: 10
      }}>
        {pillars.map((p, idx) => (
          <div
            key={idx}
            style={{
              width: `${p.pct}%`,
              backgroundColor: p.color,
              height: '100%',
            }}
          />
        ))}
      </div>

      {/* Legend & Point Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, fontSize: 'var(--text-xs)' }}>
        {pillars.map((p, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: p.color }} />
            <div>
              <div style={{ color: 'var(--text-muted)' }}>{p.label}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {p.pts}/{p.max} pts ({p.pct}%)
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explanatory Narrative */}
      {breakdown.explanation && (
        <div style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px dashed var(--border-subtle)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
          lineHeight: 1.5
        }}>
          💡 {breakdown.explanation}
        </div>
      )}
    </div>
  );
};
