// Main Broadcast Screen — SMART WORLD NEWS
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useNews } from '@/hooks/useNews';
import { useAdmin } from '@/hooks/useAdmin';
import { SubtitleTicker } from '@/components/ui/SubtitleTicker';
import { WeatherCurrencyBar } from '@/components/ui/WeatherCurrencyBar';
import { BreakingNewsBar } from '@/components/ui/BreakingNewsBar';
import { NewsTickerBar } from '@/components/ui/NewsTickerBar';
import { LANGUAGES } from '@/constants/config';

const { width: SW, height: SH } = Dimensions.get('window');

export default function BroadcastScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { publishedNews, breakingNews, flashNews, regularNews, currentActiveNews, subtitleSettings, isLoading } = useNews();
  const { isAuthenticated } = useAdmin();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const liveAnim = useRef(new Animated.Value(1)).current;

  // Live indicator pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(liveAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (isFullscreen) {
      const timer = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(timer);
    }
    setShowControls(true);
  }, [isFullscreen]);

  const activeNews = currentActiveNews;
  const enabledLangs = subtitleSettings.enabledLangs;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (isMinimized) {
    return (
      <SafeAreaView style={styles.minimizedContainer} edges={['top']}>
        <Pressable style={styles.minimizedBar} onPress={() => setIsMinimized(false)}>
          <Animated.View style={[styles.liveDot, { opacity: liveAnim }]} />
          <Text style={styles.minimizedText}>SWN LIVE</Text>
          {activeNews && (
            <Text style={styles.minimizedNewsText} numberOfLines={1}>
              {activeNews.translations?.['en'] || activeNews.urduText}
            </Text>
          )}
          <Pressable onPress={() => setIsMinimized(false)}>
            <MaterialIcons name="open-in-full" size={16} color={Colors.gold} />
          </Pressable>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreen]}>
      <StatusBar style="light" />

      {/* UPPER 1/3 — Studio Header + Main Content */}
      <SafeAreaView style={styles.upperThird} edges={['top']}>
        {/* Weather & Currency Ticker */}
        <WeatherCurrencyBar />

        {/* Studio Header */}
        <Pressable
          style={styles.studioHeader}
          onPress={() => { if (isFullscreen) setShowControls(true); }}
        >
          {/* Left — Logo */}
          <View style={styles.headerLeft}>
            <View style={styles.logoMini}>
              <Text style={styles.logoMiniText}>SWN</Text>
            </View>
            <View>
              <Text style={styles.channelNameSmall}>SMART WORLD NEWS</Text>
              <Text style={styles.taglineSmall}>Truth through the Lens</Text>
            </View>
          </View>

          {/* Center — LIVE indicator */}
          <View style={styles.liveCenter}>
            <Animated.View style={[styles.liveDot, { opacity: liveAnim }]} />
            <Text style={styles.liveText}>LIVE</Text>
            <View style={styles.newsCountBadge}>
              <Text style={styles.newsCountText}>{publishedNews.length}</Text>
            </View>
          </View>

          {/* Right — Clock & Controls */}
          <View style={styles.headerRight}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <View style={styles.controlIcons}>
              {isAuthenticated && (
                <Pressable onPress={() => router.push('/admin')} hitSlop={8}>
                  <MaterialIcons name="admin-panel-settings" size={18} color={Colors.gold} />
                </Pressable>
              )}
              {!isAuthenticated && (
                <Pressable onPress={() => router.push('/admin')} hitSlop={8}>
                  <MaterialIcons name="lock" size={16} color={Colors.textMuted} />
                </Pressable>
              )}
              <Pressable onPress={() => setIsMinimized(true)} hitSlop={8}>
                <MaterialIcons name="minimize" size={18} color={Colors.textSecondary} />
              </Pressable>
              <Pressable onPress={() => setIsFullscreen(!isFullscreen)} hitSlop={8}>
                <MaterialIcons
                  name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>

        {/* Date Banner */}
        <View style={styles.dateBanner}>
          <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        </View>

        {/* Breaking News */}
        {breakingNews.length > 0 && <BreakingNewsBar news={breakingNews} />}
      </SafeAreaView>

      {/* MIDDLE 1/3 — Main News Display */}
      <View style={styles.middleThird}>
        {isLoading ? (
          <View style={styles.loadingCenter}>
            <MaterialIcons name="live-tv" size={40} color={Colors.textMuted} />
            <Text style={styles.loadingText}>Loading broadcast...</Text>
          </View>
        ) : activeNews ? (
          <ScrollView
            style={styles.mainNewsScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* News Type badge */}
            <View style={styles.newsTypeBadge}>
              <MaterialIcons
                name={activeNews.type === 'breaking' ? 'flash-on' : 'article'}
                size={12}
                color={activeNews.type === 'breaking' ? Colors.redBright : Colors.gold}
              />
              <Text style={[
                styles.newsTypeBadgeText,
                { color: activeNews.type === 'breaking' ? Colors.redBright : Colors.gold },
              ]}>
                {activeNews.type.toUpperCase()} NEWS
              </Text>
            </View>

            {/* Main Urdu text */}
            <Text style={styles.mainUrduText}>{activeNews.urduText}</Text>

            {/* English translation */}
            {activeNews.translations?.['en'] && (
              <Text style={styles.mainEnglishText}>{activeNews.translations['en']}</Text>
            )}

            {/* Language indicators */}
            <View style={styles.langIndicatorRow}>
              {enabledLangs.slice(0, 8).map(code => {
                const lang = LANGUAGES.find(l => l.code === code);
                return lang ? (
                  <View key={code} style={[styles.langIndicator, { backgroundColor: lang.bgColor }]}>
                    <Text style={[styles.langIndicatorText, { color: lang.textColor }]}>
                      {lang.nativeName}
                    </Text>
                  </View>
                ) : null;
              })}
              {enabledLangs.length > 8 && (
                <View style={styles.langIndicator}>
                  <Text style={styles.langIndicatorText}>+{enabledLangs.length - 8}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.standbyScreen}>
            <View style={styles.standbyLogo}>
              <Text style={styles.standbyLogoText}>SWN</Text>
            </View>
            <Text style={styles.standbyTitle}>SMART WORLD NEWS</Text>
            <Text style={styles.standbyTagline}>Truth through the Lens</Text>
            <View style={styles.standbyInfo}>
              <Animated.View style={[styles.standbyDot, { opacity: liveAnim }]} />
              <Text style={styles.standbyText}>
                {isAuthenticated ? 'No active news — Go to Admin to publish' : 'Channel is on standby'}
              </Text>
            </View>
          </View>
        )}

        {/* Flash News Ticker */}
        {flashNews.length > 0 && (
          <View style={styles.flashTickerArea}>
            <NewsTickerBar news={flashNews} type="flash" />
          </View>
        )}
      </View>

      {/* LOWER 1/3 — Multi-language Subtitles ONLY */}
      <View style={styles.lowerThird}>
        <View style={styles.subtitleHeader}>
          <MaterialIcons name="subtitles" size={10} color={Colors.gold + '80'} />
          <Text style={styles.subtitleHeaderText}>MULTI-LANGUAGE SUBTITLES</Text>
          <Text style={styles.subtitleHeaderCount}>{enabledLangs.length} Languages</Text>
        </View>

        {activeNews ? (
          enabledLangs.map(code => {
            const text = activeNews.translations?.[code] || activeNews.urduText;
            return (
              <SubtitleTicker
                key={code}
                langCode={code}
                text={text}
                settings={subtitleSettings}
              />
            );
          })
        ) : (
          <View style={styles.subtitleStandby}>
            <Text style={styles.subtitleStandbyText}>
              Subtitles will appear here when news is broadcasting
            </Text>
            <View style={styles.subtitlePreviewRow}>
              {LANGUAGES.slice(0, 5).map(lang => (
                <View key={lang.code} style={[styles.subtitlePreviewChip, { backgroundColor: lang.bgColor }]}>
                  <Text style={[styles.subtitlePreviewText, { color: lang.textColor }]}>
                    {lang.nativeName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Regular News Ticker — very bottom */}
      {regularNews.length > 0 && (
        <NewsTickerBar news={regularNews} type="regular" />
      )}
    </View>
  );
}

const UPPER = SH * 0.28;
const MIDDLE = SH * 0.38;
const LOWER = SH * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioDark,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  minimizedContainer: {
    backgroundColor: Colors.studioDark,
    flex: 1,
    justifyContent: 'flex-start',
  },
  minimizedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.studioDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '40',
    padding: Spacing.sm,
    gap: 8,
  },
  minimizedText: {
    color: Colors.gold,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  minimizedNewsText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },

  // UPPER 1/3
  upperThird: {
    backgroundColor: Colors.studioDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '30',
  },
  studioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  logoMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  logoMiniText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  channelNameSmall: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  taglineSmall: {
    color: Colors.textMuted,
    fontSize: 8,
    fontStyle: 'italic',
  },
  liveCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.red + '20',
    borderRadius: BorderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.redBright + '60',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.redBright,
  },
  liveText: {
    color: Colors.redBright,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  newsCountBadge: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.round,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsCountText: {
    color: Colors.studioDark,
    fontSize: 9,
    fontWeight: '900',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  controlIcons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dateBanner: {
    backgroundColor: Colors.studioPanel,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.studioBorder,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: 9,
    letterSpacing: 0.5,
    fontWeight: '500',
  },

  // MIDDLE 1/3
  middleThird: {
    flex: 1,
    backgroundColor: Colors.studioMid,
    position: 'relative',
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  mainNewsScroll: {
    flex: 1,
    padding: Spacing.md,
  },
  newsTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
  },
  newsTypeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mainUrduText: {
    color: Colors.textPrimary,
    fontSize: 18,
    lineHeight: 34,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '600',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255,215,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  mainEnglishText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  langIndicatorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: Spacing.xs,
  },
  langIndicator: {
    borderRadius: BorderRadius.round,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  langIndicatorText: {
    fontSize: 9,
    fontWeight: '700',
  },
  standbyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  standbyLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
    marginBottom: Spacing.sm,
  },
  standbyLogoText: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  standbyTitle: {
    color: Colors.gold,
    fontSize: FontSize.lg,
    fontWeight: '900',
    letterSpacing: 3,
  },
  standbyTagline: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
  },
  standbyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.md,
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  standbyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.redBright,
  },
  standbyText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  flashTickerArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // LOWER 1/3 — Subtitles
  lowerThird: {
    backgroundColor: Colors.studioDark,
    borderTopWidth: 2,
    borderTopColor: Colors.gold + '40',
    maxHeight: LOWER,
  },
  subtitleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.studioDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
    gap: 6,
  },
  subtitleHeaderText: {
    flex: 1,
    color: Colors.gold + '80',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitleHeaderCount: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '600',
  },
  subtitleStandby: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  subtitleStandbyText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subtitlePreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  subtitlePreviewChip: {
    borderRadius: BorderRadius.round,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subtitlePreviewText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
