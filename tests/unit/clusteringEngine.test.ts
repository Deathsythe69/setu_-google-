import { describe, it, expect } from 'vitest';
import { ClusteringEngine } from '../../src/server/clustering/clusteringEngine.js';
import { CitizenReport, DemandSignal } from '../../src/server/types/index.js';

describe('ClusteringEngine - Unit Tests (Deduplication & Spatial Clustering)', () => {
  const baseReport: CitizenReport = {
    id: 'REP-101',
    tracking_id: 'SETU-IND-101',
    nation_id: 'IND',
    region_id: 'IND-BUN-02',
    channel: 'voice',
    lang: 'hi',
    raw_text: 'Main water pipe leak',
    original_script: 'पानी की पाइपलाइन फूटी है',
    english_transcript: 'Main drinking water pipeline is fractured and leaking',
    category: 'water',
    geo: { lat: 24.9142, lng: 79.584 },
    urgency_score: 8,
    sentiment: -0.8,
    consent_flag: true,
    sender_hash: 'hash1',
    submitted_at: new Date().toISOString(),
    status: 'received',
    retention_expires_at: new Date().toISOString(),
  };

  it('accurately computes Haversine distance between coordinates', () => {
    // Distance between Varanasi (25.3176, 82.9739) and nearby point (~1.1 km away)
    const p1 = { lat: 25.3176, lng: 82.9739 };
    const p2 = { lat: 25.3250, lng: 82.9800 };

    const distance = ClusteringEngine.calculateDistance(p1, p2);
    expect(distance).toBeGreaterThan(900);
    expect(distance).toBeLessThan(1400);
  });

  it('calculates token overlap semantic similarity', () => {
    const textA = 'Water pipeline is broken and leaking badly';
    const textB = 'Water pipeline fractured and leaking contaminated water';
    const sim = ClusteringEngine.calculateSemanticSimilarity(textA, textB);

    expect(sim).toBeGreaterThan(0.3);

    const textC = 'Road pothole asphalt cracked';
    const simDiff = ClusteringEngine.calculateSemanticSimilarity(textA, textC);
    expect(simDiff).toBe(0);
  });

  it('creates a new DemandSignal cluster for the first report', () => {
    const { signal, isNewCluster } = ClusteringEngine.clusterReport(baseReport, []);

    expect(isNewCluster).toBe(true);
    expect(signal.category).toBe('water');
    expect(signal.report_count).toBe(1);
    expect(signal.report_ids).toContain('REP-101');
    expect(signal.urgency_score).toBe(80); // 8 * 10
  });

  it('merges nearby reports in the same sector into existing cluster and averages metrics', () => {
    const { signal: initialCluster } = ClusteringEngine.clusterReport(baseReport, []);

    // Second nearby report in same region & sector with urgency 10
    const nearbyReport: CitizenReport = {
      ...baseReport,
      id: 'REP-102',
      tracking_id: 'SETU-IND-102',
      urgency_score: 10,
      sentiment: -1.0,
      geo: { lat: 24.9150, lng: 79.5850 }, // ~150 meters away
      english_transcript: 'Water pipeline is completely flooded and broken',
    };

    const { signal: updatedCluster, isNewCluster } = ClusteringEngine.clusterReport(
      nearbyReport,
      [initialCluster]
    );

    expect(isNewCluster).toBe(false);
    expect(updatedCluster.id).toBe(initialCluster.id);
    expect(updatedCluster.report_count).toBe(2);
    expect(updatedCluster.report_ids).toContain('REP-101');
    expect(updatedCluster.report_ids).toContain('REP-102');
    // Urgency was 80, new is 100 -> average is 90
    expect(updatedCluster.urgency_score).toBe(90);
  });

  it('does NOT merge reports belonging to different sectors or different nations', () => {
    const { signal: waterCluster } = ClusteringEngine.clusterReport(baseReport, []);

    // Same location, but Roads sector
    const roadsReport: CitizenReport = {
      ...baseReport,
      id: 'REP-ROADS-1',
      category: 'roads',
      english_transcript: 'Pothole in road',
    };

    const { isNewCluster: newSectorCluster } = ClusteringEngine.clusterReport(roadsReport, [waterCluster]);
    expect(newSectorCluster).toBe(true);

    // Same sector, but Brazil nation partition
    const brazilReport: CitizenReport = {
      ...baseReport,
      id: 'REP-BRA-1',
      nation_id: 'BRA',
    };

    const { isNewCluster: newNationCluster } = ClusteringEngine.clusterReport(brazilReport, [waterCluster]);
    expect(newNationCluster).toBe(true);
  });
});
