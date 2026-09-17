import React, { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle2,
  Download,
  BookOpen,
  Shield,
  Layers,
  Award,
  ExternalLink,
  Droplets,
  Construction,
  Zap,
  Upload,
  Database,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

interface PublicPortalProps {
  currentNation: string;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({ currentNation }) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [datasetSources, setDatasetSources] = useState<any[]>([]);

  // Kaggle Upload State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(true);
  const [csvInput, setCsvInput] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [uploadNation, setUploadNation] = useState<string>(currentNation);

  useEffect(() => {
    fetchTransparencyData();
    fetchDatasetMetadata();
    setUploadNation(currentNation);
  }, [currentNation]);

  const fetchTransparencyData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/public/transparency?nation_id=${currentNation}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error loading transparency data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDatasetMetadata = async () => {
    try {
      const res = await fetch('/api/data/datasets');
      const json = await res.json();
      if (json.success && json.data_sources) {
        setDatasetSources(json.data_sources);
      }
    } catch (err) {
      console.error('Error loading dataset metadata:', err);
    }
  };

  const downloadOpenDataset = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setu-dpg-transparency-${currentNation}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvInput(text);
    };
    reader.readAsText(file);
  };

  const submitDatasetUpload = async () => {
    if (!csvInput.trim()) {
      setUploadSuccess(false);
      setUploadMessage('Please select a file or paste CSV/JSON content to upload.');
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const res = await fetch('/api/data/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFileName || 'uploaded_kaggle_dataset.csv',
          content: csvInput,
          nation_id: uploadNation,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setUploadSuccess(true);
        setUploadMessage(
          `Success: Ingested ${result.records_ingested} records (${result.inferred_type} dataset) into ${result.nation_id} partition.`
        );
        setCsvInput('');
        setSelectedFileName('');
        // Refresh views
        await fetchTransparencyData();
        await fetchDatasetMetadata();
      } else {
        setUploadSuccess(false);
        setUploadMessage(result.message || result.error || 'Failed to ingest dataset.');
      }
    } catch (err: any) {
      setUploadSuccess(false);
      setUploadMessage(err.message || 'Network error during dataset upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToReal = async () => {
    if (!window.confirm('Reset all sovereign partitions back to verified real government baseline datasets?')) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/data/reset-real', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setUploadSuccess(true);
        setUploadMessage('Sovereign data store reloaded with authentic open government baseline datasets.');
        await fetchTransparencyData();
        await fetchDatasetMetadata();
      }
    } catch (err) {
      console.error('Error resetting real baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        Loading public transparency registry...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Header */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: 800,
            }}>
              ZERO FAKE DATA · DPG COMPLIANT
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Open Government Partnership (OGP) Standard
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Public Infrastructure Transparency & Open Demand Portal
          </h1>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4, maxWidth: 680 }}>
            Every public figure grounded in verified open-access government and municipal records (Census, NITI Aayog, Jal Jeevan Mission, MoRTH, CPCB, and public civic grievances).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleResetToReal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
            title="Reload verified open government datasets"
          >
            <RefreshCw size={14} />
            <span>Reload Baseline</span>
          </button>

          <button
            onClick={downloadOpenDataset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              boxShadow: 'var(--elevation-2)'
            }}
          >
            <Download size={16} />
            <span>Export DPG Dataset (JSON)</span>
          </button>
        </div>
      </div>

      {/* Aggregate Transparency Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Verified Public Grievances</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {data.total_citizen_demands.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: 2 }}>
            CPGRAMS / BUIDCO / Janaagraha Open Records
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Active Demand Clusters</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {data.total_demand_signals}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Spatially & semantically grouped
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Funded Infrastructure Projects</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-success)', marginTop: 4 }}>
            {data.funded_projects_count}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: 2 }}>
            {data.total_funded_amount} {currentNation === 'IND' ? '₹ Cr' : currentNation === 'BRA' ? 'R$ M' : 'R M'} Total Capital
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Algorithm Model Version</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginTop: 8 }}>
            {data.methodology.scoring_model}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: 2 }}>
            Open Source (Apache-2.0)
          </div>
        </div>
      </div>

      {/* REAL-WORLD OPEN DATASETS REGISTRY (Citations & Sources) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Database size={22} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Verified Real-World Datasets Registry (Zero Fake Data)
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              All demographic, deficit, and budget metrics loaded into Setu are grounded in official public government repositories.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 12 }}>
          {datasetSources.map((src, i) => (
            <div
              key={i}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    {src.category}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'var(--color-success-light)',
                    color: 'var(--color-success)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {src.records} Records Live
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                  {src.dataset}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                  Grounded file: <code>{src.file}</code>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic' }}>
                License: {src.license}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KAGGLE & OPEN DATASET UPLOADER */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Upload size={22} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Upload Custom Open Dataset (Kaggle CSV / JSON)
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Upload your own Kaggle civic grievances, infrastructure surveys, or census CSV/JSON files to dynamically enrich the sovereign cluster and prioritization model.
            </p>
          </div>
        </div>

        {uploadMessage && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            backgroundColor: uploadSuccess ? 'var(--color-success-light)' : 'rgba(239, 68, 68, 0.1)',
            color: uploadSuccess ? 'var(--color-success)' : '#ef4444',
            border: `1px solid ${uploadSuccess ? 'var(--color-success)' : '#ef4444'}`
          }}>
            {uploadSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{uploadMessage}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {/* File Input */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px dashed var(--border-subtle)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              <FileSpreadsheet size={16} style={{ color: 'var(--color-primary)' }} />
              <span>{selectedFileName ? selectedFileName : 'Choose Kaggle CSV or JSON file...'}</span>
              <input
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            {/* Target Nation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Partition:</span>
              <select
                value={uploadNation}
                onChange={(e) => setUploadNation(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                }}
              >
                <option value="IND">IND (India)</option>
                <option value="BRA">BRA (Brazil)</option>
                <option value="ZAF">ZAF (South Africa)</option>
              </select>
            </div>

            <button
              onClick={submitDatasetUpload}
              disabled={isUploading || !csvInput.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: !csvInput.trim() ? 'var(--border-subtle)' : 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: 'var(--text-xs)',
                cursor: !csvInput.trim() || isUploading ? 'not-allowed' : 'pointer',
              }}
            >
              <Upload size={14} />
              <span>{isUploading ? 'Ingesting...' : 'Ingest Dataset into Sovereign Store'}</span>
            </button>
          </div>

          {/* Paste Raw CSV/JSON Area */}
          <div>
            <textarea
              rows={3}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="Or paste CSV data directly here (e.g. district,sector,deficit_score,existing_coverage_pct or citizen grievance rows)..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
      </div>

      {/* Funded Projects List (Accountability) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)'
      }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Funded Projects Traceable to Citizen Demand
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Every project listed here was initiated by citizen complaints, ranked transparently, and authorized by a human policymaker.
          </p>
        </div>

        {data.funded_projects.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            No funded projects in this sovereign partition yet. Policymakers can authorize recommendations from the intelligence dashboard.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.funded_projects.map((proj: any) => (
              <div
                key={proj.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      backgroundColor: 'var(--color-success-light)',
                      color: 'var(--color-success)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      ✓ {proj.status}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Sector: {proj.sector.toUpperCase()} · {proj.region_name}
                    </span>
                  </div>

                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {proj.title}
                  </h4>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Origin: <strong>{proj.citizen_reports_origin} citizen reports</strong> · Authorized by:{' '}
                    <strong>{proj.approved_by}</strong> ({proj.approved_at?.split('T')[0]})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Capital Allocated</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-success)' }}>
                    {proj.funded_amount} {currentNation === 'IND' ? '₹ Cr' : currentNation === 'BRA' ? 'R$ M' : 'R M'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Priority Score: {proj.priority_score}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "How Prioritization Works" Open Methodology Explainer (PRD §6 & Design.md §6) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--elevation-1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BookOpen size={22} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
              How Prioritization Works: Open Algorithm Specification
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Published in accordance with Digital Public Good transparency requirements (No secret black-box scoring).
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
          {data.methodology.pillars.map((pillar: any, idx: number) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>{pillar.name}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {pillar.weight}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Core Principles */}
        <div style={{
          padding: '14px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-primary-light)',
          border: '1px solid var(--color-primary-border)',
          fontSize: 'var(--text-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
            Key Governance Guarantees:
          </div>
          {data.methodology.rules.map((rule: string, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
              <span>•</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
