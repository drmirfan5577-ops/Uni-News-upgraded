// News Feed Screen — Viewer mode
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useNews } from '@/hooks/useNews';
import { NewsItem } from '@/services/newsService';
import { WeatherCurrencyBar } from '@/components/ui/WeatherCurrencyBar';

type FilterType = 'all' | 'breaking' | 'flash' | 'regular';

const FILTERS: { key: FilterType; label: string; color: string }[] = [
  { key: 'all', label: 'ALL', color: Colors.gold },
  { key: 'breaking', label: '⚡ BREAKING', color: Colors.redBright },
  { key: 'flash', label: '📡 FLASH', color: '#4AABFF' },
  { key: 'regular', label: '📰 REGULAR', color: Colors.textSecondary },
];

export default function NewsFeedScreen() {
  const { publishedNews, setCurrentActiveNews } = useNews();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? publishedNews : publishedNews.filter(n => n.type === filter);

  const handleSetLive = (item: NewsItem) => {
    setCurrentActiveNews(item);
  };

  const renderItem = ({ item }: { item: NewsItem }) => {
    const isExpanded = expandedId === item.id;
    const typeColors: Record<string, string> = {
      breaking: Colors.redBright,
      flash: '#4AABFF',
      regular: Colors.gold,
      ticker: Colors.success,
    };
    const typeColor = typeColors[item.type] || Colors.gold;

    return (
      <Pressable
        style={({ pressed }) => [styles.newsCard, pressed && { opacity: 0.9 }]}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        {/* Card header */}
        <View style={styles.cardTop}>
          <View style={[styles.typePill, { backgroundColor: typeColor + '20', borderColor: typeColor + '50' }]}>
            <Text style={[styles.typePillText, { color: typeColor }]}>{item.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.timeAgo}>
            {getTimeAgo(item.publishedAt || item.createdAt)}
          </Text>
          <Pressable
            style={styles.setLiveBtn}
            onPress={() => handleSetLive(item)}
          >
            <MaterialIcons name="live-tv" size={12} color={Colors.gold} />
            <Text style={styles.setLiveBtnText}>Set Live</Text>
          </Pressable>
        </View>

        {/* Urdu text */}
        <Text style={styles.urduText} numberOfLines={isExpanded ? undefined : 2}>
          {item.urduText}
        </Text>

        {/* English */}
        <Text style={styles.engText} numberOfLines={isExpanded ? undefined : 1}>
          {item.translations?.['en'] || ''}
        </Text>

        {/* Expanded — all languages */}
        {isExpanded && (
          <View style={styles.translationsGrid}>
            {item.enabledLanguages.map(code => {
              const text = item.translations?.[code];
              if (!text || code === 'ur') return null;
              const lang = require('@/constants/config').LANGUAGES.find((l: any) => l.code === code);
              return (
                <View key={code} style={[styles.transRow, { backgroundColor: lang?.bgColor || Colors.studioPanel }]}>
                  <Text style={[styles.transLang, { color: lang?.textColor || Colors.gold }]}>
                    {lang?.nativeName || code}
                  </Text>
                  <Text style={[styles.transText, { color: lang?.textColor || Colors.textSecondary }]} numberOfLines={2}>
                    {text}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Expand/collapse */}
        <View style={styles.expandRow}>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={16}
            color={Colors.textMuted}
          />
          <Text style={styles.expandText}>
            {isExpanded ? 'Show less' : `${item.enabledLanguages.length} languages • Tap to expand`}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <WeatherCurrencyBar />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NEWS FEED</Text>
          <Text style={styles.headerSub}>{publishedNews.length} published stories</Text>
        </View>

        {/* Filter bar */}
        <View style={styles.filterBar}>
          <FlatList
            data={FILTERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={f => f.key}
            contentContainerStyle={styles.filterList}
            renderItem={({ item: f }) => (
              <Pressable
                style={[styles.filterChip, filter === f.key && { backgroundColor: f.color + '20', borderColor: f.color }]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.filterChipText, filter === f.key && { color: f.color }]}>
                  {f.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons name="newspaper" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No news in this category</Text>
            <Text style={styles.emptySubtitle}>Published news will appear here</Text>
          </View>
        )}
      />
    </View>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioDark,
  },
  safeHeader: {
    backgroundColor: Colors.studioDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '30',
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: FontSize.lg,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  filterBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.studioBorder,
  },
  filterList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    backgroundColor: Colors.studioPanel,
  },
  filterChipText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  listContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: 100,
  },
  newsCard: {
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    padding: Spacing.sm,
    gap: 8,
    marginBottom: Spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  typePillText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timeAgo: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 9,
  },
  setLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.gold + '15',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
  },
  setLiveBtnText: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '700',
  },
  urduText: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 28,
    fontWeight: '600',
  },
  engText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  translationsGrid: {
    gap: 4,
    marginTop: 4,
  },
  transRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 6,
    borderRadius: BorderRadius.sm,
    gap: 8,
  },
  transLang: {
    fontSize: 9,
    fontWeight: '800',
    minWidth: 36,
  },
  transText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.studioBorder,
  },
  expandText: {
    color: Colors.textMuted,
    fontSize: 9,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    gap: 12,
  },
  emptyTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});
