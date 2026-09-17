import React, { useState } from 'react';
import { ShieldX, RefreshCw, Home, WifiOff, CheckCircle2 } from 'lucide-react';

interface ServiceUnavailablePageProps {
  onNavigateHome: () => void;
  serviceName?: string;
}

export const ServiceUnavailablePage: React.FC<ServiceUnavailablePageProps> = ({
  onNavigateHome,
  serviceName = 'Sovereign PII Redaction & Privacy Gate',
}) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [healthResult, setHealthResult] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    setHealthResult(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (res.ok && data.status === 'healthy') {
        setHealthResult('Node is online and operational! You may now retry your submission.');
      } else {
        setHealthResult('Service is still undergoing maintenance or sovereign synchronization.');
      }
    } catch {
      setHealthResult('Node remains unreachable. Offline mode is active.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div style={{
      maxWidth: 720,
      margin: '60px auto',
      padding: '32px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20
    }}>
      {/* 503 Visual Indicator */}
      <div style={{
        width: 88,
        height: 88,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-critical)'
      }}>
        <ShieldX size={40} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-critical)' }}>
        <span>HTTP STATUS 503</span>
        <span>·</span>
        <span>FAIL-CLOSED SECURITY GATE ACTIVE</span>
      </div>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
        Security Gate Paused Submission
      </h1>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.5, margin: 0 }}>
        Under <strong>Rule 2 (Fail-Closed PII Guarantee)</strong>, when the Sovereign Privacy Redactor or regional ingestion node is temporarily offline, reports are <em>never</em> accepted in the clear. Submissions are paused to protect citizen identities.
      </p>

      {/* Fail-Closed Explanation Box */}
      <div style={{
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
          <WifiOff size={18} style={{ color: 'var(--color-critical)' }} />
          <span>Offline Node: {serviceName}</span>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Your reports are safely stored in your browser's encrypted local offline queue. As soon as connectivity or the redaction node is restored, queued items will sync automatically.
        </div>

        {healthResult && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: healthResult.includes('operational') ? 'var(--color-success-light)' : 'var(--bg-app)',
            color: healthResult.includes('operational') ? 'var(--color-success)' : 'var(--text-secondary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {healthResult.includes('operational') && <CheckCircle2 size={16} />}
            <span>{healthResult}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
          <button
            onClick={checkHealth}
            disabled={isChecking}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: 'var(--text-xs)',
              cursor: isChecking ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={15} className={isChecking ? 'spin' : ''} />
            <span>{isChecking ? 'Checking Node Status...' : 'Check Node Health'}</span>
          </button>

          <button
            onClick={onNavigateHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer'
            }}
          >
            <Home size={15} />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
