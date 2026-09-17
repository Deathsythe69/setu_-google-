import React, { useState } from 'react';
import { DemandSignal, SectorCategory } from '../../server/types/index.js';
import { AlertTriangle, MapPin, Layers, Flame, Droplets, Construction, Zap, Trash2, Bus, Stethoscope, GraduationCap } from 'lucide-react';

interface HotspotMapProps {
  signals: DemandSignal[];
  selectedSector: string;
  onSelectSector: (sector: string) => void;
  onSelectSignal: (signal: DemandSignal) => void;
  selectedSignalId?: string;
  nationId: string;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  signals,
  selectedSector,
  onSelectSector,
  onSelectSignal,
  selectedSignalId,
  nationId,
}) => {
  const [hoveredSignal, setHoveredSignal] = useState<DemandSignal | null>(null);

  const sectorIcons: Record<string, React.ReactNode> = {
    water: <Droplets size={14} />,
    roads: <Construction size={14} />,
    drainage: <Layers size={14} />,
    electricity: <Zap size={14} />,
    sanitation: <Trash2 size={14} />,
    transit: <Bus size={14} />,
    healthcare: <Stethoscope size={14} />,
    schools: <GraduationCap size={14} />,
  };

  const sectors: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sectors' },
    { id: 'water', label: 'Water' },
    { id: 'roads', label: 'Roads' },
    { id: 'drainage', label: 'Drainage' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'sanitation', label: 'Sanitation' },
    { id: 'transit', label: 'Transit' },
    { id: 'healthcare', label: 'Healthcare' },
  ];

  const filteredSignals = signals.filter((s) => {
    if (selectedSector !== 'all' && s.category !== selectedSector) return false;
    return true;
  });

  // Projection normalization for map bounds based on nationId
  const getMapCoordinates = (lat: number, lng: number) => {
    if (nationId === 'IND') {
      // India approximate bounding box
      const minLat = 8.0, maxLat = 32.0;
      const minLng = 68.0, maxLng = 96.0;
      const x = ((lng - minLng) / (maxLng - minLng)) * 580 + 30;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;
      return { x, y };
    } else if (nationId === 'BRA') {
      // Brazil bounding box
      const minLat = -33.0, maxLat = 5.0;
      const minLng = -73.0, maxLng = -34.0;
      const x = ((lng - minLng) / (maxLng - minLng)) * 580 + 30;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;
      return { x, y };
    } else {
      // South Africa bounding box
      const minLat = -35.0, maxLat = -22.0;
      const minLng = 16.0, maxLng = 33.0;
      const x = ((lng - minLng) / (maxLng - minLng)) * 580 + 30;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;
      return { x, y };
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 80) return 'var(--color-critical)';
    if (urgency >= 55) return 'var(--color-warning)';
    return 'var(--color-primary)';
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      padding: '16px',
      boxShadow: 'var(--elevation-1)'
    }}>
      {/* Header & Sector Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16
      }}>
        <div>
          <h3 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Flame size={18} style={{ color: 'var(--color-critical)' }} />
            <span>National Infrastructure Demand Hotspots ({nationId})</span>
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Real-time geospatial clusters aggregated from citizen reports across sovereign wards.
          </p>
        </div>

        {/* Sector Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onSelectSector(sec.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: selectedSector === sec.id ? 700 : 500,
                border: '1px solid',
                borderColor: selectedSector === sec.id ? 'var(--color-primary)' : 'var(--border-subtle)',
                backgroundColor: selectedSector === sec.id ? 'var(--color-primary-light)' : 'transparent',
                color: selectedSector === sec.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {sec.id !== 'all' && sectorIcons[sec.id]}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Map Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 380,
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        <svg
          viewBox="0 0 640 400"
          style={{ width: '100%', height: '100%' }}
          role="img"
          aria-label="Geospatial Hotspot Map"
        >
          <defs>
            {/* Grid background pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="640" height="400" fill="url(#grid)" />

          {/* Stylized National Territory Outline */}
          <path
            d="M 120 40 C 240 20, 420 30, 520 80 C 580 140, 540 280, 480 340 C 380 380, 260 360, 180 300 C 100 240, 80 120, 120 40 Z"
            fill="var(--color-primary-light)"
            stroke="var(--color-primary-border)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />

          {/* Region Landmark Circles */}
          <circle cx="200" cy="120" r="40" fill="none" stroke="var(--color-neutral-300)" strokeDasharray="3 3" opacity="0.5" />
          <circle cx="360" cy="180" r="50" fill="none" stroke="var(--color-neutral-300)" strokeDasharray="3 3" opacity="0.5" />
          <circle cx="440" cy="280" r="35" fill="none" stroke="var(--color-neutral-300)" strokeDasharray="3 3" opacity="0.5" />

          {/* Demand Signal Cluster Markers */}
          {filteredSignals.map((signal) => {
            const coords = getMapCoordinates(signal.geo_cluster.lat, signal.geo_cluster.lng);
            const isSelected = selectedSignalId === signal.id;
            const color = getUrgencyColor(signal.urgency_score);
            const markerRadius = Math.max(12, Math.min(26, 10 + signal.report_count * 2.5));

            return (
              <g
                key={signal.id}
                onClick={() => onSelectSignal(signal)}
                onMouseEnter={() => setHoveredSignal(signal)}
                onMouseLeave={() => setHoveredSignal(null)}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                aria-label={`${signal.title}, Urgency ${signal.urgency_score}, Reports ${signal.report_count}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectSignal(signal);
                  }
                }}
              >
                {/* Pulsing halo for high urgency */}
                {signal.urgency_score >= 80 && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={markerRadius + 8}
                    fill={color}
                    opacity="0.25"
                    className="animate-pulse-ring"
                  />
                )}

                {/* Outer Cluster Radius Circle */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={markerRadius}
                  fill={color}
                  fillOpacity={isSelected ? 0.9 : 0.75}
                  stroke={isSelected ? '#ffffff' : color}
                  strokeWidth={isSelected ? 3 : 1.5}
                />

                {/* Report Count Label */}
                <text
                  x={coords.x}
                  y={coords.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={markerRadius > 16 ? 12 : 10}
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {signal.report_count}
                </text>

                {/* Region Tag */}
                <text
                  x={coords.x}
                  y={coords.y + markerRadius + 14}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  {signal.geo_cluster.landmark || signal.region_id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredSignal && (
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            boxShadow: 'var(--elevation-3)',
            maxWidth: 320,
            fontSize: 'var(--text-xs)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              {hoveredSignal.title}
            </div>
            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
              Sector: <strong style={{ textTransform: 'uppercase' }}>{hoveredSignal.category}</strong> · Reports: <strong>{hoveredSignal.report_count}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                backgroundColor: getUrgencyColor(hoveredSignal.urgency_score),
                color: '#fff',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}>
                Urgency: {hoveredSignal.urgency_score}/100
              </span>
              <span>Click to view evidence trail</span>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 10px',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Urgency Scale</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-critical)' }} />
            <span>Acute / Emergency (≥80)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
            <span>Elevated Deficit (55-79)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
            <span>Baseline Monitoring (&lt;55)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
