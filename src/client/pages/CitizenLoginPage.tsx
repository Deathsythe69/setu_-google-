import React, { useState } from 'react';
import { Mail, KeyRound, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Volume2, Sparkles, Lock } from 'lucide-react';
import { UserRole } from '../App.js';

interface CitizenLoginPageProps {
  onNavigate: (tab: string) => void;
  onLoginSuccess: (user: { email: string; token: string; role: UserRole }) => void;
}

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to dispatch verification code');
      }

      setMessage(data.message);
      if (data.devOtp) {
        setDevCode(data.devOtp);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Error requesting login code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      const verifiedRole = (data.role as UserRole) || 'citizen';
      onLoginSuccess({
        email: email.trim().toLowerCase(),
        token: data.token,
        role: verifiedRole,
      });

      // If official, take to policymaker, otherwise take to report intake
      if (verifiedRole === 'policymaker' || verifiedRole === 'admin') {
        onNavigate('policymaker');
      } else if (verifiedRole === 'governance_officer') {
        onNavigate('governance');
      } else {
        onNavigate('report');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 960,
      margin: '40px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 16px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(0, 97, 148, 0.08)',
        border: '1px solid rgba(0, 97, 148, 0.2)',
        color: '#006194',
        fontWeight: 700,
        fontSize: '12px',
        marginBottom: 20,
      }}>
        <UserCheck size={16} />
        <span>SOVEREIGN PUBLIC INTAKE · CITIZEN LOGIN</span>
      </div>

      {/* Main Login Card */}
      <div style={{
        width: '100%',
        maxWidth: 500,
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 24,
        padding: '36px 32px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--border-subtle)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}>
            Citizen Access Portal
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            Sign in with your email to file grievances, track repair progress, and receive community infrastructure updates without passwords.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 12,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: 20,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 12,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            fontSize: '13px',
            marginBottom: 20,
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                backgroundColor: '#006194',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0, 97, 148, 0.3)',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>{isLoading ? 'Dispatching Code...' : 'Send Login Code (OTP)'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#006194',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Change Email
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {devCode && (
              <div style={{
                padding: '12px 14px',
                borderRadius: 10,
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                border: '1px dashed #eab308',
                fontSize: '12px',
                color: 'var(--text-primary)',
              }}>
                <strong>Local Dev Active:</strong> Your 6-digit code is{' '}
                <span style={{ fontWeight: 800, color: '#ca8a04', letterSpacing: '0.05em' }}>{devCode}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                backgroundColor: '#006194',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0, 97, 148, 0.3)',
              }}
            >
              <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
              <CheckCircle2 size={16} />
            </button>
          </form>
        )}

        {/* Link to Official Login */}
        <div style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Are you a Municipal Authority or Urban Planner?
          </p>
          <button
            onClick={() => onNavigate('official-login')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              padding: '8px 16px',
              borderRadius: 10,
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background-color 0.2s',
            }}
          >
            <Lock size={14} style={{ color: '#006194' }} />
            <span>Switch to Official Authority Login →</span>
          </button>
        </div>
      </div>

      {/* Trust guarantees footer */}
      <div style={{
        marginTop: 28,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          Zero-PII Storage (Names &amp; Phone Numbers tokenized)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} style={{ color: '#006194' }} />
          DPGA Certified Open Digital Public Good
        </span>
      </div>
    </div>
  );
};
