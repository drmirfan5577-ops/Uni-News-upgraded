// BreakingNewsBar — Animated breaking news banner
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { NewsItem } from '@/services/newsService';

interface BreakingNewsBarProps {
  news: NewsItem[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function BreakingNewsBar({ news }: BreakingNewsBarProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const currentIndex = useRef(0);

  useEffect(() => {
    if (news.length === 0) return;
    startScroll();
    startPulse();
  }, [news]);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const startScroll = () => {
    translateX.setValue(SCREEN_WIDTH);
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH * 2,
      duration: 18000,
      useNativeDriver: true,
    }).start(() => {
      currentIndex.current = (currentIndex.current + 1) % news.length;
      startScroll();
    });
  };

  if (news.length === 0) return null;

  const currentNews = news[currentIndex.current % news.length];
  const displayText = `⚡ ${currentNews.translations['en'] || currentNews.urduText}`;

  return (
    <View style={styles.container}>
      <View style={styles.breakingLabel}>
        <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
        <Text style={styles.breakingText}>BREAKING</Text>
      </View>
      <View style={styles.marqueeArea}>
        <Animated.Text
          style={[styles.newsText, { transform: [{ translateX }] }]}
          numberOfLines={1}
        >
          {displayText}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    backgroundColor: Colors.redDark,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: Colors.red,
    borderBottomWidth: 1,
    borderBottomColor: Colors.redBright,
  },
  breakingLabel: {
    backgroundColor: Colors.redBright,
    paddingHorizontal: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    minWidth: 88,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  breakingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  marqueeArea: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  newsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    position: 'absolute',
    paddingHorizontal: 8,
    letterSpacing: 0.3,
    whiteSpace: 'nowrap',
  } as any,
});
