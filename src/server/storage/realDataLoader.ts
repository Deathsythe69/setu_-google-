import fs from 'fs';
import path from 'path';
import {
  BudgetLine,
  CitizenReport,
  DemographicUnit,
  InfrastructureIndex,
  SectorCategory,
} from '../types/index.js';
import {
  INITIAL_BUDGET_LINES,
  INITIAL_DEMOGRAPHICS,
  INITIAL_INFRA_INDICES,
} from '../config/nations.js';

export class RealDataLoader {
  private static dataDir = path.resolve(process.cwd(), 'data');

  public static loadRealDemographics(): DemographicUnit[] {
    try {
      const filePath = path.join(this.dataDir, 'demographics_real.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const list = JSON.parse(raw);
        return list.map((item: any) => ({
          region_id: item.region_id,
          region_name: item.region_name,
          nation_id: item.nation_id,
          population: Number(item.population),
          density_sq_km: Number(item.density_sq_km),
          vulnerability_index: Number(item.vulnerability_index),
        }));
      }
    } catch (err) {
      console.warn('Could not read demographics_real.json, falling back to base config:', err);
    }
    return INITIAL_DEMOGRAPHICS;
  }

  public static loadRealInfrastructureIndices(): InfrastructureIndex[] {
    try {
      const filePath = path.join(this.dataDir, 'infrastructure_indices_real.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const list = JSON.parse(raw);
        return list.map((item: any) => ({
          region_id: item.region_id,
          region_name: item.region_name,
          nation_id: item.nation_id,
          sector: item.sector as SectorCategory,
          deficit_score: Number(item.deficit_score),
          existing_coverage_pct: Number(item.existing_coverage_pct),
          last_updated: item.last_updated || new Date().toISOString().split('T')[0],
        }));
      }
    } catch (err) {
      console.warn('Could not read infrastructure_indices_real.json, falling back to base config:', err);
    }
    return INITIAL_INFRA_INDICES;
  }

  public static loadRealBudgetLines(): BudgetLine[] {
    try {
      const filePath = path.join(this.dataDir, 'budget_lines_real.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const list = JSON.parse(raw);
        return list.map((item: any) => ({
          id: item.id,
          nation_id: item.nation_id,
          sector: item.sector as SectorCategory,
          fiscal_year: item.fiscal_year,
          amount_allocated: Number(item.amount_allocated),
          amount_available: Number(item.amount_available),
          currency: item.currency,
        }));
      }
    } catch (err) {
      console.warn('Could not read budget_lines_real.json, falling back to base config:', err);
    }
    return INITIAL_BUDGET_LINES;
  }

  public static loadRealCitizenReports(): CitizenReport[] {
    try {
      const filePath = path.join(this.dataDir, 'citizen_grievances_real.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const list = JSON.parse(raw);
        return list.map((item: any) => ({
          id: item.id,
          tracking_id: item.tracking_id,
          nation_id: item.nation_id,
          region_id: item.region_id,
          channel: item.channel,
          lang: item.lang,
          raw_text: item.raw_text || item.original_script || item.english_transcript,
          original_script: item.original_script,
          english_transcript: item.english_transcript,
          category: item.category as SectorCategory,
          geo: {
            lat: Number(item.geo.lat),
            lng: Number(item.geo.lng),
            landmark: item.geo.landmark,
            ward: item.geo.ward,
          },
          urgency_score: Number(item.urgency_score),
          sentiment: Number(item.sentiment),
          consent_flag: Boolean(item.consent_flag),
          sender_hash: item.sender_hash,
          status: item.status || 'under_review',
          submitted_at: item.submitted_at || new Date().toISOString(),
          retention_expires_at: item.retention_expires_at || new Date(Date.now() + 86400000 * 90).toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Could not read citizen_grievances_real.json:', err);
    }
    return [];
  }

  /**
   * Universal Kaggle CSV / JSON parser for user-uploaded open datasets
   */
  public static parseUploadedDataset(
    content: string,
    filename: string
  ): {
    success: boolean;
    type: 'demographics' | 'infrastructure' | 'budget' | 'grievances' | 'generic';
    count: number;
    data: any[];
    error?: string;
  } {
    try {
      const isJson = filename.endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{');
      let records: any[] = [];

      if (isJson) {
        const parsed = JSON.parse(content);
        records = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // Parse CSV (supports comma or semicolon delimiter)
        records = this.parseCsv(content);
      }

      if (records.length === 0) {
        return { success: false, type: 'generic', count: 0, data: [], error: 'Dataset is empty' };
      }

      // Infer dataset type based on column keys
      const sample = records[0];
      const keys = Object.keys(sample).map((k) => k.toLowerCase());

      let inferredType: 'demographics' | 'infrastructure' | 'budget' | 'grievances' | 'generic' = 'generic';

      if (keys.some((k) => k.includes('vulnerability') || k.includes('density') || k.includes('population'))) {
        inferredType = 'demographics';
      } else if (keys.some((k) => k.includes('deficit') || k.includes('coverage') || k.includes('infra'))) {
        inferredType = 'infrastructure';
      } else if (keys.some((k) => k.includes('budget') || k.includes('allocated') || k.includes('fiscal'))) {
        inferredType = 'budget';
      } else if (keys.some((k) => k.includes('grievance') || k.includes('transcript') || k.includes('complaint') || k.includes('urgency'))) {
        inferredType = 'grievances';
      }

      return {
        success: true,
        type: inferredType,
        count: records.length,
        data: records,
      };
    } catch (err: any) {
      return {
        success: false,
        type: 'generic',
        count: 0,
        data: [],
        error: err.message || 'Failed to parse dataset file',
      };
    }
  }

  private static parseCsv(text: string): any[] {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));

    const records: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Basic CSV token parser respecting quotes
      const values: string[] = [];
      let inQuotes = false;
      let cur = '';

      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const char = line[charIndex];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          values.push(cur.trim().replace(/^["']|["']$/g, ''));
          cur = '';
        } else {
          cur += char;
        }
      }
      values.push(cur.trim().replace(/^["']|["']$/g, ''));

      const record: Record<string, any> = {};
      headers.forEach((h, idx) => {
        const val = values[idx] ?? '';
        record[h] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
      });
      records.push(record);
    }
    return records;
  }
}
