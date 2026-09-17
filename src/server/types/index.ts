export type ChannelType = 'voice' | 'whatsapp' | 'telegram' | 'sms' | 'pwa';

export type ReportStatus = 
  | 'received' 
  | 'clustered' 
  | 'under_review' 
  | 'funded' 
  | 'completed' 
  | 'erased';

export type SectorCategory = 
  | 'roads' 
  | 'water' 
  | 'electricity' 
  | 'sanitation' 
  | 'transit' 
  | 'healthcare' 
  | 'schools' 
  | 'drainage';

export type ProjectStatus = 
  | 'recommended' 
  | 'under_review' 
  | 'funded' 
  | 'in_progress' 
  | 'completed';

export interface GeoLocation {
  lat: number;
  lng: number;
  landmark?: string;
  ward?: string;
  district?: string;
  state?: string;
}

export interface CitizenReport {
  id: string;
  tracking_id: string;
  nation_id: string;
  region_id: string;
  channel: ChannelType;
  lang: string;
  raw_text: string; // Stored only after PII redaction
  original_script: string;
  english_transcript: string;
  audio_url?: string;
  photo_url?: string;
  category: SectorCategory;
  geo: GeoLocation;
  urgency_score: number; // 1 to 10
  sentiment: number; // -1.0 (very negative/frustrated) to +1.0
  consent_flag: boolean;
  sender_hash: string;
  submitted_at: string;
  status: ReportStatus;
  demand_signal_id?: string;
  retention_expires_at: string;
  erased_at?: string;
}

export interface DemandSignal {
  id: string;
  nation_id: string;
  region_id: string;
  category: SectorCategory;
  report_ids: string[];
  report_count: number;
  title: string;
  summary: string;
  urgency_score: number; // 0 to 100
  sentiment: number;
  geo_cluster: GeoLocation;
  radius_meters: number;
  created_at: string;
  last_updated: string;
  priority_score_id?: string;
}

export interface InfrastructureIndex {
  region_id: string;
  region_name: string;
  nation_id: string;
  sector: SectorCategory;
  deficit_score: number; // 0 to 100 (100 = severe deficit / acute absence)
  existing_coverage_pct: number;
  last_updated: string;
}

export interface DemographicUnit {
  region_id: string;
  region_name: string;
  nation_id: string;
  population: number;
  density_sq_km: number;
  vulnerability_index: number; // 0 to 100 (composite poverty, socio-economic marginalization)
}

export interface BudgetLine {
  id: string;
  nation_id: string;
  sector: SectorCategory;
  fiscal_year: string;
  amount_allocated: number;
  amount_available: number;
  currency: string;
}

export interface FactorBreakdown {
  demand_points: number; // Max 35
  demographic_points: number; // Max 25
  deficit_points: number; // Max 25
  budget_points: number; // Max 15
  demand_pct: number;
  demographic_pct: number;
  deficit_pct: number;
  budget_pct: number;
  explanation: string;
}

export interface PriorityScore {
  id: string;
  demand_signal_id: string;
  nation_id: string;
  region_id: string;
  sector: SectorCategory;
  score: number; // 0 to 100
  rank: number;
  factor_breakdown: FactorBreakdown;
  estimated_cost: number;
  estimated_beneficiaries: number;
  model_version: string;
  generated_at: string;
}

export interface Project {
  id: string;
  priority_score_id: string;
  demand_signal_id: string;
  title: string;
  description: string;
  sector: SectorCategory;
  region_id: string;
  region_name: string;
  nation_id: string;
  status: ProjectStatus;
  priority_rank: number;
  priority_score: number;
  factor_breakdown: FactorBreakdown;
  funded_amount: number;
  estimated_cost: number;
  approved_by?: string;
  approved_at?: string;
  citizen_report_count: number;
  impact_indicators: {
    metric: string;
    baseline: number;
    projected: number;
    unit: string;
  }[];
  timeline: {
    stage: string;
    date: string;
    completed: boolean;
  }[];
}

export interface EventMessage {
  id: string;
  topic: string;
  nation_id: string;
  payload: any;
  timestamp: string;
}

export interface BiasCohortMetric {
  cohort: string;
  language: string;
  script: string;
  reports_evaluated: number;
  asr_wer_accuracy: number; // percentage accuracy
  classification_f1: number;
  avg_priority_score: number;
  disparity_flag: boolean;
  notes: string;
}
