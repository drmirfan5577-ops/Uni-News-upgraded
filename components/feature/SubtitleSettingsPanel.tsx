// SubtitleSettingsPanel — Language & subtitle customization
import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useNews } from '@/hooks/useNews';
import { LANGUAGES } from '@/constants/config';
import { SubtitleSettings } from '@/services/newsService';

export function SubtitleSettingsPanel() {
  const { subtitleSettings, updateSubtitleSettings } = useNews();
  const [localSettings, setLocalSettings] = useState<SubtitleSettings>({ ...subtitleSettings });
  const [isSaving, setIsSaving] = useState(false);

  const update = (key: keyof SubtitleSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleLang = (code: string) => {
    const current = localSettings.enabledLangs;
    const updated = current.includes(code) ? current.filter(c => c !== code) : [...current, code];
    update('enabledLangs', updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSubtitleSettings(localSettings);
    } finally {
      setIsSaving(false);
    }
  };

  const SliderRow = ({ label, value, min, max, step, onChange }: any) => (
    <View style={styles.sliderRow}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderControls}>
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <MaterialIcons name="remove" size={14} color={Colors.gold} />
        </Pressable>
        <Text style={styles.sliderValue}>{value}</Text>
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <MaterialIcons name="add" size={14} color={Colors.gold} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Typography */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUBTITLE DISPLAY</Text>

        <SliderRow
          label="Font Size"
          value={localSettings.fontSize}
          min={10}
          max={22}
          step={1}
          onChange={(v: number) => update('fontSize', v)}
        />

        <SliderRow
          label="Scroll Speed"
          value={localSettings.speed}
          min={20}
          max={150}
          step={10}
          onChange={(v: number) => update('speed', v)}
        />

        <SliderRow
          label="Brightness"
          value={Math.round(localSettings.brightness * 10) / 10}
          min={0.5}
          max={2}
          step={0.1}
          onChange={(v: number) => update('brightness', Math.round(v * 10) / 10)}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Show Background</Text>
          <Switch
            value={localSettings.showBackground}
            onValueChange={v => update('showBackground', v)}
            trackColor={{ false: Colors.studioBorder, true: Colors.gold + '60' }}
            thumbColor={localSettings.showBackground ? Colors.gold : Colors.textMuted}
          />
        </View>
      </View>

      {/* Language Toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACTIVE LANGUAGES</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map(lang => {
            const isEnabled = localSettings.enabledLangs.includes(lang.code);
            return (
              <Pressable
                key={lang.code}
                style={[styles.langChip, isEnabled && { backgroundColor: lang.bgColor, borderColor: lang.textColor + '60' }]}
                onPress={() => toggleLang(lang.code)}
              >
                <View style={[styles.langDot, { backgroundColor: isEnabled ? lang.textColor : Colors.studioBorder }]} />
                <Text style={[styles.langChipText, isEnabled && { color: lang.textColor }]}>
                  {lang.nativeName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Layout Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LAYOUT ZONES</Text>
        <View style={styles.layoutPreview}>
          <View style={[styles.zone, { height: 40, borderColor: Colors.blue }]}>
            <Text style={styles.zoneLabel}>Upper 1/3 — Main Content</Text>
          </View>
          <View style={[styles.zone, { height: 40, borderColor: Colors.gold + '60' }]}>
            <Text style={styles.zoneLabel}>Middle 1/3 — News Display</Text>
          </View>
          <View style={[styles.zone, { height: 40, borderColor: Colors.redBright + '60', backgroundColor: Colors.red + '10' }]}>
            <Text style={[styles.zoneLabel, { color: Colors.redBright }]}>Lower 1/3 — Subtitles Only</Text>
          </View>
        </View>
      </View>

      {/* Save */}
      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <MaterialIcons name="save" size={16} color={Colors.studioDark} />
        <Text style={styles.saveBtnText}>
          {isSaving ? 'Saving...' : 'Save Subtitle Settings'}
        </Text>
      </Pressable>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const Colors2 = { blue: '#3B82F6' };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioCard,
  },
  section: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sliderLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    backgroundColor: Colors.studioPanel,
  },
  langDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  langChipText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  layoutPreview: {
    gap: 4,
    backgroundColor: Colors.studioDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    overflow: 'hidden',
  },
  zone: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    borderStyle: 'dashed',
  },
  zoneLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.gold,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
  },
  saveBtnText: {
    color: Colors.studioDark,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
});
