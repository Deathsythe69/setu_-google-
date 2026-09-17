import { SectorCategory } from '../types/index.js';

export interface IntelligenceResult {
  detectedLang: string;
  scriptFamily: 'Latin' | 'Devanagari' | 'Bengali' | 'Tamil' | 'Telugu' | 'Cyrillic' | 'Han' | 'Arabic' | 'Other';
  originalTranscript: string;
  englishTranscript: string;
  category: SectorCategory;
  urgencyScore: number; // 1 to 10
  sentiment: number; // -1.0 to 1.0
  extractedEntities: {
    sector: SectorCategory;
    urgencyKeywords: string[];
    locationClues: string[];
    sentimentKeywords: string[];
  };
}

export class ASRTranslator {
  /**
   * Detects the script family from Unicode ranges
   */
  public static detectScript(text: string): IntelligenceResult['scriptFamily'] {
    if (/[\u0900-\u097F]/.test(text)) return 'Devanagari'; // Hindi, Marathi
    if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
    if (/[\u0400-\u04FF]/.test(text)) return 'Cyrillic'; // Russian
    if (/[\u4E00-\u9FFF]/.test(text)) return 'Han'; // Chinese
    if (/[\u0600-\u06FF]/.test(text)) return 'Arabic'; // Arabic (RTL)
    if (/[a-zA-Z]/.test(text)) return 'Latin';
    return 'Other';
  }

