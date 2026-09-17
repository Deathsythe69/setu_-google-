import React, { useState } from 'react';
import {
  Globe,
  Shield,
  Landmark,
  MapPin,
  Radio,
  Cpu,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  User,
  LogIn,
  LogOut,
  Home,
  Lock,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations.js';
import { OtpAuthModal } from './OtpAuthModal.js';

interface HeaderProps {
  currentNation: string;
  onNationChange: (nation: string) => void;
  currentLang: string;
  onLangChange: (lang: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOnline: boolean;
  queuedCount: number;
  currentRole: 'citizen' | 'policymaker' | 'governance_officer' | 'admin';
  onRoleChange: (role: 'citizen' | 'policymaker' | 'governance_officer' | 'admin') => void;
  onOpenAdminManager?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentNation,
  onNationChange,
  currentLang,
  onLangChange,
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  isOnline,
  queuedCount,
  currentRole,
  onRoleChange,
  onOpenAdminManager,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; token: string; role?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('setu_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: { email: string; token: string; role?: string }) => {
    setCurrentUser(user);
    localStorage.setItem('setu_auth_user', JSON.stringify(user));
    if (user.role && ['policymaker', 'governance_officer', 'admin', 'citizen'].includes(user.role)) {
      onRoleChange(user.role as any);
    } else {
      onRoleChange('citizen');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('setu_auth_user');
    onRoleChange('citizen');
  };

  const t = (key: string) => getTranslation(currentLang, key);

  const nations = [
    { id: 'IND', flag: '🇮🇳', label: 'India (Pilot)' },
    { id: 'BRA', flag: '🇧🇷', label: 'Brazil' },
    { id: 'ZAF', flag: '🇿🇦', label: 'South Africa' },
  ];

  const navItems = [
    { id: 'landing', label: 'Home / Overview', icon: <Home size={18} />, isProtected: false },
    { id: 'report', label: t('tabReport'), icon: <Radio size={18} />, isProtected: false },
    { id: 'track', label: t('tabTrack'), icon: <MapPin size={18} />, isProtected: false },
    { id: 'policymaker', label: t('tabPolicymaker'), icon: <Landmark size={18} />, isProtected: true },
    { id: 'transparency', label: t('tabTransparency'), icon: <Globe size={18} />, isProtected: false },
    { id: 'simulator', label: t('tabSimulator'), icon: <Shield size={18} />, isProtected: true },
    { id: 'governance', label: t('tabGovernance'), icon: <Cpu size={18} />, isProtected: true },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--elevation-1)'
    }}>
      {/* Top Banner: Sovereign Federation & Language */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '8px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-xs)'
      }}>
        {/* Brand & DPG Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => onTabChange('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 800,
              fontSize: 'var(--text-lg)',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            title="Return to Setu Landing Page"
          >
            <span style={{ fontSize: 24 }}>🌉</span>
            <span>SETU</span>
          </button>
          <span style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            letterSpacing: '0.04em'
          }}>
            DPG STANDARD · APACHE-2.0
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            BRICS Citizen-to-Infrastructure Intelligence
          </span>
        </div>

        {/* Controls: Sovereign Deployment, Role Selector, Language Switcher, Theme, Network */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Active Persona / Role Badge & Quick Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Role:</span>
            <select
              aria-label="Active user role"
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: currentRole === 'admin' ? 'rgba(234, 179, 8, 0.15)' : currentRole === 'governance_officer' ? 'rgba(99, 102, 241, 0.1)' : currentRole === 'policymaker' ? 'var(--color-success-light)' : 'var(--bg-app)',
                color: currentRole === 'admin' ? '#ca8a04' : currentRole === 'governance_officer' ? '#6366f1' : currentRole === 'policymaker' ? 'var(--color-success)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <option value="citizen">👤 Citizen (Public)</option>
              <option value="policymaker">🏛️ Policymaker (Official)</option>
              <option value="governance_officer">⚖️ Compliance Auditor</option>
              <option value="admin">🛡️ Super Admin (Full Clearance)</option>
            </select>
          </div>

          {/* Online / Offline status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isOnline ? 'var(--color-success-light)' : 'var(--color-critical-light)',
            color: isOnline ? 'var(--color-success)' : 'var(--color-critical)',
            fontWeight: 600,
          }}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {queuedCount > 0 && (
              <span style={{
                background: 'var(--color-warning)',
                color: '#fff',
                borderRadius: '50%',
                padding: '1px 5px',
                fontSize: 10
              }}>
                {queuedCount}
              </span>
            )}
          </div>

          {/* Sovereign Nation Partition Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Sovereignty:</span>
            <select
              aria-label="Sovereign nation partition"
              value={currentNation}
              onChange={(e) => onNationChange(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {nations.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.flag} {n.label}
                </option>
              ))}
            </select>
          </div>

          {/* Multilingual Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              aria-label="Interface language selection"
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            style={{
              padding: 6,
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User Authentication / Dual Production Gateways */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* If Admin, show Issue Credentials button */}
              {(currentUser.role === 'admin' || currentRole === 'admin') && onOpenAdminManager && (
                <button
                  onClick={onOpenAdminManager}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    color: '#ca8a04',
                    fontWeight: 700,
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                  title="Generate & Manage Official Accounts"
                >
                  <Shield size={12} />
                  <span>+ Manage Officials</span>
                </button>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: currentRole === 'admin' ? 'rgba(234, 179, 8, 0.15)' : 'var(--color-primary-light)',
                border: '1px solid',
                borderColor: currentRole === 'admin' ? 'rgba(234, 179, 8, 0.4)' : 'var(--color-primary-border)',
                fontSize: '11px',
              }}>
                <User size={13} style={{ color: currentRole === 'admin' ? '#ca8a04' : 'var(--color-primary)' }} />
                <span style={{ fontWeight: 700, color: currentRole === 'admin' ? '#ca8a04' : 'var(--color-primary)' }}>
                  {currentUser.email.split('@')[0]} ({currentUser.role || currentRole})
                </span>
                <button
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  title="Sign out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 2,
                  }}
                >
                  <LogOut size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Citizen Login Button */}
              <button
                onClick={() => onTabChange('citizen-login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                }}
              >
                <User size={12} />
                <span>Citizen Login</span>
              </button>

              {/* Official Authority Login Button */}
              <button
                onClick={() => onTabChange('official-login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  color: '#ca8a04',
                  fontWeight: 700,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                }}
              >
                <Lock size={12} />
                <span>Official Login</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <OtpAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Main Navigation Bar */}
      <nav style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        overflowX: 'auto',
        gap: 4
      }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isLocked = item.isProtected && currentRole === 'citizen';

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--duration-fast)',
                opacity: isLocked ? 0.75 : 1,
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {isLocked && (
                <span title="Requires Authority Clearance">
                  <Lock size={12} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
