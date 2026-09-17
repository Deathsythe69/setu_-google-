import { BudgetLine, DemographicUnit, InfrastructureIndex, SectorCategory } from '../types/index.js';

export interface NationConfig {
  id: string;
  name: string;
  currency: string;
  defaultLang: string;
  supportedLangs: string[];
  regions: {
    id: string;
    name: string;
    state: string;
    lat: number;
    lng: number;
  }[];
}

export const NATIONS: Record<string, NationConfig> = {
  IND: {
    id: 'IND',
    name: 'India (Reference Pilot)',
    currency: 'INR (₹ Crores)',
    defaultLang: 'hi',
    supportedLangs: ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'ru', 'zh', 'pt', 'ar', 'sw'],
    regions: [
      { id: 'IND-VAR-01', name: 'Varanasi East & Ghats Ward 14', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
      { id: 'IND-BUN-02', name: 'Bundelkhand Rural Drought Belt', state: 'Madhya Pradesh', lat: 24.9142, lng: 79.5840 },
      { id: 'IND-MUM-03', name: 'Dharavi Slum Transit & Water Cluster', state: 'Maharashtra', lat: 19.0434, lng: 72.8562 },
      { id: 'IND-PAT-04', name: 'Patna Lowland Drainage Ward 9', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
      { id: 'IND-BLR-05', name: 'Bengaluru Peripheral Tech Corridor', state: 'Karnataka', lat: 12.9352, lng: 77.6946 },
      { id: 'IND-GUW-06', name: 'Guwahati Brahmaputra Bank Sector 3', state: 'Assam', lat: 26.1445, lng: 91.7362 },
    ],
  },
  BRA: {
    id: 'BRA',
    name: 'Brazil (Pilot Deployment)',
    currency: 'BRL (R$ Millions)',
    defaultLang: 'pt',
    supportedLangs: ['pt', 'en', 'es'],
    regions: [
      { id: 'BRA-RIO-01', name: 'Complexo da Maré Favela Hub', state: 'Rio de Janeiro', lat: -22.8624, lng: -43.2435 },
      { id: 'BRA-MAN-02', name: 'Manaus Igarapé Riverine Ward', state: 'Amazonas', lat: -3.1190, lng: -60.0217 },
      { id: 'BRA-REC-03', name: 'Recife Coastal Lowland Morros', state: 'Pernambuco', lat: -8.0476, lng: -34.8770 },
      { id: 'BRA-SAO-04', name: 'São Paulo Zona Leste Transport Gaps', state: 'São Paulo', lat: -23.5505, lng: -46.5333 },
    ],
  },
  ZAF: {
    id: 'ZAF',
    name: 'South Africa (Pilot Deployment)',
    currency: 'ZAR (R Millions)',
    defaultLang: 'en',
    supportedLangs: ['en', 'sw', 'pt'],
    regions: [
      { id: 'ZAF-JHB-01', name: 'Soweto Water & Grid District 4', state: 'Gauteng', lat: -26.2485, lng: 27.8540 },
      { id: 'ZAF-CPT-02', name: 'Khayelitsha Sanitation Settlement C', state: 'Western Cape', lat: -34.0378, lng: 18.6750 },
      { id: 'ZAF-DUR-03', name: 'Umlazi Road Access Section K', state: 'KwaZulu-Natal', lat: -29.9702, lng: 30.8825 },
    ],
  },
};

export const INITIAL_DEMOGRAPHICS: DemographicUnit[] = [
  // India
  { region_id: 'IND-VAR-01', region_name: 'Varanasi East & Ghats Ward 14', nation_id: 'IND', population: 380000, density_sq_km: 19500, vulnerability_index: 68 },
  { region_id: 'IND-BUN-02', region_name: 'Bundelkhand Rural Drought Belt', nation_id: 'IND', population: 850000, density_sq_km: 320, vulnerability_index: 89 },
  { region_id: 'IND-MUM-03', region_name: 'Dharavi Slum Transit & Water Cluster', nation_id: 'IND', population: 1000000, density_sq_km: 66000, vulnerability_index: 84 },
  { region_id: 'IND-PAT-04', region_name: 'Patna Lowland Drainage Ward 9', nation_id: 'IND', population: 420000, density_sq_km: 14200, vulnerability_index: 76 },
  { region_id: 'IND-BLR-05', region_name: 'Bengaluru Peripheral Tech Corridor', nation_id: 'IND', population: 610000, density_sq_km: 8400, vulnerability_index: 38 },
  { region_id: 'IND-GUW-06', region_name: 'Guwahati Brahmaputra Bank Sector 3', nation_id: 'IND', population: 290000, density_sq_km: 4100, vulnerability_index: 72 },

  // Brazil
  { region_id: 'BRA-RIO-01', region_name: 'Complexo da Maré Favela Hub', nation_id: 'BRA', population: 140000, density_sq_km: 32000, vulnerability_index: 82 },
  { region_id: 'BRA-MAN-02', region_name: 'Manaus Igarapé Riverine Ward', nation_id: 'BRA', population: 210000, density_sq_km: 4500, vulnerability_index: 77 },
  { region_id: 'BRA-REC-03', region_name: 'Recife Coastal Lowland Morros', nation_id: 'BRA', population: 310000, density_sq_km: 9800, vulnerability_index: 79 },
  { region_id: 'BRA-SAO-04', region_name: 'São Paulo Zona Leste Transport Gaps', nation_id: 'BRA', population: 780000, density_sq_km: 12500, vulnerability_index: 61 },

  // South Africa
  { region_id: 'ZAF-JHB-01', region_name: 'Soweto Water & Grid District 4', nation_id: 'ZAF', population: 450000, density_sq_km: 6800, vulnerability_index: 75 },
  { region_id: 'ZAF-CPT-02', region_name: 'Khayelitsha Sanitation Settlement C', nation_id: 'ZAF', population: 390000, density_sq_km: 9400, vulnerability_index: 88 },
  { region_id: 'ZAF-DUR-03', region_name: 'Umlazi Road Access Section K', nation_id: 'ZAF', population: 410000, density_sq_km: 5200, vulnerability_index: 71 },
];

export const INITIAL_INFRA_INDICES: InfrastructureIndex[] = [
  // India - Deficit scores (0-100, higher means greater infrastructural absence/crisis)
  { region_id: 'IND-VAR-01', region_name: 'Varanasi East', nation_id: 'IND', sector: 'sanitation', deficit_score: 82, existing_coverage_pct: 35, last_updated: '2026-08-15' },
  { region_id: 'IND-VAR-01', region_name: 'Varanasi East', nation_id: 'IND', sector: 'roads', deficit_score: 65, existing_coverage_pct: 55, last_updated: '2026-08-15' },
  { region_id: 'IND-BUN-02', region_name: 'Bundelkhand', nation_id: 'IND', sector: 'water', deficit_score: 94, existing_coverage_pct: 18, last_updated: '2026-08-20' },
  { region_id: 'IND-BUN-02', region_name: 'Bundelkhand', nation_id: 'IND', sector: 'electricity', deficit_score: 74, existing_coverage_pct: 42, last_updated: '2026-08-20' },
  { region_id: 'IND-MUM-03', region_name: 'Dharavi Slum', nation_id: 'IND', sector: 'water', deficit_score: 88, existing_coverage_pct: 28, last_updated: '2026-09-01' },
  { region_id: 'IND-MUM-03', region_name: 'Dharavi Slum', nation_id: 'IND', sector: 'transit', deficit_score: 78, existing_coverage_pct: 40, last_updated: '2026-09-01' },
  { region_id: 'IND-PAT-04', region_name: 'Patna Ward 9', nation_id: 'IND', sector: 'drainage', deficit_score: 91, existing_coverage_pct: 22, last_updated: '2026-09-05' },
  { region_id: 'IND-PAT-04', region_name: 'Patna Ward 9', nation_id: 'IND', sector: 'roads', deficit_score: 72, existing_coverage_pct: 48, last_updated: '2026-09-05' },
  { region_id: 'IND-BLR-05', region_name: 'Bengaluru Outer', nation_id: 'IND', sector: 'roads', deficit_score: 69, existing_coverage_pct: 52, last_updated: '2026-09-02' },
  { region_id: 'IND-BLR-05', region_name: 'Bengaluru Outer', nation_id: 'IND', sector: 'transit', deficit_score: 62, existing_coverage_pct: 58, last_updated: '2026-09-02' },
  { region_id: 'IND-GUW-06', region_name: 'Guwahati Sector 3', nation_id: 'IND', sector: 'drainage', deficit_score: 86, existing_coverage_pct: 31, last_updated: '2026-08-28' },
  { region_id: 'IND-GUW-06', region_name: 'Guwahati Sector 3', nation_id: 'IND', sector: 'healthcare', deficit_score: 75, existing_coverage_pct: 41, last_updated: '2026-08-28' },

  // Brazil
  { region_id: 'BRA-RIO-01', region_name: 'Complexo da Maré', nation_id: 'BRA', sector: 'sanitation', deficit_score: 89, existing_coverage_pct: 26, last_updated: '2026-08-10' },
  { region_id: 'BRA-RIO-01', region_name: 'Complexo da Maré', nation_id: 'BRA', sector: 'electricity', deficit_score: 68, existing_coverage_pct: 52, last_updated: '2026-08-10' },
  { region_id: 'BRA-MAN-02', region_name: 'Manaus Igarapé', nation_id: 'BRA', sector: 'water', deficit_score: 84, existing_coverage_pct: 34, last_updated: '2026-08-14' },
  { region_id: 'BRA-REC-03', region_name: 'Recife Morros', nation_id: 'BRA', sector: 'drainage', deficit_score: 90, existing_coverage_pct: 20, last_updated: '2026-08-19' },

  // South Africa
  { region_id: 'ZAF-JHB-01', region_name: 'Soweto', nation_id: 'ZAF', sector: 'electricity', deficit_score: 83, existing_coverage_pct: 38, last_updated: '2026-08-22' },
  { region_id: 'ZAF-CPT-02', region_name: 'Khayelitsha', nation_id: 'ZAF', sector: 'sanitation', deficit_score: 92, existing_coverage_pct: 19, last_updated: '2026-08-25' },
];

export const INITIAL_BUDGET_LINES: BudgetLine[] = [
  // India (in INR Crores)
  { id: 'BL-IND-WATER-26', nation_id: 'IND', sector: 'water', fiscal_year: '2026-27', amount_allocated: 450, amount_available: 290, currency: '₹ Cr' },
  { id: 'BL-IND-ROADS-26', nation_id: 'IND', sector: 'roads', fiscal_year: '2026-27', amount_allocated: 600, amount_available: 340, currency: '₹ Cr' },
  { id: 'BL-IND-DRAIN-26', nation_id: 'IND', sector: 'drainage', fiscal_year: '2026-27', amount_allocated: 320, amount_available: 185, currency: '₹ Cr' },
  { id: 'BL-IND-SANIT-26', nation_id: 'IND', sector: 'sanitation', fiscal_year: '2026-27', amount_allocated: 280, amount_available: 160, currency: '₹ Cr' },
  { id: 'BL-IND-TRANS-26', nation_id: 'IND', sector: 'transit', fiscal_year: '2026-27', amount_allocated: 500, amount_available: 220, currency: '₹ Cr' },
  { id: 'BL-IND-ELECT-26', nation_id: 'IND', sector: 'electricity', fiscal_year: '2026-27', amount_allocated: 380, amount_available: 210, currency: '₹ Cr' },
  { id: 'BL-IND-HEALT-26', nation_id: 'IND', sector: 'healthcare', fiscal_year: '2026-27', amount_allocated: 420, amount_available: 275, currency: '₹ Cr' },
  { id: 'BL-IND-SCHOL-26', nation_id: 'IND', sector: 'schools', fiscal_year: '2026-27', amount_allocated: 250, amount_available: 140, currency: '₹ Cr' },

  // Brazil (in BRL Millions)
  { id: 'BL-BRA-SANIT-26', nation_id: 'BRA', sector: 'sanitation', fiscal_year: '2026', amount_allocated: 120, amount_available: 75, currency: 'R$ M' },
  { id: 'BL-BRA-WATER-26', nation_id: 'BRA', sector: 'water', fiscal_year: '2026', amount_allocated: 150, amount_available: 90, currency: 'R$ M' },
  { id: 'BL-BRA-DRAIN-26', nation_id: 'BRA', sector: 'drainage', fiscal_year: '2026', amount_allocated: 80, amount_available: 45, currency: 'R$ M' },

  // South Africa (in ZAR Millions)
  { id: 'BL-ZAF-SANIT-26', nation_id: 'ZAF', sector: 'sanitation', fiscal_year: '2026-27', amount_allocated: 350, amount_available: 210, currency: 'R M' },
  { id: 'BL-ZAF-ELECT-26', nation_id: 'ZAF', sector: 'electricity', fiscal_year: '2026-27', amount_allocated: 420, amount_available: 190, currency: 'R M' },
];
