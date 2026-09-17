import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, Key, Copy, Check, Trash2, Building2, RefreshCw, AlertCircle } from 'lucide-react';

interface AdminOfficialManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
}

export const AdminOfficialManagerModal: React.FC<AdminOfficialManagerModalProps> = ({
  isOpen,
  onClose,
  adminEmail,
}) => {
  const [officials, setOfficials] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<'policymaker' | 'governance_officer'>('policymaker');
  const [newDepartment, setNewDepartment] = useState<string>('Department of Municipal Works');
  const [newPassword, setNewPassword] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOfficials = async () => {
    try {
      const res = await fetch('/api/auth/official/list', {
        headers: {
          'x-user-role': 'admin',
          'x-user-email': adminEmail,
        },
      });
      const data = await res.json();
      if (data.officials) {
        setOfficials(data.officials);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOfficials();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setError('Please provide a valid official email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/official/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
          'x-user-email': adminEmail,
        },
        body: JSON.stringify({
          email: newEmail.trim().toLowerCase(),
          role: newRole,
          department: newDepartment.trim(),
          password: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to generate official credentials');
      }

      setMessage(`Credentials generated for ${data.credential.email}! Password: ${data.credential.generatedPassword}`);
      setNewEmail('');
      setNewPassword('');
      await fetchOfficials();
    } catch (err: any) {
      setError(err.message || 'Error creating official account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (targetEmail: string) => {
    if (!confirm(`Are you sure you want to deactivate authority for ${targetEmail}?`)) return;

    try {
      await fetch('/api/auth/official/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
          'x-user-email': adminEmail,
        },
        body: JSON.stringify({ email: targetEmail }),
      });
      await fetchOfficials();
    } catch {
      // ignore
    }
  };

  const copyCredentials = (item: any, idx: number) => {
    const text = `Setu Official Authority Credentials\nEmail: ${item.email}\nRole: ${item.role}\nDepartment: ${item.department}\nPassword: ${item.passwordSnippet || 'SetuOfficial#2026'}\nPortal: http://localhost:5173`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 720,
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 20,
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              color: '#ca8a04',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Official Authority Account Generator
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Authenticated Admin: {adminEmail}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 10,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 10,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            fontSize: '13px',
            wordBreak: 'break-all',
          }}>
            {message}
          </div>
        )}

        {/* Generate New Account Form */}
        <form onSubmit={handleCreateOfficial} style={{
          padding: 18,
          borderRadius: 16,
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            + Issue New Municipal Official Credentials
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Official Email
              </label>
              <input
                type="email"
                required
                placeholder="official@municipality.gov.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Sovereign Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="policymaker">Municipal Policymaker / Planner</option>
                <option value="governance_officer">AI Governance &amp; Compliance Auditor</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Department
              </label>
              <input
                type="text"
                placeholder="Department name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Password (optional, auto-generated if empty)
              </label>
              <input
                type="text"
                placeholder="Auto-generated if empty"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              alignSelf: 'flex-end',
              padding: '8px 18px',
              borderRadius: 8,
              backgroundColor: '#006194',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <UserPlus size={15} />
            <span>{isLoading ? 'Generating...' : 'Generate Official Account'}</span>
          </button>
        </form>

        {/* Existing Accounts Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Active Official Authority Ledgers
            </h3>
            <button
              onClick={fetchOfficials}
              style={{
                background: 'none',
                border: 'none',
                color: '#006194',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          <div style={{
            maxHeight: 220,
            overflowY: 'auto',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px' }}>Official Email</th>
                  <th style={{ padding: '8px 12px' }}>Role</th>
                  <th style={{ padding: '8px 12px' }}>Department</th>
                  <th style={{ padding: '8px 12px' }}>Password</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officials.map((o, idx) => (
                  <tr key={o.email} style={{ borderBottom: '1px solid var(--border-subtle)', opacity: o.isActive === false ? 0.5 : 1 }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{o.email}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: o.role === 'admin' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(0, 97, 148, 0.1)',
                        color: o.role === 'admin' ? '#ca8a04' : '#006194',
                      }}>
                        {o.role}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{o.department}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <code>{o.passwordSnippet}</code>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          onClick={() => copyCredentials(o, idx)}
                          title="Copy credentials"
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-surface)',
                            cursor: 'pointer',
                            color: copiedIndex === idx ? '#10b981' : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                        {o.role !== 'admin' && o.isActive !== false && (
                          <button
                            onClick={() => handleRevoke(o.email)}
                            title="Revoke access"
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
