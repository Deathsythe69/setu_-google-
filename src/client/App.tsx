import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { LandingPage } from './pages/LandingPage.js';
import { CitizenHome } from './pages/CitizenHome.js';
import { StatusTracker } from './pages/StatusTracker.js';
import { PolicymakerDashboard } from './pages/PolicymakerDashboard.js';
import { PublicPortal } from './pages/PublicPortal.js';
import { ChannelSimulator } from './pages/ChannelSimulator.js';
import { GovernanceConsole } from './pages/GovernanceConsole.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { ForbiddenPage } from './pages/ForbiddenPage.js';
import { ServerErrorPage } from './pages/ServerErrorPage.js';
import { ServiceUnavailablePage } from './pages/ServiceUnavailablePage.js';
import { CitizenLoginPage } from './pages/CitizenLoginPage.js';
import { OfficialLoginPage } from './pages/OfficialLoginPage.js';
import { AdminOfficialManagerModal } from './components/AdminOfficialManagerModal.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { OtpAuthModal } from './components/OtpAuthModal.js';
import { SUPPORTED_LANGUAGES } from './i18n/translations.js';

export type UserRole = 'citizen' | 'policymaker' | 'governance_officer' | 'admin';

export const App: React.FC = () => {
  const [currentNation, setCurrentNation] = useState<string>('IND');
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const savedAuth = localStorage.getItem('setu_auth_user');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.role) return parsed.role;
      }
      const savedRole = localStorage.getItem('setu_user_role');
      return (savedRole as UserRole) || 'citizen';
    } catch {
      return 'citizen';
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('setu_offline_queue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [trackedReportId, setTrackedReportId] = useState<string>('');
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState<boolean>(false);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    localStorage.setItem('setu_user_role', newRole);
  };

  // Handle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Handle RTL for Arabic
  useEffect(() => {
    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
    if (langMeta?.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [currentLang]);

  // Network Online / Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue]);

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    console.log(`[Offline Sync] Reconnected. Syncing ${offlineQueue.length} queued reports to sovereign event plane...`);
    const remaining: any[] = [];

    for (const report of offlineQueue) {
      try {
        await fetch('/api/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });
      } catch (err) {
        remaining.push(report);
      }
    }

    setOfflineQueue(remaining);
    localStorage.setItem('setu_offline_queue', JSON.stringify(remaining));
  };

  const handleQueueOfflineReport = (reportPayload: any) => {
    const updated = [...offlineQueue, reportPayload];
    setOfflineQueue(updated);
    localStorage.setItem('setu_offline_queue', JSON.stringify(updated));
  };

  const handleNavigateToTrack = (trackingId: string) => {
    setTrackedReportId(trackingId);
    setActiveTab('track');
  };

  return (
    <ErrorBoundary onReset={() => setActiveTab('landing')}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          currentNation={currentNation}
          onNationChange={setCurrentNation}
          currentLang={currentLang}
          onLangChange={setCurrentLang}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          isOnline={isOnline}
          queuedCount={offlineQueue.length}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onOpenAdminManager={() => setIsAdminManagerOpen(true)}
        />

        <main style={{ flex: 1, paddingBottom: 48 }}>
          {activeTab === 'landing' && (
            <LandingPage
              currentNation={currentNation}
              onNavigate={setActiveTab}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'report' && (
            <CitizenHome
              currentLang={currentLang}
              currentNation={currentNation}
              onNavigateToTrack={handleNavigateToTrack}
              isOnline={isOnline}
              onQueueOfflineReport={handleQueueOfflineReport}
            />
          )}

          {activeTab === 'track' && (
            <StatusTracker
              currentLang={currentLang}
              initialTrackingId={trackedReportId}
            />
          )}

          {activeTab === 'policymaker' && (
            currentRole === 'citizen' ? (
              <ForbiddenPage
                requiredRole="Municipal Policymaker / Urban Planner"
                currentRole={currentRole}
                onNavigate={setActiveTab}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            ) : (
              <PolicymakerDashboard currentNation={currentNation} />
            )
          )}

          {activeTab === 'transparency' && (
            <PublicPortal currentNation={currentNation} />
          )}

          {activeTab === 'simulator' && (
            currentRole === 'citizen' ? (
              <ForbiddenPage
                requiredRole="Infrastructure Telemetry Engineer / Auditor"
                currentRole={currentRole}
                onNavigate={setActiveTab}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            ) : (
              <ChannelSimulator currentNation={currentNation} />
            )
          )}

          {activeTab === 'governance' && (
            (currentRole !== 'governance_officer' && currentRole !== 'admin') ? (
              <ForbiddenPage
                requiredRole="AI Governance & Compliance Auditor / Administrator"
                currentRole={currentRole}
                onNavigate={setActiveTab}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            ) : (
              <GovernanceConsole currentNation={currentNation} />
            )
          )}

          {/* Custom Error Pages Direct Inspection */}
          {activeTab === 'error-404' && (
            <NotFoundPage onNavigate={setActiveTab} />
          )}

          {activeTab === 'error-403' && (
            <ForbiddenPage
              requiredRole="Municipal Authority Clearance"
              currentRole={currentRole}
              onNavigate={setActiveTab}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'error-500' && (
            <ServerErrorPage
              onNavigateHome={() => setActiveTab('landing')}
              onRetry={() => setActiveTab('landing')}
            />
          )}

          {activeTab === 'error-503' && (
            <ServiceUnavailablePage
              onNavigateHome={() => setActiveTab('landing')}
            />
          )}

          {/* Two Production Login Gateways */}
          {activeTab === 'citizen-login' && (
            <CitizenLoginPage
              onNavigate={setActiveTab}
              onLoginSuccess={(user) => {
                handleRoleChange(user.role);
                localStorage.setItem('setu_auth_user', JSON.stringify(user));
              }}
            />
          )}

          {activeTab === 'official-login' && (
            <OfficialLoginPage
              onNavigate={setActiveTab}
              onLoginSuccess={(user) => {
                handleRoleChange(user.role);
                localStorage.setItem('setu_auth_user', JSON.stringify(user));
              }}
            />
          )}

          {/* Unrecognized Route Fallback (404) */}
          {![
            'landing',
            'report',
            'track',
            'policymaker',
            'transparency',
            'simulator',
            'governance',
            'citizen-login',
            'official-login',
            'error-404',
            'error-403',
            'error-500',
            'error-503',
          ].includes(activeTab) && (
            <NotFoundPage onNavigate={setActiveTab} missingResource={activeTab} />
          )}
        </main>

        <OtpAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            const role = (user.role as UserRole) || 'policymaker';
            handleRoleChange(role);
          }}
        />

        <AdminOfficialManagerModal
          isOpen={isAdminManagerOpen}
          onClose={() => setIsAdminManagerOpen(false)}
          adminEmail="debasispanigrahi7864@gmail.com"
        />

        {/* Footer */}
        <footer style={{
          padding: '24px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <strong>Setu Digital Public Good</strong> · Apache-2.0 Open Source Platform for Sovereign BRICS Deployments
            </div>
            <div>
              Built in alignment with UN Sustainable Development Goals (SDG 9, 11, 16) & DPGA Standard
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};
