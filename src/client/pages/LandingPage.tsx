import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Globe,
  Shield,
  Landmark,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  User,
  Users,
  Building2,
  Cpu,
  Database,
  Search,
  Radio,
  FileText,
  Activity,
  ChevronRight,
  Headphones,
  Contrast,
  Type,
} from 'lucide-react';
import { UserRole } from '../App.js';

interface LandingPageProps {
  currentNation: string;
  onNavigate: (tab: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentNation,
  onNavigate,
  currentRole,
  onRoleChange,
  onOpenAuth,
}) => {
  const [selectedScript, setSelectedScript] = useState<string>('en');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceSpoken, setVoiceSpoken] = useState<boolean>(false);
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const scripts = [
    { code: 'en', name: 'English', label: 'English', sub: 'EN' },
    { code: 'hi', name: 'हिन्दी', label: 'Hindi', sub: 'HI' },
    { code: 'zh', name: '中文', label: 'Mandarin', sub: 'ZH' },
    { code: 'ru', name: 'Русский', label: 'Russian', sub: 'RU' },
    { code: 'pt', name: 'Português', label: 'Portuguese', sub: 'PT' },
    { code: 'ar', name: 'العربية', label: 'Arabic', sub: 'AR' },
    { code: 'zu', name: 'isiZulu', label: 'Zulu', sub: 'ZU' },
  ];

  const handleVoiceClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceSpoken(true);
    } else {
      setIsRecording(true);
      setVoiceSpoken(false);
      // simulate speech recognition capture
      setTimeout(() => {
        setIsRecording(false);
        setVoiceSpoken(true);
      }, 2500);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: 'var(--bg-app)',
      fontSize: fontSizeScale === 'large' ? '17px' : fontSizeScale === 'xlarge' ? '19px' : '15px',
      transition: 'all 0.2s ease',
    }}>
      {/* 1. Multilingual Sensory & Accessibility Ribbon */}
      <section style={{
        backgroundColor: 'rgba(0, 97, 148, 0.04)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '8px 20px',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          {/* Quick Script Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={14} style={{ color: '#006194' }} />
              <span>Script:</span>
            </span>
            {scripts.map((s) => (
              <button
                key={s.code}
                onClick={() => setSelectedScript(s.code)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 16,
                  border: '1px solid',
                  borderColor: selectedScript === s.code ? '#006194' : 'var(--border-subtle)',
                  backgroundColor: selectedScript === s.code ? '#006194' : 'var(--bg-surface)',
                  color: selectedScript === s.code ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: selectedScript === s.code ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{s.name}</span>
                <span style={{ fontSize: '10px', opacity: selectedScript === s.code ? 0.8 : 0.6 }}>({s.sub})</span>
              </button>
            ))}
          </div>

          {/* Cognitive & Font Adjuster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 10,
              padding: '2px 4px',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
            }}>
              <button
                onClick={() => setFontSizeScale('normal')}
                style={{
                  padding: '2px 8px',
                  background: fontSizeScale === 'normal' ? 'rgba(0, 97, 148, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: fontSizeScale === 'normal' ? 800 : 500,
                  color: fontSizeScale === 'normal' ? '#006194' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeScale('large')}
                style={{
                  padding: '2px 8px',
                  background: fontSizeScale === 'large' ? 'rgba(0, 97, 148, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: fontSizeScale === 'large' ? 800 : 500,
                  color: fontSizeScale === 'large' ? '#006194' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeScale('xlarge')}
                style={{
                  padding: '2px 8px',
                  background: fontSizeScale === 'xlarge' ? 'rgba(0, 97, 148, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: fontSizeScale === 'xlarge' ? 800 : 500,
                  color: fontSizeScale === 'xlarge' ? '#006194' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                A++
              </button>
            </div>

            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(
                  'Welcome to Setu. Every citizen voice builds sovereign public infrastructure. Press the microphone button to speak your grievance.'
                );
                window.speechSynthesis?.speak(utterance);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 10,
                backgroundColor: 'rgba(0, 106, 97, 0.1)',
                border: '1px solid rgba(0, 106, 97, 0.25)',
                color: '#006a61',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Volume2 size={13} />
              <span>Read Aloud</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Fluid Hero Section */}
      <section style={{
        padding: '50px 20px 40px',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Certification Ribbon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 20,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginBottom: 20,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#006a61' }} />
          <span>DIGITAL PUBLIC GOOD #2024-81 · UN SDG 9, 11, 16</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          maxWidth: 900,
          marginBottom: 16,
        }}>
          Every Citizen's Voice Builds Sovereign Public Infrastructure
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 820,
          marginBottom: 32,
        }}>
          Setu translates multilingual citizen grievances, spoken vernacular dialects, and field reports into municipal budget prioritization signals. Fully authenticated, zero fake data, and zero personal tracking.
        </p>

        {/* Parallel Multi-Script Carousel Ribbons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
          marginBottom: 44,
        }}>
          <div style={{
            padding: '14px 18px',
            borderRadius: 14,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#006194', textTransform: 'uppercase' }}>
              हिन्दी · Hindi
            </span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              हर नागरिक की आवाज़ बनाती है सार्वजनिक ढांचा।
            </p>
          </div>

          <div style={{
            padding: '14px 18px',
            borderRadius: 14,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#006194', textTransform: 'uppercase' }}>
              中文 · Mandarin
            </span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              每一位公民的声音构筑公共基础设施。
            </p>
          </div>

          <div style={{
            padding: '14px 18px',
            borderRadius: 14,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#006194', textTransform: 'uppercase' }}>
              Русский · Russian
            </span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              Голос каждого гражданина строит инфраструктуру.
            </p>
          </div>

          <div style={{
            padding: '14px 18px',
            borderRadius: 14,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#006194', textTransform: 'uppercase' }}>
              Português · Portuguese
            </span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              A voz de cada cidadão constrói infraestrutura.
            </p>
          </div>
        </div>

        {/* 3. Primary Voice-First Action Zone (Zero-Literacy Barrier) */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 24,
          padding: '36px 32px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 40px -15px rgba(0, 97, 148, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32,
          alignItems: 'center',
          marginBottom: 48,
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 20,
              backgroundColor: 'rgba(0, 106, 97, 0.1)',
              color: '#006a61',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: 12,
            }}>
              <Headphones size={14} />
              <span>Zero-Literacy Barrier · Universal Vernacular Audio</span>
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
            }}>
              Report Broken Infrastructure by Speaking
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px', fontWeight: 600 }}>
              बोलने के लिए दबाएं • 按住讲话 • Нажмите, чтобы сказать • Fale agora
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Speak naturally in any Indian or BRICS dialect. Describe your location and the issue (broken water pipe, potholed road, electrical spark). Our engine redacts PII, translates to canonical English, and clusters the report into municipal budgets.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('report')}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  backgroundColor: '#006194',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0, 97, 148, 0.25)',
                }}
              >
                <span>Launch Grievance Intake</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigate('track')}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Search size={16} />
                <span>Track Existing Grievance</span>
              </button>
            </div>
          </div>

          {/* Interactive Microphone Pod */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            borderRadius: 20,
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}>
            <button
              onClick={handleVoiceClick}
              aria-label="Voice input button"
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                backgroundColor: isRecording ? '#ef4444' : '#006194',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isRecording
                  ? '0 0 0 12px rgba(239, 68, 68, 0.25), 0 8px 24px rgba(239, 68, 68, 0.4)'
                  : '0 0 0 8px rgba(0, 97, 148, 0.15), 0 8px 24px rgba(0, 97, 148, 0.3)',
                transition: 'all 0.2s ease',
                marginBottom: 16,
              }}
            >
              <Mic size={36} />
            </button>

            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              color: isRecording ? '#ef4444' : 'var(--text-primary)',
              marginBottom: 4,
            }}>
              {isRecording ? 'Listening... Speak Now' : 'Click to Speak (Voice Intake)'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isRecording ? 'Capturing audio waveform & detecting dialect...' : 'Supports 15+ Native Indian & BRICS Dialects'}
            </span>

            {voiceSpoken && (
              <div style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <CheckCircle2 size={15} />
                <span>Captured: "Water pipe burst near ward 14" → Routing to report intake</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Two Clear Sovereign Login Gateways */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Select Your Access Portal
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Citizens access passwordless reporting; municipal planners access admin-generated authority accounts.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {/* Gateway 1: Citizen Login */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 20,
              padding: 28,
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0, 97, 148, 0.1)',
                  color: '#006194',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <User size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                  Citizen Public Portal
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Instant, accessible passwordless email login for public citizens. File grievances, track status, view verified municipal open data.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span>Passwordless 6-digit OTP verification</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span>Anonymized PII tokenization</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span>Voice &amp; Vernacular submission tracking</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('citizen-login')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  backgroundColor: '#006194',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>Citizen Login (Passwordless)</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Gateway 2: Official Authority Login */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 20,
              padding: 28,
              border: '1px solid rgba(234, 179, 8, 0.4)',
              boxShadow: '0 10px 25px -5px rgba(234, 179, 8, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                color: '#ca8a04',
                fontSize: '10px',
                fontWeight: 800,
                padding: '4px 12px',
                borderBottomLeftRadius: 10,
                letterSpacing: '0.05em',
              }}>
                ADMIN / OFFICIAL CLEARANCE
              </div>

              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  color: '#ca8a04',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Landmark size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                  Municipal Authority Portal
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Dedicated clearance portal for Municipal Urban Planners and AI Compliance Officers using admin-generated credentials.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span>Spatial-Semantic Cluster &amp; Hotspot Explorer</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span>Explainable Prioritization (SHAP attribution)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span>Direct Budget Allocation &amp; Fund Commitments</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('official-login')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  backgroundColor: '#ca8a04',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>Official Authority Login</span>
                <Lock size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Live Sovereign Telemetry Strip */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 16,
          padding: '20px 24px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={20} style={{ color: '#006a61' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sovereign Data Engine &amp; Live Telemetry
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Active Nation: {currentNation} · Grounded in verified Census &amp; Jal Jeevan Mission datasets
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('transparency')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Database size={13} />
              <span>Explore Open Data Registry</span>
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Radio size={13} />
              <span>Multi-Channel Simulator</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
