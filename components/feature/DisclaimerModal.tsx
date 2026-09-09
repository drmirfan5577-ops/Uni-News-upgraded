// DisclaimerModal — Shown before broadcast starts
import React, { useState } from 'react';
import {
  Modal, View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { DISCLAIMER_TEXT, MANIFESTO_TEXT } from '@/constants/config';

interface DisclaimerModalProps {
  visible: boolean;
  onAccept: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function DisclaimerModal({ visible, onAccept }: DisclaimerModalProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 30;
    if (isBottom) setScrolledToBottom(true);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="warning" size={22} color={Colors.gold} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>IMPORTANT NOTICE</Text>
              <Text style={styles.headerSub}>Please read before continuing</Text>
            </View>
          </View>

          {/* Channel Branding */}
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>SMART WORLD NEWS</Text>
            <Text style={styles.brandTagline}>Truth through the Lens</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scroll}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ DISCLAIMER</Text>
              <Text style={styles.sectionText}>{DISCLAIMER_TEXT}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📢 OUR MANIFESTO</Text>
              <Text style={styles.sectionTitle2}>The Global Family Platform Vision</Text>
              <Text style={styles.sectionText}>{MANIFESTO_TEXT}</Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Scroll hint */}
          {!scrolledToBottom && (
            <View style={styles.scrollHint}>
              <MaterialIcons name="keyboard-arrow-down" size={14} color={Colors.textMuted} />
              <Text style={styles.scrollHintText}>Scroll down to continue</Text>
            </View>
          )}

          {/* Accept Button */}
          <Pressable
            style={({ pressed }) => [
              styles.acceptBtn,
              !scrolledToBottom && styles.acceptBtnDisabled,
              pressed && scrolledToBottom && { opacity: 0.85 },
            ]}
            onPress={scrolledToBottom ? onAccept : undefined}
          >
            <MaterialIcons name="check-circle" size={18} color={scrolledToBottom ? Colors.studioDark : Colors.textMuted} />
            <Text style={[styles.acceptText, !scrolledToBottom && styles.acceptTextDisabled]}>
              I Understand & Accept — Enter Broadcast
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold + '60',
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.85,
    overflow: 'hidden',
    ...Shadow.gold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.studioPanel,
    padding: Spacing.md,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: FontSize.md,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  brandRow: {
    backgroundColor: Colors.red + '20',
    borderBottomWidth: 1,
    borderBottomColor: Colors.red + '40',
    padding: Spacing.sm,
    alignItems: 'center',
  },
  brandName: {
    color: Colors.gold,
    fontSize: FontSize.lg,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandTagline: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  sectionTitle2: {
    color: Colors.goldSoft,
    fontSize: FontSize.sm,
    fontWeight: '700',
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
    marginTop: -4,
  },
  sectionText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.studioBorder,
    marginVertical: Spacing.md,
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
    backgroundColor: Colors.studioPanel,
  },
  scrollHintText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    padding: Spacing.md,
    gap: 8,
    margin: 0,
  },
  acceptBtnDisabled: {
    backgroundColor: Colors.studioBorder,
  },
  acceptText: {
    color: Colors.studioDark,
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  acceptTextDisabled: {
    color: Colors.textMuted,
  },
});
