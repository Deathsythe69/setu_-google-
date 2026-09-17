import React, { useState, useEffect } from 'react';
import { Project, DemandSignal, BudgetLine } from '../../server/types/index.js';
import { HotspotMap } from '../components/HotspotMap.js';
import { ExplainabilityBar } from '../components/ExplainabilityBar.js';
import { EvidenceDrawer } from '../components/EvidenceDrawer.js';
import { ScenarioSimulator } from '../components/ScenarioSimulator.js';
import {
  Landmark,
  Layers,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Filter,
  CheckCircle2,
  Users,
  Eye,
  Sliders,
} from 'lucide-react';

interface PolicymakerDashboardProps {
  currentNation: string;
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  currentNation,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [demandSignals, setDemandSignals] = useState<DemandSignal[]>([]);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>();
  const [activeView, setActiveView] = useState<'queue' | 'simulator'>('queue');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [evidenceReports, setEvidenceReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, [currentNation]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [projRes, signalsRes] = await Promise.all([
        fetch(`/api/projects?nation_id=${currentNation}`),
        fetch(`/api/demand-signals?nation_id=${currentNation}`),
      ]);

      const projData = await projRes.json();
      const signalsData = await signalsRes.json();

      setProjects(projData.projects || []);
      setBudgetLines(projData.budget_lines || []);
      setDemandSignals(signalsData.signals || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSignal = (signal: DemandSignal) => {
    setSelectedSignalId(signal.id);
    const matched = projects.find((p) => p.demand_signal_id === signal.id);
    if (matched) {
      openProjectDetail(matched);
    }
  };

  const openProjectDetail = async (project: Project) => {
    setSelectedProject(project);
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      const data = await res.json();
      setEvidenceReports(data.evidenceReports || []);
    } catch (err) {
      console.error('Error fetching evidence:', err);
    }
  };

  const handleFundProject = async (projectId: string, approvedBy: string) => {
    const res = await fetch(`/api/projects/${projectId}/fund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: approvedBy }),
    });
    const data = await res.json();
    if (res.ok) {
      // Refresh dashboard
      await fetchDashboardData();
      if (selectedProject?.id === projectId) {
        setSelectedProject(data.project);
      }
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedSector !== 'all' && p.sector !== selectedSector) return false;
    return true;
  });

  const totalCitizensReported = demandSignals.reduce((acc, s) => acc + s.report_count, 0);
  const totalFundedAmount = projects
    .filter((p) => p.status === 'funded' || p.status === 'completed')
    .reduce((acc, p) => acc + p.funded_amount, 0);
  const totalAvailableBudget = budgetLines.reduce((acc, b) => acc + b.amount_available, 0);
  const currency = budgetLines[0]?.currency || 'Cr';

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--elevation-1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            <Users size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Active Citizen Demands</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
            {totalCitizensReported} Reports
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: 2 }}>
            Across {demandSignals.length} deduplicated clusters
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--elevation-1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            <Landmark size={16} style={{ color: 'var(--color-warning)' }} />
            <span>Ranked Recommendations</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
            {projects.length} Projects
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Awaiting human policymaker sign-off
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--elevation-1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            <DollarSign size={16} style={{ color: 'var(--color-success)' }} />
            <span>Capital Disbursed / Funded</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-success)', marginTop: 6 }}>
            {totalFundedAmount} {currency}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Directly traceable to citizen demand signals
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--elevation-1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Available Sector Envelope</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)', marginTop: 6 }}>
            {totalAvailableBudget} {currency}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Sovereign FY 2026-27 Allocation
          </div>
        </div>
      </div>

      {/* Geospatial Hotspot Map */}
      <HotspotMap
        signals={demandSignals}
        selectedSector={selectedSector}
        onSelectSector={setSelectedSector}
        onSelectSignal={handleSelectSignal}
        selectedSignalId={selectedSignalId}
        nationId={currentNation}
      />

      {/* View Toggle Bar (Priority Queue vs Scenario Simulator) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 12px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
          Policymaker Planning & Decision Workspace
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setActiveView('queue')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeView === 'queue' ? 'var(--color-primary)' : 'transparent',
              color: activeView === 'queue' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            <Layers size={14} />
            <span>Ranked Recommendations ({filteredProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveView('simulator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeView === 'simulator' ? 'var(--color-primary)' : 'transparent',
              color: activeView === 'simulator' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            <Sliders size={14} />
            <span>Scenario Simulator ("What If")</span>
          </button>
        </div>
      </div>

      {/* View 1: Ranked Recommendation Queue */}
      {activeView === 'queue' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredProjects.map((project) => {
            const isFunded = project.status === 'funded' || project.status === 'completed';
            return (
              <div
                key={project.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px 20px',
                  boxShadow: 'var(--elevation-1)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all var(--duration-fast)',
                }}
              >
                {/* Left: Rank, Sector & Title */}
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: project.priority_rank === 1 ? '#FEF08A' : 'var(--bg-app)',
                      color: project.priority_rank === 1 ? '#854D0E' : 'var(--text-primary)',
                      fontWeight: 800,
                      fontSize: 'var(--text-xs)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      #{project.priority_rank}
                    </span>

                    <span style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-primary-light)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {project.sector}
                    </span>

                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {project.region_name}
                    </span>

                    {isFunded && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--color-success)',
                        backgroundColor: 'var(--color-success-light)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <CheckCircle2 size={12} /> FUNDED
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {project.title}
                  </h3>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                    {project.description}
                  </p>
                </div>

                {/* Middle: Explainability Bar Chip */}
                <div style={{ flex: '1 1 240px', maxWidth: 300 }}>
                  <ExplainabilityBar
                    breakdown={project.factor_breakdown}
                    score={project.priority_score}
                    compact={true}
                  />
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 4 }}>
                    Demand: {project.factor_breakdown.demand_pct}% · Vuln: {project.factor_breakdown.demographic_pct}% · Deficit: {project.factor_breakdown.deficit_pct}% · Budget: {project.factor_breakdown.budget_pct}%
                  </div>
                </div>

                {/* Right: Cost & Action Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Estimated Cost</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {project.estimated_cost} {currency}
                    </div>
                  </div>

                  <button
                    onClick={() => openProjectDetail(project)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isFunded ? 'var(--bg-app)' : 'var(--color-primary)',
                      color: isFunded ? 'var(--text-primary)' : '#ffffff',
                      border: isFunded ? '1px solid var(--border-subtle)' : 'none',
                      fontWeight: 700,
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{isFunded ? 'View Evidence' : 'Review & Fund'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View 2: Scenario Simulator */
        <ScenarioSimulator
          projects={projects}
          budgetLines={budgetLines}
          currency={currency}
        />
      )}

      {/* Project Detail & Evidence Drawer */}
      <EvidenceDrawer
        project={selectedProject}
        budget={budgetLines.find((b) => b.sector === selectedProject?.sector)}
        evidenceReports={evidenceReports}
        onClose={() => setSelectedProject(null)}
        onFundProject={handleFundProject}
      />
    </div>
  );
};
