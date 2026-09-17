import React from 'react';
import { Search, Home, ArrowLeft, Radio, MapPin, Globe } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (tab: string) => void;
  missingResource?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, missingResource }) => {
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
      {/* 404 Visual Indicator */}
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
        <Search size={40} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-muted)' }}>
        <span>HTTP STATUS 404</span>
        <span>·</span>
        <span>SOVEREIGN RESOURCE MISSING</span>
      </div>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
        Resource or Record Not Found
      </h1>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.5, margin: 0 }}>
        {missingResource
          ? `The requested record "${missingResource}" could not be located across the sovereign data partitions.`
          : 'The page, project tracking link, or grievance record you are looking for has either expired under the 90-day retention rule, been erased per citizen request, or never existed.'}
      </p>

      {/* Suggested Pathways */}
      <div style={{
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '20px',
        boxShadow: 'var(--elevation-1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 8
      }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recommended Actions
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          <button
            onClick={() => onNavigate('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer'
            }}
          >
            <Home size={15} />
            <span>Platform Landing Page</span>
          </button>

          <button
            onClick={() => onNavigate('report')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer'
            }}
          >
            <Radio size={15} />
            <span>Submit New Issue</span>
          </button>

          <button
            onClick={() => onNavigate('track')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer'
            }}
          >
            <MapPin size={15} />
            <span>Lookup Tracking ID</span>
          </button>
        </div>
      </div>
    </div>
  );
};
