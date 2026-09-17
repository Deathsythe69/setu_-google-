import React, { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations.js';
import {
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Landmark,
  Sparkles,
  Trash2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface StatusTrackerProps {
  currentLang: string;
  initialTrackingId?: string;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentLang,
  initialTrackingId = '',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const [trackingIdInput, setTrackingIdInput] = useState<string>(initialTrackingId || 'SETU-IND-9842');
  const [reportData, setReportData] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [erasureSuccess, setErasureSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialTrackingId) {
      setTrackingIdInput(initialTrackingId);
      fetchStatus(initialTrackingId);
    } else {
      fetchStatus(trackingIdInput);
    }
  }, [initialTrackingId]);

  const fetchStatus = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setIsLoading(true);
    setError(null);
    setErasureSuccess(null);

    try {
      const res = await fetch(`/api/reports/track/${idToSearch.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Report not found with this tracking ID');
      }

      setReportData(data.report);
      setTimeline(data.timeline);
    } catch (err: any) {
      setError(err.message);
      setReportData(null);
      setTimeline([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(trackingIdInput);
  };

  const handleErasure = async () => {
    if (!reportData) return;
    const confirm = window.confirm(
      'Are you sure you want to unlink your personal submission link? The report content will remain anonymized in aggregate planning data per DPG standards.'
    );
    if (!confirm) return;

    try {
      const res = await fetch('/api/reports/erase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: reportData.tracking_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setErasureSuccess('Your personal link to this report has been permanently erased.');
        fetchStatus(reportData.tracking_id);
      }
    } catch (err) {
      console.error('Erasure error:', err);
    }
  };

  const stepIcons = [
    <Clock size={18} />,
    <Layers size={18} />,
    <Landmark size={18} />,
    <Sparkles size={18} />,
    <CheckCircle2 size={18} />,
  ];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
          {t('tabTrack')}
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
          Follow your infrastructure report from community intake to verified municipal funding and construction.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          backgroundColor: 'var(--bg-surface)',
          padding: 8,
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--elevation-1)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <input
          type="text"
          value={trackingIdInput}
          onChange={(e) => setTrackingIdInput(e.target.value)}
          placeholder={t('searchPlaceholder')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Search size={16} />
          <span>{isLoading ? 'Searching...' : t('trackButton')}</span>
        </button>
      </form>

      {/* Quick Demo Search Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 'var(--text-xs)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Try pre-loaded reports:</span>
        {['SETU-IND-9842', 'SETU-IND-5520', 'SETU-IND-7711'].map((id) => (
          <button
            key={id}
            onClick={() => {
              setTrackingIdInput(id);
              fetchStatus(id);
            }}
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {id}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-critical-light)',
          color: 'var(--color-critical)',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {erasureSuccess && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-success-light)',
          color: 'var(--color-success)',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20
        }}>
          <CheckCircle2 size={20} />
          <span>{erasureSuccess}</span>
        </div>
      )}

      {/* Report Status & 5-Step Vertical Timeline */}
      {reportData && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--elevation-2)',
        }}>
          {/* Summary Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 16,
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Tracking ID: {reportData.tracking_id}
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginTop: 2 }}>
                {reportData.project_title || `${reportData.category.toUpperCase()} Infrastructure Report`}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                Sector: <strong style={{ textTransform: 'capitalize' }}>{reportData.category}</strong> · Submitted via{' '}
                <strong>{reportData.channel.toUpperCase()}</strong> ({reportData.submitted_at.split('T')[0]})
              </p>
            </div>

            <div style={{
              textAlign: 'right',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: reportData.status === 'funded' ? 'var(--color-success-light)' : 'var(--color-primary-light)',
              color: reportData.status === 'funded' ? 'var(--color-success)' : 'var(--color-primary)',
              fontWeight: 800,
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
            }}>
              {reportData.status}
            </div>
          </div>

          {/* Vertical Timeline (Design.md §3) */}
          <div style={{ position: 'relative', paddingLeft: 32, marginBottom: 28 }}>
            {/* Connecting Vertical Bar */}
            <div style={{
              position: 'absolute',
              left: 11,
              top: 10,
              bottom: 10,
              width: 2,
              backgroundColor: 'var(--color-neutral-200)',
            }} />

            {timeline.map((step, idx) => {
              const isDone = step.completed;
              return (
                <div key={idx} style={{ position: 'relative', marginBottom: 24 }}>
                  {/* Step Circle Node */}
                  <div style={{
                    position: 'absolute',
                    left: -32,
                    top: 0,
                    width: 24,
                    height: 24,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isDone ? 'var(--color-success)' : 'var(--bg-surface)',
                    border: `2px solid ${isDone ? 'var(--color-success)' : 'var(--color-neutral-300)'}`,
                    color: isDone ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isDone ? '0 0 0 4px var(--color-success-light)' : 'none',
                  }}>
                    {isDone ? <CheckCircle2 size={14} /> : <span style={{ fontSize: 10, fontWeight: 700 }}>{idx + 1}</span>}
                  </div>

                  {/* Step Content */}
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                      color: isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <span>{step.step}</span>
                      {isDone && (
                        <span style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 600 }}>
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transcript Snippet */}
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-xs)',
            marginBottom: 20,
          }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Verified Report Transcript: </span>
            <span style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>
              "{reportData.english_transcript}"
            </span>
          </div>

          {/* Citizen Privacy & Right to Erasure Section (Rules.md §2) */}
          <div style={{
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            fontSize: 'var(--text-xs)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-primary)' }} />
              <span>{t('erasureNotice')}</span>
            </div>

            {reportData.status !== 'erased' && (
              <button
                onClick={handleErasure}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-critical-border)',
                  color: 'var(--color-critical)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--text-xs)',
                }}
              >
                <Trash2 size={13} />
                <span>{t('requestErasure')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
