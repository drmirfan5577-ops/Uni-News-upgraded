// Admin Panel Screen — Password Protected
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';
import { AdminLogin } from '@/components/feature/AdminLogin';
import { NewsEditorPanel } from '@/components/feature/NewsEditorPanel';
import { SubtitleSettingsPanel } from '@/components/feature/SubtitleSettingsPanel';
import { MultiAdminPanel } from '@/components/feature/MultiAdminPanel';

type AdminTab = 'news' | 'subtitles' | 'admins';

const TABS: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'news', label: 'News', icon: 'create' },
  { key: 'subtitles', label: 'Subtitles', icon: 'subtitles' },
  { key: 'admins', label: 'Admins', icon: 'group' },
];

export default function AdminScreen() {
  const router = useRouter();
  const { isAuthenticated, currentAdmin, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('news');

  if (!isAuthenticated) {
    return (
      <View style={styles.loginWrapper}>
        <StatusBar style="light" />
        <SafeAreaView edges={['top']} style={styles.loginHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.loginHeaderTitle}>ADMIN ACCESS</Text>
          <View style={{ width: 36 }} />
        </SafeAreaView>
        <AdminLogin
          onSuccess={() => {}}
          onCancel={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.textSecondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.headerBadge}>
            <MaterialIcons name="admin-panel-settings" size={14} color={Colors.gold} />
            <Text style={styles.headerTitle}>ADMIN PANEL</Text>
          </View>
          <Text style={styles.headerSub} numberOfLines={1}>
            {currentAdmin?.isMain ? '🔑 Main Admin' : '👤 Sub-Admin'} — {currentAdmin?.name}
          </Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn} hitSlop={8}>
          <MaterialIcons name="logout" size={16} color={Colors.error} />
        </Pressable>
      </SafeAreaView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <MaterialIcons
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.key ? Colors.gold : Colors.textMuted}
            />
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Panel Content */}
      <View style={styles.panelArea}>
        {activeTab === 'news' && <NewsEditorPanel />}
        {activeTab === 'subtitles' && <SubtitleSettingsPanel />}
        {activeTab === 'admins' && <MultiAdminPanel />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioDark,
  },
  loginWrapper: {
    flex: 1,
    backgroundColor: Colors.studioDark,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.studioDeep,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginHeaderTitle: {
    flex: 1,
    color: Colors.gold,
    fontSize: FontSize.base,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.studioDeep,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '40',
    gap: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: FontSize.sm,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    borderRadius: BorderRadius.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.studioPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.gold,
    backgroundColor: Colors.gold + '08',
  },
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.gold,
    fontWeight: '800',
  },
  panelArea: {
    flex: 1,
  },
});
