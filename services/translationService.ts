// Translation Service — Mock AI Translation
import { MOCK_TRANSLATIONS } from '@/constants/config';

const LANGUAGE_PREFIXES: Record<string, string[]> = {
  en: ['Breaking: ', 'Flash: ', 'Update: ', 'Report: ', 'Alert: '],
  ar: ['عاجل: ', 'تقرير: ', 'تحديث: ', 'خبر: '],
  tr: ['Son Dakika: ', 'Rapor: ', 'Güncelleme: ', 'Haber: '],
  hi: ['ब्रेकिंग: ', 'रिपोर्ट: ', 'अपडेट: ', 'समाचार: '],
  bn: ['ব্রেকিং: ', 'রিপোর্ট: ', 'আপডেট: ', 'সংবাদ: '],
  fa: ['فوری: ', 'گزارش: ', 'به‌روزرسانی: ', 'خبر: '],
  zh: ['突发: ', '报道: ', '更新: ', '新闻: '],
  ru: ['Срочно: ', 'Сообщение: ', 'Обновление: ', 'Новость: '],
  ps: ['بریکنګ: ', 'راپور: ', 'تازه: ', 'خبر: '],
  bal: ['بریکنگ: ', 'رپورٹ: ', 'خبر: '],
  sd: ['بريڪنگ: ', 'رپورٽ: ', 'خبر: '],
};

// Phrase-level mock translations for common news patterns
const URDU_PATTERNS: Array<{ pattern: RegExp; translations: Record<string, string> }> = [
  {
    pattern: /پاکستان/,
    translations: {
      en: 'Pakistan', ar: 'باكستان', tr: 'Pakistan', hi: 'पाकिस्तान',
      bn: 'পাকিস্তান', fa: 'پاکستان', zh: '巴基斯坦', ru: 'Пакистан',
      ps: 'پاکستان', bal: 'پاکستان', sd: 'پاڪستان',
    },
  },
  {
    pattern: /حکومت/,
    translations: {
      en: 'government', ar: 'الحكومة', tr: 'hükümet', hi: 'सरकार',
      bn: 'সরকার', fa: 'دولت', zh: '政府', ru: 'правительство',
      ps: 'حکومت', bal: 'حکومت', sd: 'حڪومت',
    },
  },
  {
    pattern: /اقتصادی/,
    translations: {
      en: 'economic', ar: 'اقتصادي', tr: 'ekonomik', hi: 'आर्थिक',
      bn: 'অর্থনৈতিক', fa: 'اقتصادی', zh: '经济', ru: 'экономический',
      ps: 'اقتصادي', bal: 'اقتصادی', sd: 'اقتصادي',
    },
  },
];

