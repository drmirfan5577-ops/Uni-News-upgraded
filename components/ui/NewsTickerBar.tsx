// NewsTickerBar — Bottom ticker for regular/flash news
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { NewsItem } from '@/services/newsService';

interface NewsTickerBarProps {
  news: NewsItem[];
  type?: 'flash' | 'regular';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function NewsTickerBar({ news, type = 'regular' }: NewsTickerBarProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const indexRef = useRef(0);

  const bgColor = type === 'flash' ? '#1A3A6A' : Colors.studioPanel;
  const labelColor = type === 'flash' ? '#4AABFF' : Colors.gold;
  const labelText = type === 'flash' ? 'FLASH' : 'NEWS';

  useEffect(() => {
    if (news.length === 0) return;
    runTicker();
  }, [news]);

  const runTicker = () => {
    translateX.setValue(SCREEN_WIDTH);
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH * 2,
      duration: 20000,
      useNativeDriver: true,
    }).start(() => {
      indexRef.current = (indexRef.current + 1) % Math.max(1, news.length);
      runTicker();
    });
  };

  if (news.length === 0) return null;

  const item = news[indexRef.current % news.length];
  const text = item?.translations?.['en'] || item?.urduText || '';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.label, { borderRightColor: labelColor }]}>
        <Text style={[styles.labelText, { color: labelColor }]}>{labelText}</Text>
      </View>
      <View style={styles.area}>
        <Animated.Text
          style={[styles.text, { transform: [{ translateX }] }]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    paddingHorizontal: 8,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    minWidth: 56,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  area: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    position: 'absolute',
    paddingHorizontal: 8,
    whiteSpace: 'nowrap',
  } as any,
});
