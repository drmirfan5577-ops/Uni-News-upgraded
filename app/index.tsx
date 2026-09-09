// Splash / Disclaimer Entry — SMART WORLD NEWS
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DisclaimerModal } from '@/components/feature/DisclaimerModal';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const DISCLAIMER_ACCEPTED_KEY = 'swn_disclaimer_accepted';

export default function SplashScreen() {
  const router = useRouter();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.85)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    checkDisclaimer();
  }, []);

  const checkDisclaimer = async () => {
    try {
      const accepted = await AsyncStorage.getItem(DISCLAIMER_ACCEPTED_KEY);
      setIsInitializing(false);
      if (!accepted) {
        setTimeout(() => setShowDisclaimer(true), 1800);
      } else {
        setTimeout(() => router.replace('/(tabs)'), 2000);
      }
    } catch {
      setIsInitializing(false);
      setTimeout(() => setShowDisclaimer(true), 1800);
    }
  };

  const handleAccept = async () => {
    await AsyncStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true');
    setShowDisclaimer(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background gradient effect */}
      <View style={styles.bgGradient} />
      <View style={styles.bgRadial} />

      {/* Logo area */}
      <Animated.View style={[styles.logoArea, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Channel Logo */}
        <Animated.View style={[styles.logoRing, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.logoInner}>
            <Text style={styles.logoLetters}>SWN</Text>
          </View>
        </Animated.View>

        {/* Channel Name */}
        <View style={styles.titleArea}>
          <Text style={styles.channelName}>SMART WORLD</Text>
          <Text style={styles.channelName2}>NEWS</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>Truth through the Lens</Text>
            <View style={styles.taglineLine} />
          </View>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingArea}>
          <View style={styles.loadingBar}>
            <Animated.View style={[styles.loadingFill, { opacity: pulseAnim }]} />
          </View>
          <Text style={styles.loadingText}>
            {isInitializing ? 'Initializing broadcast system...' : 'Loading studio...'}
          </Text>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightArea}>
          <Text style={styles.copyrightText}>Dr M Irfan Qadir Thaheem</Text>
          <Text style={styles.copyrightText2}>SMART WORLD ORDER — One Man Army</Text>
        </View>
      </Animated.View>

      {/* Disclaimer Modal */}
      <DisclaimerModal visible={showDisclaimer} onAccept={handleAccept} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: Colors.studioDeep,
  },
  bgRadial: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.gold + '08',
    top: '50%',
    left: '50%',
    marginLeft: -150,
    marginTop: -150,
  },
  logoArea: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  logoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.redBright,
  },
  logoLetters: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
  },
  titleArea: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  channelName: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    lineHeight: 32,
    textShadowColor: Colors.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  channelName2: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 12,
    lineHeight: 40,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  taglineLine: {
    height: 1,
    width: 32,
    backgroundColor: Colors.gold + '60',
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  loadingArea: {
    alignItems: 'center',
    gap: Spacing.sm,
    width: 240,
  },
  loadingBar: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.studioBorder,
    borderRadius: 1,
    overflow: 'hidden',
  },
  loadingFill: {
    width: '70%',
    height: '100%',
    backgroundColor: Colors.gold,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },
  copyrightArea: {
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xl,
  },
  copyrightText: {
    color: Colors.gold,
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  copyrightText2: {
    color: Colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
