import React, { useState } from 'react';
import { VoiceRecordButton } from '../components/VoiceRecordButton.js';
import { getTranslation } from '../i18n/translations.js';
import { SectorCategory } from '../../server/types/index.js';
import {
  Droplets,
  Construction,
  Layers,
  Zap,
  Trash2,
  Bus,
  Stethoscope,
  GraduationCap,
  MapPin,
  Camera,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  UploadCloud,
  AlertTriangle,
} from 'lucide-react';

interface CitizenHomeProps {
  currentLang: string;
  currentNation: string;
  onNavigateToTrack: (trackingId: string) => void;
  isOnline: boolean;
  onQueueOfflineReport: (report: any) => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  currentLang,
  currentNation,
  onNavigateToTrack,
  isOnline,
  onQueueOfflineReport,
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const [selectedSector, setSelectedSector] = useState<SectorCategory>('water');
  const [reportText, setReportText] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [consentGranted, setConsentGranted] = useState<boolean>(true);
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sectorOptions: { id: SectorCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'water', label: t('water'), icon: <Droplets size={24} />, color: '#0284C7' },
    { id: 'roads', label: t('roads'), icon: <Construction size={24} />, color: '#D97706' },
    { id: 'drainage', label: t('drainage'), icon: <Layers size={24} />, color: '#059669' },
    { id: 'electricity', label: t('electricity'), icon: <Zap size={24} />, color: '#CA8A04' },
    { id: 'sanitation', label: t('sanitation'), icon: <Trash2 size={24} />, color: '#7C3AED' },
    { id: 'transit', label: t('transit'), icon: <Bus size={24} />, color: '#2563EB' },
    { id: 'healthcare', label: t('healthcare'), icon: <Stethoscope size={24} />, color: '#DC2626' },
    { id: 'schools', label: t('schools'), icon: <GraduationCap size={24} />, color: '#4F46E5' },
  ];

  const handleAudioCaptured = (data: { transcript: string; audioUrl?: string }) => {
    setReportText(data.transcript);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reportText.trim()) {
      setErrorMessage('Please speak or type a description of the issue.');
      return;
    }

    if (!consentGranted) {
      setErrorMessage('Consent is required per Rules.md §2 to ingest your report.');
      return;
    }

    const payload = {
      nation_id: currentNation,
      channel: 'pwa',
      lang: currentLang,
      text: reportText.trim(),
      consent_flag: consentGranted,
      sender_id: 'citizen_session_' + (localStorage.getItem('setu_device_id') || 'dev_01'),
      geo: {
        lat: currentNation === 'IND' ? 24.914 : currentNation === 'BRA' ? -22.862 : -26.248,
        lng: currentNation === 'IND' ? 79.584 : currentNation === 'BRA' ? -43.243 : 27.854,
        landmark: landmark || 'Local Public Community Area',
      },
      category: selectedSector,
      photo_url: photoAttached ? 'https://images.unsplash.com/photo-1515263487990-61b07816b324' : undefined,
    };

    if (!isOnline) {
      // Offline-first queueing
      onQueueOfflineReport(payload);
      setSubmittedResult({
        success: true,
        offline: true,
        tracking_id: `SETU-${currentNation}-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
        category: selectedSector,
        redacted_text: payload.text,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Ingestion failed');
      }

      setSubmittedResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    if (submittedResult?.tracking_id) {
      navigator.clipboard.writeText(submittedResult.tracking_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
      {/* Hero / Header Box */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {t('platformTitle')}
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginTop: 4 }}>
          {t('platformSubtitle')}
        </p>
      </div>

      {/* Submission Confirmation Card */}
      {submittedResult ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-success-border)',
            padding: '24px',
            boxShadow: 'var(--elevation-3)',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t('submissionSuccess')}
          </h2>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
            {submittedResult.offline
              ? 'Saved in offline local queue. Will synchronize to national event plane upon reconnecting.'
              : 'Deduplicated and clustered into national demand intelligence queue.'}
          </p>

          {/* Tracking ID Badge */}
          <div style={{
            margin: '20px auto',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12
          }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                {t('yourTrackingId')}
              </div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
                {submittedResult.tracking_id}
              </div>
            </div>

            <button
              onClick={copyTrackingId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <Copy size={13} />
              <span>{copied ? 'Copied!' : t('copyId')}</span>
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            <button
              onClick={() => onNavigateToTrack(submittedResult.tracking_id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--elevation-2)'
              }}
            >
              <span>{t('trackNow')}</span>
              <ExternalLink size={16} />
            </button>

            <button
              onClick={() => {
                setSubmittedResult(null);
                setReportText('');
                setLandmark('');
              }}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Report Another Issue
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--elevation-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Section 1: Voice-First Recording (Design.md §3) */}
          <div style={{
            textAlign: 'center',
            padding: '20px 16px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-subtle)'
          }}>
            <VoiceRecordButton
              currentLang={currentLang}
              onAudioCaptured={handleAudioCaptured}
              disabled={isSubmitting}
            />
          </div>

          {/* Section 2: Sector Category Icons Grid (Low-literacy accessible) */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 10 }}>
              {t('categorySelect')}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 10,
            }}>
              {sectorOptions.map((sec) => {
                const isSelected = selectedSector === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSector(sec.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-app)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast)',
                      minHeight: 80,
                    }}
                  >
                    <div style={{ color: isSelected ? 'var(--color-primary)' : sec.color }}>
                      {sec.icon}
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: isSelected ? 700 : 500, textAlign: 'center' }}>
                      {sec.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Text / Speech Transcript Review */}
          <div>
            <label htmlFor="issue-description" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 6 }}>
              Issue Details (Voice Transcript or Typed Notes)
            </label>
            <textarea
              id="issue-description"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe the issue, street, duration, or people impacted..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.5,
                resize: 'vertical',
              }}
            />
          </div>

          {/* Section 4: Location & Optional Photo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <div>
              <label htmlFor="location-landmark" style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 6 }}>
                📍 Location / Landmark / Ward
              </label>
              <input
                id="location-landmark"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={t('locationPlaceholder')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-xs)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 6 }}>
                📷 Photo / Visual Evidence (Optional)
              </label>
              <button
                type="button"
                onClick={() => setPhotoAttached(!photoAttached)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${photoAttached ? 'var(--color-success)' : 'var(--border-subtle)'}`,
                  backgroundColor: photoAttached ? 'var(--color-success-light)' : 'var(--bg-app)',
                  color: photoAttached ? 'var(--color-success)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Camera size={16} />
                <span>{photoAttached ? 'Photo Attached (road_burst.jpg)' : 'Simulate Photo Capture'}</span>
              </button>
            </div>
          </div>

          {/* Section 5: Explicit Consent Notice (Mandatory per Rules.md §2) */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            <input
              type="checkbox"
              id="consent"
              checked={consentGranted}
              onChange={(e) => setConsentGranted(e.target.checked)}
              style={{ marginTop: 3, cursor: 'pointer' }}
            />
            <label htmlFor="consent" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
              <strong>Explicit Privacy Consent:</strong> {t('consentNotice')}
              <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: 2 }}>
                🔒 Personal identifiers (phone, name, address) are automatically redacted before entering the public bus.
              </span>
            </label>
          </div>

          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-critical-light)',
              color: 'var(--color-critical)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              minHeight: 'var(--touch-target-min)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: 'var(--elevation-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <UploadCloud size={20} />
            <span>{isSubmitting ? t('submitting') : t('submitReport')}</span>
          </button>
        </form>
      )}
    </div>
  );
};
