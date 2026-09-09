// NewsEditorPanel — Admin news creation & management interface
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useNews } from '@/hooks/useNews';
import { useAdmin } from '@/hooks/useAdmin';
import { NewsItem } from '@/services/newsService';
import { LANGUAGES } from '@/constants/config';

type NewsType = 'breaking' | 'flash' | 'regular' | 'ticker';

const TYPE_CONFIG: Record<NewsType, { label: string; color: string; icon: string }> = {
  breaking: { label: 'BREAKING', color: Colors.redBright, icon: 'flash-on' },
  flash: { label: 'FLASH', color: '#4AABFF', icon: 'bolt' },
  regular: { label: 'REGULAR', color: Colors.gold, icon: 'article' },
  ticker: { label: 'TICKER', color: '#22C55E', icon: 'more-horiz' },
};

export function NewsEditorPanel() {
  const { addNews, news, publishNews, disableNews, deleteNews, updateNews, setCurrentActiveNews } = useNews();
  const { currentAdmin } = useAdmin();
  const [urduText, setUrduText] = useState('');
  const [newsType, setNewsType] = useState<NewsType>('breaking');
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  const handleCreate = async () => {
    if (!urduText.trim()) {
      Alert.alert('Error', 'Please enter Urdu news text');
      return;
    }
    if (!currentAdmin) return;
    setIsTranslating(true);
    try {
      const created = await addNews(urduText.trim(), newsType, currentAdmin.id);
      setUrduText('');
      Alert.alert('Success', `News created as draft. Publish it to broadcast.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to create news. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePublish = async (item: NewsItem) => {
    await publishNews(item.id);
    setCurrentActiveNews({ ...item, status: 'published' });
    Alert.alert('Published', 'News is now live on broadcast.');
  };

  const handleDelete = (item: NewsItem) => {
    Alert.alert(
      'Confirm Delete',
      `Delete this news?\n\n"${item.urduText.substring(0, 60)}..."`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNews(item.id) },
      ]
    );
  };

  const statusColor = (status: string) => {
    if (status === 'published') return Colors.success;
    if (status === 'disabled') return Colors.textMuted;
    return Colors.warning;
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['create', 'manage'] as const).map(tab => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <MaterialIcons
              name={tab === 'create' ? 'create' : 'list'}
              size={14}
              color={activeTab === tab ? Colors.gold : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'create' ? 'Create News' : `Manage (${news.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'create' ? (
          <View style={styles.createForm}>
            {/* Type selector */}
            <Text style={styles.fieldLabel}>News Type</Text>
            <View style={styles.typeRow}>
              {(Object.entries(TYPE_CONFIG) as [NewsType, typeof TYPE_CONFIG.breaking][]).map(([type, cfg]) => (
                <Pressable
                  key={type}
                  style={[styles.typeBtn, newsType === type && { backgroundColor: cfg.color + '25', borderColor: cfg.color }]}
                  onPress={() => setNewsType(type)}
                >
                  <MaterialIcons name={cfg.icon as any} size={13} color={newsType === type ? cfg.color : Colors.textMuted} />
                  <Text style={[styles.typeBtnText, newsType === type && { color: cfg.color }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Urdu Input */}
            <Text style={styles.fieldLabel}>News Text (Urdu)</Text>
            <View style={styles.urduInputWrapper}>
              <TextInput
                style={styles.urduInput}
                value={urduText}
                onChangeText={setUrduText}
                placeholder="یہاں اردو خبر لکھیں..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                textAlign="right"
                writingDirection="rtl"
              />
              <Text style={styles.charCount}>{urduText.length} chars</Text>
            </View>

            <Text style={styles.translationNote}>
              <MaterialIcons name="translate" size={11} color={Colors.gold} /> Auto-translates to:{' '}
              {LANGUAGES.map(l => l.nativeName).join(' • ')}
            </Text>

            {/* Create button */}
            <Pressable
              style={({ pressed }) => [styles.createBtn, isTranslating && styles.createBtnDisabled, pressed && { opacity: 0.85 }]}
              onPress={handleCreate}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <>
                  <ActivityIndicator size="small" color={Colors.studioDark} />
                  <Text style={styles.createBtnText}>Translating & Creating...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="add-circle" size={18} color={Colors.studioDark} />
                  <Text style={styles.createBtnText}>Create News (Save as Draft)</Text>
                </>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.manageList}>
            {news.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="article" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No news items yet</Text>
              </View>
            ) : (
              news.map(item => {
                const typeCfg = TYPE_CONFIG[item.type];
                return (
                  <View key={item.id} style={styles.newsCard}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={[styles.typePill, { backgroundColor: typeCfg.color + '20' }]}>
                        <MaterialIcons name={typeCfg.icon as any} size={10} color={typeCfg.color} />
                        <Text style={[styles.typeLabel, { color: typeCfg.color }]}>{typeCfg.label}</Text>
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: statusColor(item.status) + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
                        <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                          {item.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {/* News text */}
                    <Text style={styles.newsTextPreview} numberOfLines={2}>
                      {item.urduText}
                    </Text>
                    <Text style={styles.newsEnPreview} numberOfLines={1}>
                      {item.translations?.['en'] || ''}
                    </Text>

                    {/* Action buttons */}
                    <View style={styles.actionRow}>
                      {item.status !== 'published' && (
                        <Pressable
                          style={[styles.actionBtn, styles.publishBtn]}
                          onPress={() => handlePublish(item)}
                        >
                          <MaterialIcons name="publish" size={13} color={Colors.studioDark} />
                          <Text style={styles.publishBtnText}>Publish</Text>
                        </Pressable>
                      )}
                      {item.status === 'published' && (
                        <Pressable
                          style={[styles.actionBtn, styles.disableBtn]}
                          onPress={() => disableNews(item.id)}
                        >
                          <MaterialIcons name="pause-circle" size={13} color={Colors.warning} />
                          <Text style={styles.disableBtnText}>Disable</Text>
                        </Pressable>
                      )}
                      {item.status === 'disabled' && (
                        <Pressable
                          style={[styles.actionBtn, styles.publishBtn]}
                          onPress={() => handlePublish(item)}
                        >
                          <MaterialIcons name="play-circle" size={13} color={Colors.studioDark} />
                          <Text style={styles.publishBtnText}>Enable</Text>
                        </Pressable>
                      )}
                      <Pressable
                        style={[styles.actionBtn, styles.setLiveBtn]}
                        onPress={() => item.status === 'published' && setCurrentActiveNews(item)}
                      >
                        <MaterialIcons name="live-tv" size={13} color={Colors.gold} />
                        <Text style={styles.setLiveBtnText}>Set Live</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={() => handleDelete(item)}
                      >
                        <MaterialIcons name="delete" size={13} color={Colors.error} />
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioCard,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.studioPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.gold,
  },
  scroll: {
    flex: 1,
  },
  createForm: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    backgroundColor: Colors.studioPanel,
  },
  typeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  urduInputWrapper: {
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    marginBottom: Spacing.xs,
  },
  urduInput: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    padding: Spacing.sm,
    minHeight: 96,
    textAlignVertical: 'top',
    lineHeight: 26,
  },
  charCount: {
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'right',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  translationNote: {
    color: Colors.textMuted,
    fontSize: 10,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
    marginTop: Spacing.xs,
  },
  createBtnDisabled: {
    backgroundColor: Colors.studioBorder,
  },
  createBtnText: {
    color: Colors.studioDark,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  manageList: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  newsCard: {
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    marginLeft: 'auto',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  newsTextPreview: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    textAlign: 'right',
    lineHeight: 20,
    writingDirection: 'rtl',
  },
  newsEnPreview: {
    color: Colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  publishBtn: {
    backgroundColor: Colors.success + '20',
    borderWidth: 1,
    borderColor: Colors.success + '50',
  },
  publishBtnText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  disableBtn: {
    backgroundColor: Colors.warning + '20',
    borderWidth: 1,
    borderColor: Colors.warning + '50',
  },
  disableBtnText: {
    color: Colors.warning,
    fontSize: 10,
    fontWeight: '700',
  },
  setLiveBtn: {
    backgroundColor: Colors.gold + '20',
    borderWidth: 1,
    borderColor: Colors.gold + '50',
  },
  setLiveBtnText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: Colors.error + '15',
    borderWidth: 1,
    borderColor: Colors.error + '40',
    marginLeft: 'auto',
  },
});
