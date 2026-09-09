// News Context — Global News State Provider
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { newsService, NewsItem, SubtitleSettings } from '@/services/newsService';
import { translationService } from '@/services/translationService';

interface NewsContextType {
  news: NewsItem[];
  publishedNews: NewsItem[];
  breakingNews: NewsItem[];
  flashNews: NewsItem[];
  regularNews: NewsItem[];
  subtitleSettings: SubtitleSettings;
  isLoading: boolean;
  currentActiveNews: NewsItem | null;
  addNews: (urduText: string, type: NewsItem['type'], authorId: string) => Promise<NewsItem>;
  updateNews: (id: string, updates: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  publishNews: (id: string) => Promise<void>;
  disableNews: (id: string) => Promise<void>;
  setCurrentActiveNews: (news: NewsItem | null) => void;
  updateSubtitleSettings: (settings: SubtitleSettings) => Promise<void>;
  refreshNews: () => Promise<void>;
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>(newsService.getDefaultSubtitleSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [currentActiveNews, setCurrentActiveNews] = useState<NewsItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [items, settings] = await Promise.all([
        newsService.getAll(),
        newsService.getSubtitleSettings(),
      ]);
      setNews(items);
      setSubtitleSettings(settings);
      const published = items.filter(n => n.status === 'published');
      if (published.length > 0 && !currentActiveNews) {
        setCurrentActiveNews(published[0]);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveAndUpdate = async (updated: NewsItem[]) => {
    setNews(updated);
    await newsService.save(updated);
  };

  const addNews = async (urduText: string, type: NewsItem['type'], authorId: string): Promise<NewsItem> => {
    const translations = await translationService.translateUrduToAll(urduText);
    const newItem: NewsItem = {
      id: newsService.createId(),
      type,
      urduText,
      translations,
      enabledLanguages: subtitleSettings.enabledLangs,
      status: 'draft',
      media: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      authorId,
      priority: news.length + 1,
      subtitleSettings: { ...subtitleSettings },
    };
    const updated = [newItem, ...news];
    await saveAndUpdate(updated);
    return newItem;
  };

  const updateNews = async (id: string, updates: Partial<NewsItem>) => {
    const updated = news.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    await saveAndUpdate(updated);
    if (currentActiveNews?.id === id) {
      const found = updated.find(n => n.id === id);
      if (found) setCurrentActiveNews(found);
    }
  };

  const deleteNews = async (id: string) => {
    const updated = news.filter(n => n.id !== id);
    await saveAndUpdate(updated);
    if (currentActiveNews?.id === id) {
      const pub = updated.find(n => n.status === 'published');
      setCurrentActiveNews(pub || null);
    }
  };

  const publishNews = async (id: string) => {
    await updateNews(id, { status: 'published', publishedAt: Date.now() });
    const found = news.find(n => n.id === id);
    if (found) setCurrentActiveNews({ ...found, status: 'published' });
  };

  const disableNews = async (id: string) => {
    await updateNews(id, { status: 'disabled' });
    if (currentActiveNews?.id === id) {
      const pub = news.find(n => n.id !== id && n.status === 'published');
      setCurrentActiveNews(pub || null);
    }
  };

  const updateSubtitleSettings = async (settings: SubtitleSettings) => {
    setSubtitleSettings(settings);
    await newsService.saveSubtitleSettings(settings);
  };

  const refreshNews = loadData;

  const publishedNews = news.filter(n => n.status === 'published');
  const breakingNews = publishedNews.filter(n => n.type === 'breaking');
  const flashNews = publishedNews.filter(n => n.type === 'flash');
  const regularNews = publishedNews.filter(n => n.type === 'regular');

  return (
    <NewsContext.Provider value={{
      news,
      publishedNews,
      breakingNews,
      flashNews,
      regularNews,
      subtitleSettings,
      isLoading,
      currentActiveNews,
      addNews,
      updateNews,
      deleteNews,
      publishNews,
      disableNews,
      setCurrentActiveNews,
      updateSubtitleSettings,
      refreshNews,
    }}>
      {children}
    </NewsContext.Provider>
  );
}