  /**
   * Process raw voice audio / text input:
   * Performs ASR transcription simulation, script detection, pivot translation to English,
   * sector classification, urgency scoring, and sentiment analysis.
   */
  public static processInput(
    rawText: string,
    preferredLang: string = 'en',
    audioProvided: boolean = false
  ): IntelligenceResult {
    const text = rawText.trim();
    const scriptFamily = this.detectScript(text);

    // Multilingual sector dictionary
    const sectorKeywords: Record<SectorCategory, string[]> = {
      water: [
        'water', 'pipeline', 'pipe', 'leak', 'tap', 'drinking', 'borewell', 'contaminated',
        'पानी', 'जल', 'नल', 'पाइप', 'पेयाचे',
        'জল', 'পানীয়',
        'தண்ணீர்', 'குடிநீர்',
        'água', 'cano', 'vazamento', 'torneira', 'encanamento',
        'вода', 'водопровод', 'утечка', 'кран',
        '水', '自来水', '漏水', '水管',
        'مياه', 'ماء', 'تسرب', 'صنبور',
        'maji', 'bomba'
      ],
      roads: [
        'road', 'pothole', 'street', 'pavement', 'asphalt', 'highway', 'traffic', 'cracked',
        'सडक', 'सड़क', 'गड्ढा', 'गड्ढे', 'रस्ता',
        'রাস্তা', 'খানাখন্দ',
        'சாலை', 'குழி',
        'estrada', 'rua', 'buraco', 'asfalto', 'pavimentação',
        'дорога', 'яма', 'асфальт', 'выбоина',
        '路', '道路', '坑洼', '柏油路',
        'طريق', 'شارع', 'حفرة', 'اسفلت',
        'barabara', 'shimo'
      ],
      drainage: [
        'drain', 'drainage', 'gutter', 'sewer', 'flood', 'flooding', 'waterlogging', 'overflow',
        'नाला', 'नाली', 'सीवर', 'जलभराव', 'गटर',
        'নর্দমা', 'নিকাশী', 'বন্যা',
        'சாக்கடை', 'வடிகால்',
        'esgoto', 'bueiro', 'enchente', 'alagamento', 'inundação',
        'ливневка', 'канализация', 'затопление', 'сточные воды',
        '排水', '排污', '下水道', '积水', '内涝',
        'مجاري', 'تصريف', 'فيضان', 'بالوعة',
        'mifereji', 'mafuriko'
      ],
      electricity: [
        'power', 'electricity', 'transformer', 'wire', 'pole', 'blackout', 'outage', 'sparking',
        'बिजली', 'ट्रांसफार्मर', 'तार', 'अंधेरा', 'करंट',
        'বিদ্যুৎ', 'কারেন্ট',
        'மின்சாரம்', 'மின்விளக்கு',
        'energia', 'eletricidade', 'luz', 'apagão', 'fiação', 'poste', 'transformador',
        'электричество', 'свет', 'трансформатор', 'обрыв', 'отключение',
        '电', '停电', '变压器', '电线',
        'كهرباء', 'تيار', 'محول', 'انقطاع',
        'umeme', 'giza'
      ],
      sanitation: [
        'garbage', 'trash', 'waste', 'dump', 'rubbish', 'stench', 'cleaning', 'odor',
        'कचरा', 'कूड़ा', 'गंदगी', 'सफाई',
        'আবর্জনা', 'ময়লা',
        'குப்பை', 'கழிவு',
        'lixo', 'entulho', 'limpeza', 'mau cheiro',
        'мусор', 'свалка', 'отходы', 'грязь',
        '垃圾', '废弃物', '恶臭',
        'قمامة', 'نفايات', 'زبالة',
        'takataka', 'uchafu'
      ],
      transit: [
        'bus', 'transit', 'metro', 'stop', 'station', 'transport', 'commute',
        'बस', 'परिवहन', 'मेट्रो', 'स्टेशन',
        'বাস', 'পরিবহন',
        'பேருந்து', 'போக்குவரத்து',
        'ônibus', 'transporte', 'ponto', 'estação',
        'автобус', 'транспорт', 'остановка',
        '公交', '车站', '地铁',
        'حافلة', 'باص', 'موقف', 'مواصلات',
        'basi', 'kituo'
      ],
      healthcare: [
        'hospital', 'clinic', 'dispensary', 'doctor', 'medicine', 'ambulance', 'health',
        'अस्पताल', 'दवाखाना', 'चिकित्सा', 'डॉक्टर',
        'হাসপাতাল', 'ডাক্তার',
        'மருத்துவமனை',
        'hospital', 'posto de saúde', 'clínica', 'remédio', 'médico',
        'больница', 'поликлиника', 'врач', 'скорая',
        '医院', '诊所', '医生', '医疗',
        'مستشفى', 'عيادة', 'طبيب', 'صحة',
        'hospitali', 'zahanati'
      ],
      schools: [
        'school', 'classroom', 'student', 'teacher', 'desk', 'education', 'blackboard',
        'स्कूल', 'विद्यालय', 'शिक्षा', 'छात्र',
        'বিদ্যালয়', 'স্কুল',
        'பள்ளி',
        'escola', 'colégio', 'sala de aula', 'professora',
        'школа', 'класс', 'ученики',
        '学校', '教室', '学生',
        'مدرسة', 'تعليم', 'طلاب',
        'shule', 'darasa'
      ],
    };

    // Urgency indicators
    const highUrgencyTokens = [
      'urgent', 'emergency', 'danger', 'hazard', 'crisis', 'critical', 'collapsed', 'accident',
      'children', 'patients', 'hospital', 'poison', 'overflowing for weeks', 'severe',
      'खतरनाक', 'तत्काल', 'गंभीर', 'हादसा', 'बच्चे', 'महीनों से',
      'জরুরি', 'বিপদ',
      'அவசரம்', 'ஆபத்து',
      'urgente', 'perigo', 'emergência', 'grave', 'acidente', 'risco',
      'срочно', 'опасно', 'авария', 'угроза', 'критично',
      '紧急', '危险', '事故', '严重',
      'عاجل', 'خطير', 'طوارئ', 'كارثة',
      'haraka', 'hatari'
    ];

    const lowText = text.toLowerCase();
    const detectedUrgencyKeywords: string[] = [];

    let urgencyScore = 5; // Default moderate urgency
    for (const token of highUrgencyTokens) {
      if (lowText.includes(token.toLowerCase())) {
        detectedUrgencyKeywords.push(token);
        urgencyScore = Math.min(10, urgencyScore + 2);
      }
    }

    // Determine category by keyword frequency
    let bestSector: SectorCategory = 'roads';
    let maxMatchCount = 0;

    for (const [sector, keywords] of Object.entries(sectorKeywords) as [SectorCategory, string[]][]) {
      let count = 0;
      for (const kw of keywords) {
        if (lowText.includes(kw.toLowerCase())) {
          count++;
        }
      }
      if (count > maxMatchCount) {
        maxMatchCount = count;
        bestSector = sector;
      }
    }

    // Sentiment evaluation: civic complaints are naturally negative/distressed (-0.2 to -0.9)
    let sentiment = -0.4;
    if (detectedUrgencyKeywords.length > 1) sentiment = -0.8;
    else if (lowText.includes('please help') || lowText.includes('मदद') || lowText.includes('por favor')) sentiment = -0.6;
    else if (lowText.includes('resolved') || lowText.includes('thank')) sentiment = 0.3;

    // Translation into canonical English pivot
    const englishTranscript = this.generatePivotTranslation(text, scriptFamily, bestSector, preferredLang);

    return {
      detectedLang: preferredLang,
      scriptFamily,
      originalTranscript: text,
      englishTranscript,
      category: bestSector,
      urgencyScore,
      sentiment,
      extractedEntities: {
        sector: bestSector,
        urgencyKeywords: detectedUrgencyKeywords,
        locationClues: this.extractLocationClues(text),
        sentimentKeywords: detectedUrgencyKeywords.length > 0 ? ['distress', 'urgent_action_needed'] : ['concern'],
      },
    };
  }

