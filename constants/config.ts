// SMART WORLD NEWS — App Configuration

export const APP_CONFIG = {
  appName: 'SMART WORLD NEWS',
  tagline: 'Truth through the Lens',
  version: '1.0.0',
  copyright: 'SMART WORLD ORDER — Dr M Irfan Qadir Thaheem',
  mainAdminPassword: 'SmartWorld2024#',
};

export const LANGUAGES = [
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true, bgColor: '#1A0A2E', textColor: '#FFD700', fontFamily: 'NotoNastaliqUrdu' },
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false, bgColor: '#0A1628', textColor: '#FFFFFF', fontFamily: undefined },
  { code: 'ar', name: 'Arabic', nativeName: 'عربي', isRTL: true, bgColor: '#1A0A14', textColor: '#FFD700', fontFamily: undefined },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isRTL: false, bgColor: '#0A1A0A', textColor: '#FFFFFF', fontFamily: undefined },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', isRTL: false, bgColor: '#1A0A00', textColor: '#FFD700', fontFamily: undefined },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isRTL: false, bgColor: '#0A1A1A', textColor: '#FFFFFF', fontFamily: undefined },
  { code: 'fa', name: 'Farsi', nativeName: 'فارسی', isRTL: true, bgColor: '#1A1200', textColor: '#FFD700', fontFamily: undefined },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false, bgColor: '#0A001A', textColor: '#FFD700', fontFamily: undefined },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false, bgColor: '#001A0A', textColor: '#FFFFFF', fontFamily: undefined },
  { code: 'bal', name: 'Balochi', nativeName: 'بلوچی', isRTL: true, bgColor: '#1A0818', textColor: '#FFD700', fontFamily: undefined },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', isRTL: true, bgColor: '#180A1A', textColor: '#FFD700', fontFamily: undefined },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', isRTL: true, bgColor: '#0E1A0A', textColor: '#FFD700', fontFamily: undefined },
];

export const DISCLAIMER_TEXT = `Disclaimer:
The news broadcast herein is derived from publicly available information. While the organization endeavors to verify every news item and ascertain solid evidence through all its resources, the organization shall not be held responsible for any inaccuracies or omissions in any news. It is your responsibility to confirm the information. JazakAllah and Thank you.

All copyrights reserved to:
SMART WORLD ORDER
One man Army.
Dr M Irfan Qadir Thaheem.
Backend, Research and Analytic on DARK realities, HIDDEN facts, DEEPER insights & Reality finding about Conspiracy theories running in the background only.
>>>Stay connected, and keep on watching.
SmartWorldOrder, One man Army.`;

export const MANIFESTO_TEXT = `Reminder/Memorial:
In an era dominated by sensationalism, promotion of destruction, fear-mongering, superficial portrayals, misinformation, and endless discussions on problems without solutions or practical measures, this channel stands in contrast to platforms facilitating global hegemonic agendas and propaganda. The true purpose and manifesto of this channel is not merely to transform the world into a global village or community, but to elevate it to a Global Family Platform. Our foremost principle is:

*The Global Family Platform Vision*

Through multi-language subtitles, our aim is to provide comprehensive public information, keep audiences informed of constantly evolving situations and events, and offer genuine insight into the underlying realities often inaccessible to the general public.
Comprehensive solutions, concise news, yet authentic and impactful.`;

export const MOCK_WEATHER = [
  { city: 'Karachi', temp: '34°C', condition: 'Sunny' },
  { city: 'Lahore', temp: '38°C', condition: 'Hot' },
  { city: 'Islamabad', temp: '29°C', condition: 'Cloudy' },
  { city: 'Dubai', temp: '41°C', condition: 'Clear' },
  { city: 'London', temp: '18°C', condition: 'Rainy' },
  { city: 'New York', temp: '24°C', condition: 'Partly Cloudy' },
  { city: 'Beijing', temp: '27°C', condition: 'Hazy' },
  { city: 'Moscow', temp: '15°C', condition: 'Overcast' },
  { city: 'Istanbul', temp: '26°C', condition: 'Sunny' },
  { city: 'Riyadh', temp: '45°C', condition: 'Hot' },
];

export const MOCK_CURRENCIES = [
  { pair: 'USD/PKR', rate: '278.50', change: '+0.30' },
  { pair: 'EUR/PKR', rate: '301.20', change: '+0.15' },
  { pair: 'GBP/PKR', rate: '351.80', change: '-0.20' },
  { pair: 'SAR/PKR', rate: '74.20', change: '+0.05' },
  { pair: 'AED/PKR', rate: '75.80', change: '+0.10' },
  { pair: 'CNY/PKR', rate: '38.40', change: '-0.08' },
  { pair: 'TRY/PKR', rate: '8.90', change: '+0.02' },
  { pair: 'GOLD/USD', rate: '2,345', change: '+12.50' },
  { pair: 'BTC/USD', rate: '67,420', change: '+850' },
];

export const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  ur: {
    default: 'یہاں خبر درج کریں اور ترجمہ دیکھیں',
    breaking: 'تازہ ترین خبریں براہ کرم توجہ فرمائیں',
  },
  en: {
    default: 'Enter news here and see translation',
    breaking: 'Breaking News — Please pay attention',
  },
  ar: {
    default: 'أدخل الأخبار هنا وشاهد الترجمة',
    breaking: 'عاجل — يرجى الانتباه إلى الأخبار',
  },
  tr: {
    default: 'Haberi buraya girin ve çeviriyi görün',
    breaking: 'Son Dakika — Lütfen dikkat edin',
  },
  hi: {
    default: 'यहाँ समाचार दर्ज करें और अनुवाद देखें',
    breaking: 'ब्रेकिंग न्यूज़ — कृपया ध्यान दें',
  },
  bn: {
    default: 'এখানে সংবাদ লিখুন এবং অনুবাদ দেখুন',
    breaking: 'ব্রেকিং নিউজ — মনোযোগ দিন',
  },
  fa: {
    default: 'اخبار را اینجا وارد کنید و ترجمه را ببینید',
    breaking: 'خبر فوری — لطفاً توجه کنید',
  },
  zh: {
    default: '在此输入新闻并查看翻译',
    breaking: '突发新闻——请注意',
  },
  ru: {
    default: 'Введите новость здесь и посмотрите перевод',
    breaking: 'Срочные новости — Пожалуйста, обратите внимание',
  },
  bal: {
    default: 'ئینجا خبر وارد بکن و ترجمه بکن',
    breaking: 'بریکنگ نیوز — توجه کنید',
  },
  sd: {
    default: 'هتي خبر داخل ڪريو ۽ ترجمو ڏسو',
    breaking: 'بريڪنگ نيوز — ڌيان ڏيو',
  },
  ps: {
    default: 'دلته خبر ولیکئ او ژباړه وګورئ',
    breaking: 'مهمه خبر — مهرباني وکړئ پام وکړئ',
  },
};
