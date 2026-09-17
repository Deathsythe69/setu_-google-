import React from 'react';
import { ShieldAlert, LogIn, ArrowLeft, KeyRound, Lock } from 'lucide-react';

interface ForbiddenPageProps {
  requiredRole?: string;
  currentRole?: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({
  requiredRole = 'Municipal Policymaker or Governance Officer',
  currentRole = 'citizen',
  onNavigate,
  onOpenAuth,
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
      {/* 403 Visual Indicator */}
      <div style={{
        width: 88,
        height: 88,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-warning)'
      }}>
        <Lock size={40} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-warning)' }}>
        <span>HTTP STATUS 403</span>
        <span>·</span>
        <span>SOVEREIGN CLEARANCE REQUIRED</span>
      </div>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
        Access Restricted to Authorized Officials
      </h1>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.5, margin: 0 }}>
        In accordance with <strong>Rule 3 (No Silent Autonomy)</strong>, infrastructure capital allocation and algorithmic governance auditing can only be executed by authenticated officials with sovereign credentials.
      </p>

      {/* Role Clearance Details Card */}
      <div style={{
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Required Clearance Level</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)' }}>
              {requiredRole.toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your Current Role</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {currentRole}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          If you are an authorized municipal urban planner, budget officer, or algorithmic auditor, please verify your identity using official government email authentication.
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
          <button
            onClick={onOpenAuth}
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
            <KeyRound size={16} />
            <span>Authenticate with Sovereign Email OTP</span>
          </button>

          <button
            onClick={() => onNavigate('landing')}
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
            <ArrowLeft size={16} />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
