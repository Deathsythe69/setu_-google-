import React from 'react';
import { AlertOctagon, RefreshCw, Home, ShieldCheck } from 'lucide-react';

interface ServerErrorPageProps {
  errorDetails?: string;
  incidentId?: string;
  onRetry?: () => void;
  onNavigateHome: () => void;
}

export const ServerErrorPage: React.FC<ServerErrorPageProps> = ({
  errorDetails,
  incidentId = `INC-${Date.now().toString(36).toUpperCase()}-DPG`,
  onRetry,
  onNavigateHome,
}) => {
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
      {/* 500 Visual Indicator */}
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
        <AlertOctagon size={40} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-critical)' }}>
        <span>HTTP STATUS 500</span>
        <span>·</span>
        <span>INTERNAL PLATFORM ERROR</span>
      </div>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
        Sovereign Node Encountered an Error
      </h1>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.5, margin: 0 }}>
        The sovereign processing engine encountered an unexpected condition. Zero citizen personal data has been compromised or stored in unencrypted memory.
      </p>

      {/* Incident Information Box */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
          <ShieldCheck size={16} />
          <span>Security Guarantee: Ingestion fail-closed state preserved.</span>
        </div>

        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-app)',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Incident Correlation ID:</span>
          <strong style={{ color: 'var(--color-primary)' }}>{incidentId}</strong>
        </div>

        {errorDetails && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '11px',
            color: 'var(--color-critical)',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            maxHeight: 120,
            overflowY: 'auto'
          }}>
            {errorDetails}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
          {onRetry && (
            <button
              onClick={onRetry}
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
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} />
              <span>Retry Operation</span>
            </button>
          )}

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
