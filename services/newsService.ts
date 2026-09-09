// News Service — Data Layer
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NewsType = 'breaking' | 'flash' | 'regular' | 'ticker';
export type NewsStatus = 'draft' | 'published' | 'disabled';

export interface NewsMedia {
  id: string;
  type: 'image' | 'video';
  uri: string;
  thumbnail?: string;
}

export interface NewsItem {
  id: string;
  type: NewsType;
  urduText: string;
  translations: Record<string, string>;
  enabledLanguages: string[];
  status: NewsStatus;
  media: NewsMedia[];
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
  authorId: string;
  priority: number;
  subtitleSettings: SubtitleSettings;
}

export interface SubtitleSettings {
  fontSize: number;
  speed: number;
  showBackground: boolean;
  brightness: number;
  enabledLangs: string[];
  langColors: Record<string, string>;
  langTextColors: Record<string, string>;
}

const STORAGE_KEY = 'swn_news_items';
const SETTINGS_KEY = 'swn_subtitle_settings';

const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
  fontSize: 15,
  speed: 60,
  showBackground: true,
  brightness: 1.0,
  enabledLangs: ['ur', 'en', 'ar', 'tr', 'hi', 'bn', 'fa', 'zh', 'ru', 'ps'],
  langColors: {},
  langTextColors: {},
};

const SAMPLE_NEWS: NewsItem[] = [
  {
    id: '1',
    type: 'breaking',
    urduText: 'عالمی سطح پر اہم تبدیلیاں رونما ہو رہی ہیں۔ ہوشیار رہیں۔',
    translations: {
      en: 'Major global changes are taking place. Stay alert.',
      ar: 'تحدث تغييرات عالمية كبرى. كن يقظاً.',
      tr: 'Büyük küresel değişiklikler gerçekleşiyor. Dikkatli olun.',
      hi: 'वैश्विक स्तर पर बड़े बदलाव हो रहे हैं। सतर्क रहें।',
      bn: 'বৈশ্বিক পর্যায়ে বড় পরিবর্তন হচ্ছে। সতর্ক থাকুন।',
      fa: 'تغییرات بزرگ جهانی در حال وقوع است. هوشیار باشید.',
      zh: '全球重大变化正在发生。保持警觉。',
      ru: 'Происходят серьёзные глобальные изменения. Будьте бдительны.',
      ps: 'نړیواله کچه لوی بدلونونه راځي. هوښیار اوسئ.',
      bal: 'جهانی سطح پر بڑی تبدیلیاں آ رہی ہیں۔',
      sd: 'عالمي سطح تي وڏيون تبديليون اچي رهيون آهن.',
    },
    enabledLanguages: ['ur', 'en', 'ar', 'tr', 'hi', 'bn', 'fa', 'zh', 'ru', 'ps'],
    status: 'published',
    media: [],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    publishedAt: Date.now() - 1800000,
    authorId: 'main_admin',
    priority: 1,
    subtitleSettings: DEFAULT_SUBTITLE_SETTINGS,
  },
  {
    id: '2',
    type: 'flash',
    urduText: 'اسمارٹ ورلڈ نیوز میں خوش آمدید۔ سچائی لینس کے ذریعے۔',
    translations: {
      en: 'Welcome to Smart World News. Truth through the Lens.',
      ar: 'مرحباً بكم في Smart World News. الحقيقة من خلال العدسة.',
      tr: 'Smart World News\'e hoş geldiniz. Mercek aracılığıyla gerçek.',
      hi: 'स्मार्ट वर्ल्ड न्यूज़ में आपका स्वागत है। लेंस के माध्यम से सच्चाई।',
      bn: 'স্মার্ট ওয়ার্ল্ড নিউজে স্বাগতম। লেন্সের মাধ্যমে সত্য।',
      fa: 'به Smart World News خوش آمدید. حقیقت از طریق لنز.',
      zh: '欢迎收看智慧世界新闻。透过镜头看真相。',
      ru: 'Добро пожаловать на Smart World News. Правда через объектив.',
      ps: 'سمارټ ورلډ نیوز ته ښه راغلاست. د لینز له لارې حقیقت.',
      bal: 'اسمارٹ ورلڈ نیوز میں خوش آمدید۔',
      sd: 'اسمارٽ ورلڊ نيوز ۾ ڀلي ڪري آيا.',
    },
    enabledLanguages: ['ur', 'en', 'ar', 'tr', 'hi', 'bn', 'fa', 'zh', 'ru', 'ps'],
    status: 'published',
    media: [],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
    publishedAt: Date.now() - 3600000,
    authorId: 'main_admin',
    priority: 2,
    subtitleSettings: DEFAULT_SUBTITLE_SETTINGS,
  },
];

export const newsService = {
  async getAll(): Promise<NewsItem[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_NEWS));
      return SAMPLE_NEWS;
    } catch {
      return SAMPLE_NEWS;
    }
  },

  async save(items: NewsItem[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  async getSubtitleSettings(): Promise<SubtitleSettings> {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
      return DEFAULT_SUBTITLE_SETTINGS;
    } catch {
      return DEFAULT_SUBTITLE_SETTINGS;
    }
  },

  async saveSubtitleSettings(settings: SubtitleSettings): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  createId(): string {
    return `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  getDefaultSubtitleSettings(): SubtitleSettings {
    return { ...DEFAULT_SUBTITLE_SETTINGS };
  },
};
