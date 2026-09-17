import React, { useState } from 'react';
import { Mail, KeyRound, CheckCircle2, AlertCircle, X, Loader2, ArrowRight } from 'lucide-react';

interface OtpAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; token: string; role?: string }) => void;
}

export const OtpAuthModal: React.FC<OtpAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  if (!isOpen) return null;

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
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to send verification code');
      }

      setMessage(data.message);
      if (data.devOtp) {
        setDevCode(data.devOtp);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Error requesting OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      onLoginSuccess({ email: email.trim(), token: data.token, role: data.role || 'policymaker' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-4)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            {step === 'email' ? <Mail size={24} /> : <KeyRound size={24} />}
          </div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
            {step === 'email' ? 'Sign In with Email OTP' : 'Enter Verification Code'}
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
            {step === 'email'
              ? 'Passwordless authentication via one-time email code.'
              : `A 6-digit code was dispatched to ${email}.`}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-critical-light)',
            color: 'var(--color-critical)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-success)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <CheckCircle2 size={15} />
            <span>{message}</span>
          </div>
        )}

        {/* Development Hint if SMTP is in dev/simulated mode */}
        {devCode && (
          <div style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-app)',
            border: '1px dashed var(--color-primary)',
            fontSize: '11px',
            marginBottom: 16,
            textAlign: 'center',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Dev Code (SMTP simulated): </span>
            <strong style={{ color: 'var(--color-primary)', fontSize: '13px', letterSpacing: '2px' }}>
              {devCode}
            </strong>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 6 }}>
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.gov.in"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
              <span>Send Verification Code</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="auth-otp" style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 6 }}>
                6-Digit Code
              </label>
              <input
                id="auth-otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 800,
                  textAlign: 'center',
                  letterSpacing: '8px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-success)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={16} />}
              <span>Verify & Log In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError(null);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
