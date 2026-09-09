// Settings Screen — Viewer accessible settings
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';
import { APP_CONFIG } from '@/constants/config';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentAdmin, isAuthenticated, logout } = useAdmin();

  const SettingRow = ({ icon, label, value, onPress, danger }: any) => (
    <Pressable
      style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <MaterialIcons name={icon} size={18} color={danger ? Colors.error : Colors.gold} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, danger && { color: Colors.error }]}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={18} color={Colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SETTINGS</Text>
          <Text style={styles.headerSub}>Smart World News</Text>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Admin Status */}
        <View style={styles.adminCard}>
          <View style={styles.adminCardLeft}>
            <View style={[styles.adminAvatar, isAuthenticated && styles.adminAvatarActive]}>
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color={isAuthenticated ? Colors.gold : Colors.textMuted}
              />
            </View>
            <View>
              <Text style={styles.adminName}>
                {isAuthenticated ? currentAdmin?.name || 'Admin' : 'Viewer Mode'}
              </Text>
              <Text style={styles.adminRole}>
                {isAuthenticated
                  ? currentAdmin?.isMain ? '🔑 Main Admin' : '👤 Sub-Admin'
                  : 'Not signed in'}
              </Text>
            </View>
          </View>
          {isAuthenticated ? (
            <Pressable
              style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
              onPress={logout}
            >
              <Text style={styles.logoutBtnText}>Logout</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.push('/admin')}
            >
              <MaterialIcons name="lock-open" size={14} color={Colors.studioDark} />
              <Text style={styles.loginBtnText}>Admin Login</Text>
            </Pressable>
          )}
        </View>

        {/* Admin Panel Access */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADMIN CONTROLS</Text>
            <SettingRow
              icon="dashboard"
              label="Admin Panel"
              value="Manage news, subtitles & admins"
              onPress={() => router.push('/admin')}
            />
          </View>
        )}

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <SettingRow
            icon="info"
            label="App Version"
            value={APP_CONFIG.version}
            onPress={() => {}}
          />
          <SettingRow
            icon="copyright"
            label="Copyright"
            value={APP_CONFIG.copyright}
            onPress={() => {}}
          />
          <SettingRow
            icon="person"
            label="Creator"
            value="Dr M Irfan Qadir Thaheem"
            onPress={() => {}}
          />
          <SettingRow
            icon="verified"
            label="Channel"
            value="SMART WORLD ORDER — One Man Army"
            onPress={() => {}}
          />
        </View>

        {/* Vision */}
        <View style={styles.visionCard}>
          <Text style={styles.visionTitle}>THE GLOBAL FAMILY PLATFORM VISION</Text>
          <Text style={styles.visionText}>
            Through multi-language subtitles, our aim is to provide comprehensive public information,
            keep audiences informed of constantly evolving situations and events, and offer genuine
            insight into the underlying realities often inaccessible to the general public.
          </Text>
          <Text style={styles.visionQuote}>
            "Comprehensive solutions, concise news, yet authentic and impactful."
          </Text>
        </View>

        {/* Languages info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BROADCAST LANGUAGES</Text>
          <View style={styles.langGrid}>
            {require('@/constants/config').LANGUAGES.map((lang: any) => (
              <View key={lang.code} style={[styles.langBadge, { backgroundColor: lang.bgColor }]}>
                <Text style={[styles.langBadgeText, { color: lang.textColor }]}>
                  {lang.nativeName}
                </Text>
                <Text style={[styles.langDir, { color: lang.textColor + '80' }]}>
                  {lang.isRTL ? '←→' : '→←'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioDark,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.studioDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '30',
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
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  adminCard: {
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.gold,
  },
  adminCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  adminAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.studioPanel,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.studioBorder,
  },
  adminAvatarActive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '15',
  },
  adminName: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  adminRole: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: Colors.error + '20',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error + '50',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutBtnText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loginBtnText: {
    color: Colors.studioDark,
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  section: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
    paddingLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    padding: Spacing.sm,
    marginBottom: 2,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIconDanger: {
    backgroundColor: Colors.error + '15',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  settingValue: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    lineHeight: 15,
  },
  visionCard: {
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  visionTitle: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  visionText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    lineHeight: 20,
  },
  visionQuote: {
    color: Colors.goldSoft,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
    paddingLeft: Spacing.sm,
    lineHeight: 20,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  langDir: {
    fontSize: 8,
    fontWeight: '600',
  },
});
