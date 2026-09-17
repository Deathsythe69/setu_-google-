import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Trash2, Sliders } from 'lucide-react';

interface GovernanceConsoleProps {
  currentNation: string;
}

export const GovernanceConsole: React.FC<GovernanceConsoleProps> = ({ currentNation }) => {
  const [auditData, setAuditData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [purgeResult, setPurgeResult] = useState<any | null>(null);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/governance/bias-audit');
      const data = await res.json();
      setAuditData(data);
    } catch (err) {
      console.error('Error fetching bias audit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurgeRetention = async () => {
    setIsPurging(true);
    try {
      const res = await fetch('/api/governance/purge-retention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nation_id: currentNation }),
      });
      const data = await res.json();
      setPurgeResult(data);
    } catch (err) {
      console.error('Retention purge error:', err);
    } finally {
      setIsPurging(false);
    }
  };

  if (isLoading || !auditData) {
    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        Loading AI governance audit telemetry...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              backgroundColor: auditData.overallStatus === 'PASSED' ? 'var(--color-success-light)' : 'var(--color-critical-light)',
              color: auditData.overallStatus === 'PASSED' ? 'var(--color-success)' : 'var(--color-critical)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: 'var(--text-xs)',
            }}>
              AUDIT {auditData.overallStatus} · RELEASE GATE COMPLIANT
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Model: <strong>{auditData.modelVersion}</strong> (Audit Date: {auditData.auditDate})
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            AI Model Governance & Multilingual Equity Console
          </h1>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4, maxWidth: 680 }}>
            Mandatory algorithmic audits per Rules.md §3. ASR accuracy, classification consistency, and scoring fairness are evaluated across language cohorts to guarantee zero linguistic or regional exclusion.
          </p>
        </div>

        <button
          onClick={fetchAuditData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} />
          <span>Re-run Cohort Audit</span>
        </button>
      </div>

      {/* Language Cohort WER Accuracy Table (WCAG AA High Contrast) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)',
      }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Language & Script Cohort Fairness Matrix (10+ Languages)
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Threshold requirement: ≥85% ASR accuracy on every cohort. Disparity flags automatically block deployment.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>LANGUAGE COHORT</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>SCRIPT FAMILY</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>SAMPLES</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>ASR ACCURACY</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>CLASSIFICATION F1</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>AVG SCORE</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>EQUITY STATUS</th>
              </tr>
            </thead>
            <tbody>
              {auditData.evaluatedCohorts.map((cohort: any, idx: number) => {
                const isPassing = cohort.asr_wer_accuracy >= 85.0 && !cohort.disparity_flag;
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-app)',
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cohort.cohort}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        fontSize: '11px',
                      }}>
                        {cohort.script}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      {cohort.reports_evaluated.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--color-success)' }}>
                      {cohort.asr_wer_accuracy}%
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                      {cohort.classification_f1}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                      {cohort.avg_priority_score} / 100
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isPassing ? 'var(--color-success-light)' : 'var(--color-critical-light)',
                        color: isPassing ? 'var(--color-success)' : 'var(--color-critical)',
                        fontWeight: 700,
                        fontSize: '11px',
                      }}>
                        {isPassing ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                        <span>{isPassing ? 'PASSED (≥85%)' : 'DISPARITY DETECTED'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Retention & Privacy Policy Manager (Rules.md §2) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Trash2 size={18} style={{ color: 'var(--color-warning)' }} />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>
              90-Day Raw Data Retention Policy Enforcement
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 640 }}>
            Per Rules.md §2, raw voice audio and original text are strictly purged after the 90-day verification window, while anonymized structured demand signals are retained indefinitely for national infrastructure planning.
          </p>
          {purgeResult && (
            <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 700 }}>
              ✓ Purge job executed: {purgeResult.purgedCount} expired report payloads purged.
            </div>
          )}
        </div>

        <button
          onClick={handlePurgeRetention}
          disabled={isPurging}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-warning-border)',
            backgroundColor: 'var(--color-warning-light)',
            color: 'var(--color-warning)',
            fontWeight: 700,
            fontSize: 'var(--text-xs)',
            cursor: isPurging ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>{isPurging ? 'Purging...' : 'Execute Retention Purge Policy'}</span>
        </button>
      </div>
    </div>
  );
};