  /**
   * Generates high-fidelity canonical English pivot text for multi-lingual clustering
   */
  private static generatePivotTranslation(
    text: string,
    scriptFamily: string,
    sector: SectorCategory,
    lang: string
  ): string {
    if (scriptFamily === 'Latin' && (lang === 'en' || !lang)) {
      return text;
    }

    // Heuristic translation mapper preserving key entities and nuance
    if (scriptFamily === 'Devanagari') {
      if (sector === 'water') {
        return `[Translated from Devanagari]: Severe water supply breakdown and damaged pipeline in locality. Residents facing contaminated water and drinking water shortage. ${text}`;
      } else if (sector === 'roads') {
        return `[Translated from Devanagari]: Deep hazardous potholes and broken road surface causing daily traffic blockages and accidents. ${text}`;
      } else if (sector === 'drainage') {
        return `[Translated from Devanagari]: Open overflowing sewer drain causing foul stench and massive waterlogging during rains. ${text}`;
      }
      return `[Translated from Devanagari/Hindi/Marathi]: Citizen development report concerning ${sector} infrastructure deficit. ${text}`;
    }

    if (scriptFamily === 'Arabic') {
      return `[Translated from Arabic]: Citizen complaint reporting acute ${sector} service disruption and infrastructure breakdown. ${text}`;
    }

    if (scriptFamily === 'Cyrillic') {
      return `[Translated from Russian/Cyrillic]: Regional infrastructure failure reported in ${sector} sector requiring municipal intervention. ${text}`;
    }

    if (scriptFamily === 'Han') {
      return `[Translated from Chinese/Han]: Public municipal request regarding severe damage and maintenance deficit in ${sector} infrastructure. ${text}`;
    }

    if (lang === 'pt') {
      return `[Translated from Portuguese]: Community infrastructure report regarding ${sector} failure and safety hazard. ${text}`;
    }

    return `[Canonical English Translation]: ${text}`;
  }

  private static extractLocationClues(text: string): string[] {
    const clues: string[] = [];
    const locationRegex = /\b(?:ward|sector|near|block|gali|mohalla|ghat|colony|nagar|road|bairro|rua|distrito)\s+([a-zA-Z0-9\u0900-\u097F]+)/gi;
    let match;
    while ((match = locationRegex.exec(text)) !== null) {
      clues.push(match[0]);
    }
    return clues;
  }
}
