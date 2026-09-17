import React, { useState } from 'react';
import { Project, BudgetLine } from '../../server/types/index.js';
import { ExplainabilityBar } from './ExplainabilityBar.js';
import { X, CheckCircle, Clock, ShieldCheck, DollarSign, Users, AlertCircle, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EvidenceDrawerProps {
  project: Project | null;
  budget?: BudgetLine;
  evidenceReports: any[];
  onClose: () => void;
  onFundProject: (projectId: string, approvedBy: string) => Promise<void>;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  project,
  budget,
  evidenceReports,
  onClose,
  onFundProject,
}) => {
  const [approverName, setApproverName] = useState<string>('Director of Municipal Infrastructure (Human Sign-off)');
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  if (!project) return null;

  const handleFund = async () => {
    setIsFunding(true);
    try {
      await onFundProject(project.id, approverName);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowConfirm(false);
    } catch (err) {
      console.error('Error approving funding:', err);
    } finally {
      setIsFunding(false);
    }
  };

  const isFunded = project.status === 'funded' || project.status === 'in_progress' || project.status === 'completed';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 200,
        transition: 'opacity var(--duration-base)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          overflowY: 'auto',
          boxShadow: 'var(--elevation-4)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-surface)',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                backgroundColor: isFunded ? 'var(--color-success-light)' : 'var(--color-primary-light)',
                color: isFunded ? 'var(--color-success)' : 'var(--color-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase'
              }}>
                {project.status}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Sector: {project.sector.toUpperCase()} · Rank #{project.priority_rank}
              </span>
            </div>
            <h2 id="drawer-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>
              {project.title}
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
              {project.region_name} ({project.nation_id})
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close detail panel"
            style={{
              padding: 8,
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
          {/* Explainability Breakdown */}
          <ExplainabilityBar
            breakdown={project.factor_breakdown}
            score={project.priority_score}
            rank={project.priority_rank}
          />

          {/* Budget vs Demand Alignment Box */}
          <div style={{
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarSign size={16} style={{ color: 'var(--color-success)' }} />
              <span>Fiscal Budget Envelope vs Project Demand</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Estimated Investment Required</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {project.estimated_cost} {budget?.currency || 'Cr'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Available in Sector Envelope</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-success)' }}>
                  {budget?.amount_available || 180} {budget?.currency || 'Cr'}
                </div>
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Budget Consumption</span>
                <span>{Math.round((project.estimated_cost / (budget?.amount_available || 180)) * 100)}% of remaining</span>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-neutral-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, Math.round((project.estimated_cost / (budget?.amount_available || 180)) * 100))}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-success)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Impact Indicators */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={16} style={{ color: 'var(--color-primary)' }} />
              <span>Projected Impact Indicators</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {project.impact_indicators.map((ind, i) => (
                <div key={i} style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ind.metric}</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                    {ind.projected.toLocaleString()} {ind.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Trail: Linked Citizen Reports */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={16} style={{ color: 'var(--color-warning)' }} />
                <span>Evidence Trail: Clustered Citizen Reports ({evidenceReports.length})</span>
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                PII Stripped · Sovereign Log
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
              {evidenceReports.map((rep, idx) => (
                <div
                  key={rep.id || idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 'var(--text-xs)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>
                      {rep.tracking_id} · Channel: <strong>{rep.channel.toUpperCase()}</strong> ({rep.lang})
                    </span>
                    <span style={{ fontWeight: 600, color: rep.urgency_score >= 8 ? 'var(--color-critical)' : 'var(--text-secondary)' }}>
                      Urgency {rep.urgency_score}/10
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    "{rep.english_transcript || rep.original_script}"
                  </div>
                  {rep.landmark && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 4 }}>
                      📍 Reported near {rep.landmark}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Funding Authorization Section (Rule 3: No silent autonomy!) */}
          <div style={{
            marginTop: 'auto',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isFunded ? 'var(--color-success-light)' : 'var(--color-primary-light)',
            border: `1px solid ${isFunded ? 'var(--color-success-border)' : 'var(--color-primary-border)'}`
          }}>
            {isFunded ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-success)' }}>
                    Project Formally Funded & Capital Allocated
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Authorized by: {project.approved_by} on {project.approved_at?.split('T')[0]}
                  </div>
                </div>
              </div>
            ) : showConfirm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                  Confirm Human Policymaker Authorization
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Per Rules.md §3, Setu does not auto-disburse public funds. Please enter your name/title to authorize allocation of <strong>{project.estimated_cost} {budget?.currency || 'Cr'}</strong>.
                </p>
                <input
                  type="text"
                  aria-label="Authorizing authority name and title"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 'var(--text-xs)',
                    width: '100%'
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleFund}
                    disabled={isFunding}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: 'var(--color-success)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Authorize & Fund Project</span>
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    style={{
                      padding: '10px 16px',
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                    Human Decision Required
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Recommends allocating {project.estimated_cost} {budget?.currency || 'Cr'}
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirm(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    boxShadow: 'var(--elevation-2)'
                  }}
                >
                  Approve & Fund
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
