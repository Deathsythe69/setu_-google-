import { CitizenReport, DemandSignal, GeoLocation, SectorCategory } from '../types/index.js';

export class ClusteringEngine {
  public static readonly CLUSTER_RADIUS_METERS = 3500; // 3.5 km radius

  /**
   * Calculates great-circle distance between two geo points using Haversine formula (in meters)
   */
  public static calculateDistance(p1: GeoLocation, p2: GeoLocation): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (p1.lat * Math.PI) / 180;
    const phi2 = (p2.lat * Math.PI) / 180;
    const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
    const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Evaluates text token overlap for deduplication and semantic similarity
   */
  public static calculateSemanticSimilarity(textA: string, textB: string): number {
    const tokensA = new Set(textA.toLowerCase().split(/\W+/).filter((t) => t.length > 3));
    const tokensB = new Set(textB.toLowerCase().split(/\W+/).filter((t) => t.length > 3));

    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let intersectionCount = 0;
    tokensA.forEach((token) => {
      if (tokensB.has(token)) intersectionCount++;
    });

    const unionSize = new Set([...tokensA, ...tokensB]).size;
    return unionSize === 0 ? 0 : intersectionCount / unionSize;
  }

  /**
   * Evaluates if a citizen report belongs to an existing DemandSignal cluster
   */
  public static shouldCluster(report: CitizenReport, signal: DemandSignal): boolean {
    // 1. Must share the same nation and sector
    if (report.nation_id !== signal.nation_id || report.category !== signal.category) {
      return false;
    }

    // 2. Spatial proximity check
    const distance = this.calculateDistance(report.geo, signal.geo_cluster);
    const inProximity = distance <= this.CLUSTER_RADIUS_METERS || report.region_id === signal.region_id;

    // 3. Semantic similarity or direct sector+region match
    const similarity = this.calculateSemanticSimilarity(
      report.english_transcript || report.raw_text,
      signal.summary
    );

    return inProximity && (similarity > 0.1 || report.region_id === signal.region_id);
  }

  /**
   * Ingests a new report into the cluster set:
   * Returns updated existing DemandSignal or creates a new one.
   */
  public static clusterReport(
    report: CitizenReport,
    existingSignals: DemandSignal[]
  ): { signal: DemandSignal; isNewCluster: boolean } {
    // Look for matching cluster
    for (const signal of existingSignals) {
      if (this.shouldCluster(report, signal)) {
        // Merge into existing cluster
        signal.report_ids.push(report.id);
        const oldCount = signal.report_count;
        signal.report_count += 1;

        // Recalculate combined urgency score (normalized 0 to 100)
        // Individual report urgency is 1-10; normalize to 10-100
        const reportUrgencyPct = report.urgency_score * 10;
        signal.urgency_score = Math.round(
          (signal.urgency_score * oldCount + reportUrgencyPct) / signal.report_count
        );

        // Update sentiment
        signal.sentiment = Number(
          ((signal.sentiment * oldCount + report.sentiment) / signal.report_count).toFixed(2)
        );

        // Nudge centroid slightly towards new report
        signal.geo_cluster.lat = Number(
          ((signal.geo_cluster.lat * oldCount + report.geo.lat) / signal.report_count).toFixed(6)
        );
        signal.geo_cluster.lng = Number(
          ((signal.geo_cluster.lng * oldCount + report.geo.lng) / signal.report_count).toFixed(6)
        );

        signal.last_updated = new Date().toISOString();
        return { signal, isNewCluster: false };
      }
    }

    // No matching cluster found: create new DemandSignal
    const clusterId = `DS-${report.nation_id}-${report.category.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSignal: DemandSignal = {
      id: clusterId,
      nation_id: report.nation_id,
      region_id: report.region_id,
      category: report.category,
      report_ids: [report.id],
      report_count: 1,
      title: `${this.formatSectorTitle(report.category)} Crisis Cluster - ${report.geo.landmark || report.geo.ward || report.region_id}`,
      summary: report.english_transcript || report.raw_text,
      urgency_score: report.urgency_score * 10,
      sentiment: report.sentiment,
      geo_cluster: { ...report.geo },
      radius_meters: 1000,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };

    return { signal: newSignal, isNewCluster: true };
  }

  private static formatSectorTitle(sector: SectorCategory): string {
    const titles: Record<SectorCategory, string> = {
      roads: 'Road Network Repair',
      water: 'Clean Water Supply Delivery',
      drainage: 'Stormwater Drainage & Flood Control',
      electricity: 'Power Grid & Transformer Stabilization',
      sanitation: 'Municipal Sanitation & Waste Remediation',
      transit: 'Public Transit Accessibility',
      healthcare: 'Community Health Infrastructure',
      schools: 'Public School Facility Overhaul',
    };
    return titles[sector] || sector.toUpperCase();
  }
}
