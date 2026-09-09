// SubtitleTicker — Scrolling subtitle for a single language
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LANGUAGES } from '@/constants/config';
import { SubtitleSettings } from '@/services/newsService';

interface SubtitleTickerProps {
  langCode: string;
  text: string;
  settings: SubtitleSettings;
  customBg?: string;
  customTextColor?: string;
  speed?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function SubtitleTicker({ langCode, text, settings, customBg, customTextColor, speed }: SubtitleTickerProps) {
  const langConfig = LANGUAGES.find(l => l.code === langCode);
  const isRTL = langConfig?.isRTL ?? false;
  const translateX = useRef(new Animated.Value(isRTL ? -SCREEN_WIDTH : SCREEN_WIDTH)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const bgColor = customBg || settings.langColors[langCode] || langConfig?.bgColor || '#0A0E1A';
  const textColor = customTextColor || settings.langTextColors[langCode] || langConfig?.textColor || '#FFFFFF';
  const fontSize = settings.fontSize || 14;
  const tickerSpeed = speed || settings.speed || 60;

  useEffect(() => {
    startAnimation();
    return () => {
      animRef.current?.stop();
    };
  }, [text, tickerSpeed, isRTL]);

  const startAnimation = () => {
    animRef.current?.stop();
    const endValue = isRTL ? SCREEN_WIDTH + 400 : -SCREEN_WIDTH - 400;
    const startValue = isRTL ? -SCREEN_WIDTH - 400 : SCREEN_WIDTH + 400;
    translateX.setValue(startValue);

    const duration = (Math.abs(endValue - startValue) / tickerSpeed) * 1000;

    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: endValue,
          duration,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    );
    animRef.current.start();
  };

  const brightness = settings.brightness ?? 1;
  const brightStyle = brightness > 1 ? { textShadowColor: textColor, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 } : {};

  return (
    <View style={[styles.row, { backgroundColor: bgColor }]}>
      <View style={styles.langBadge}>
        <Text style={[styles.langLabel, { color: textColor }]}>
          {langConfig?.nativeName || langCode.toUpperCase()}
        </Text>
      </View>
      <View style={styles.tickerArea}>
        <Animated.Text
          style={[
            styles.tickerText,
            { color: textColor, fontSize, opacity: brightness > 1 ? 1 : brightness },
            isRTL ? { writingDirection: 'rtl' } : {},
            brightStyle,
          ]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.2)',
    overflow: 'hidden',
  },
  langBadge: {
    width: 52,
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,215,0,0.3)',
    height: '100%',
    justifyContent: 'center',
  },
  langLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tickerArea: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  tickerText: {
    fontWeight: '500',
    letterSpacing: 0.3,
    paddingHorizontal: 8,
    position: 'absolute',
    whiteSpace: 'nowrap',
  } as any,
});
