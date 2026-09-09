// WeatherCurrencyBar — Top scrolling ticker for weather & currencies
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MOCK_WEATHER, MOCK_CURRENCIES } from '@/constants/config';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function WeatherCurrencyBar() {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const tickerContent = [
    ...MOCK_WEATHER.map(w => `🌡️ ${w.city}: ${w.temp} ${w.condition}`),
    '  |  ',
    ...MOCK_CURRENCIES.map(c => `💱 ${c.pair}: ${c.rate} (${c.change})`),
    '  |  ',
  ].join('  •  ');

  useEffect(() => {
    startAnimation();
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 6 * 60 * 60 * 1000); // 6 hours
    return () => clearInterval(interval);
  }, []);

  const startAnimation = () => {
    translateX.setValue(SCREEN_WIDTH);
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH * 4,
        duration: 45000,
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelBox}>
        <MaterialIcons name="public" size={10} color={Colors.studioDark} />
        <Text style={styles.labelText}>LIVE</Text>
      </View>
      <View style={styles.tickerArea}>
        <Animated.Text
          style={[styles.tickerText, { transform: [{ translateX }] }]}
          numberOfLines={1}
        >
          {tickerContent}
        </Animated.Text>
      </View>
      <Text style={styles.updateText}>
        Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    backgroundColor: Colors.goldDim,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  labelBox: {
    backgroundColor: Colors.redBright,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    height: '100%',
    gap: 2,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tickerArea: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  tickerText: {
    color: Colors.studioDark,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    position: 'absolute',
    paddingHorizontal: 8,
    whiteSpace: 'nowrap',
  } as any,
  updateText: {
    color: Colors.studioDark,
    fontSize: 8,
    paddingHorizontal: 4,
    opacity: 0.7,
  },
});