export const translationService = {
  async translateUrduToAll(urduText: string): Promise<Record<string, string>> {
    // Simulate async translation delay
    await new Promise(r => setTimeout(r, 800));

    const translations: Record<string, string> = { ur: urduText };
    const langs = ['en', 'ar', 'tr', 'hi', 'bn', 'fa', 'zh', 'ru', 'ps', 'bal', 'sd'];

    for (const lang of langs) {
      translations[lang] = this.mockTranslate(urduText, lang);
    }

    return translations;
  },

  mockTranslate(text: string, targetLang: string): string {
    // Use mock phrase templates for demonstration
    const templates: Record<string, string[]> = {
      en: [
        `[EN] ${text.length > 50 ? 'Important news update from Smart World News' : 'News update: ' + this.urduToEnglishHints(text)}`,
        `Breaking update: Global situation requires attention. Smart World News reporting.`,
        `Smart World News reports: Significant developments emerging. Stay informed.`,
      ],
      ar: [
        `[AR] تقرير خاص: تطورات مهمة تجري في مختلف أنحاء العالم. متابعون معكم.`,
        `عاجل: Smart World News يقدم أحدث المستجدات والأخبار العاجلة.`,
        `تحديث: الوضع العالمي يشهد تغييرات جوهرية. ابقوا على اطلاع.`,
      ],
      tr: [
        `[TR] Önemli haber: Dünya genelinde önemli gelişmeler yaşanıyor. Smart World News bildiriyor.`,
        `Son dakika: Küresel durum dikkat gerektiriyor. Haberdar kalın.`,
        `Güncelleme: Önemli gelişmeler yaşanıyor. Smart World News takibinde.`,
      ],
      hi: [
        `[HI] महत्वपूर्ण समाचार: दुनिया भर में महत्वपूर्ण घटनाएं हो रही हैं। स्मार्ट वर्ल्ड न्यूज़ रिपोर्टिंग।`,
        `ब्रेकिंग: वैश्विक स्थिति पर ध्यान देने की जरूरत है।`,
        `अपडेट: महत्वपूर्ण विकास सामने आ रहे हैं।`,
      ],
      bn: [
        `[BN] গুরুত্বপূর্ণ সংবাদ: বিশ্বজুড়ে উল্লেখযোগ্য ঘটনাবলী ঘটছে। স্মার্ট ওয়ার্ল্ড নিউজ রিপোর্টিং।`,
        `ব্রেকিং: বৈশ্বিক পরিস্থিতিতে মনোযোগ প্রয়োজন।`,
        `আপডেট: গুরুত্বপূর্ণ উন্নয়ন আসছে।`,
      ],
      fa: [
        `[FA] خبر مهم: تحولات مهمی در سراسر جهان در حال وقوع است. گزارش Smart World News.`,
        `فوری: وضعیت جهانی نیاز به توجه دارد. در جریان بمانید.`,
        `به‌روزرسانی: تحولات مهمی ظاهر می‌شوند.`,
      ],
      zh: [
        `[ZH] 重要新闻：世界各地正在发生重大事件。智慧世界新闻报道。`,
        `突发：全球形势需要关注。保持关注。`,
        `更新：重要进展正在出现。`,
      ],
      ru: [
        `[RU] Важные новости: По всему миру происходят значительные события. Репортаж Smart World News.`,
        `Срочно: Глобальная ситуация требует внимания. Оставайтесь в курсе.`,
        `Обновление: Появляются важные события.`,
      ],
      ps: [
        `[PS] مهمه خبر: د نړۍ پر کچه مهم پیښې رامنځته کیږي. د سمارټ ورلډ نیوز راپور.`,
        `بریکنګ: نړیوال حالات ته پام ته اړتیا ده.`,
        `تازه: مهم پرمختګونه راڅرګندیږي.`,
      ],
      bal: [
        `[BAL] مهم خبر: دنیا میں اہم واقعات ہو رہے ہیں۔ اسمارٹ ورلڈ نیوز رپورٹ۔`,
        `بریکنگ: عالمی حالات پر توجہ ضروری ہے۔`,
      ],
      sd: [
        `[SD] اهم خبر: دنيا ۾ اهم واقعا ٿي رهيا آهن. اسمارٽ ورلڊ نيوز رپورٽ.`,
        `بريڪنگ: عالمي حالات تي ڌيان ضروري آهي.`,
      ],
    };

    const arr = templates[targetLang] || [`[${targetLang.toUpperCase()}] ${text}`];
    const idx = Math.abs(text.length) % arr.length;
    return arr[idx];
  },

  urduToEnglishHints(text: string): string {
    let result = text;
    // Very basic word-level hints
    const map: Record<string, string> = {
      'پاکستان': 'Pakistan',
      'حکومت': 'government',
      'عوام': 'people',
      'خبر': 'news',
      'اہم': 'important',
      'فوری': 'urgent',
      'بڑا': 'major',
      'چھوٹا': 'minor',
      'ملک': 'country',
      'دنیا': 'world',
    };
    for (const [ur, en] of Object.entries(map)) {
      result = result.replace(new RegExp(ur, 'g'), en);
    }
    return result.length > 60 ? result.substring(0, 60) + '...' : result;
  },
};
