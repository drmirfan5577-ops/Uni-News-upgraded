// MultiAdminPanel — Main admin manages sub-admins
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView, Switch, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';
import { AdminUser, AdminPermission } from '@/services/adminService';

const ALL_PERMISSIONS: AdminPermission[] = [
  'publish_news', 'delete_news', 'edit_news', 'manage_media', 'manage_settings', 'manage_music',
];

const PERMISSION_LABELS: Record<AdminPermission, string> = {
  publish_news: 'Publish News',
  delete_news: 'Delete News',
  edit_news: 'Edit News',
  manage_media: 'Manage Media',
  manage_settings: 'Settings',
  manage_music: 'Music Control',
};

export function MultiAdminPanel() {
  const { currentAdmin, admins, addAdmin, updateAdmin, removeAdmin } = useAdmin();
  const isMain = currentAdmin?.isMain ?? false;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPerms, setNewPerms] = useState<AdminPermission[]>(['edit_news', 'publish_news']);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const subAdmins = admins.filter(a => !a.isMain);

  const togglePerm = (perm: AdminPermission) => {
    setNewPerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleAddAdmin = async () => {
    if (!newName.trim() || !newPassword.trim()) {
      Alert.alert('Error', 'Name and password are required');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (subAdmins.length >= 10) {
      Alert.alert('Limit Reached', 'Maximum 10 sub-admins allowed');
      return;
    }
    try {
      await addAdmin({
        name: newName.trim(),
        password: newPassword.trim(),
        isMain: false,
        isEnabled: true,
        permissions: newPerms,
      });
      setNewName('');
      setNewPassword('');
      setNewPerms(['edit_news', 'publish_news']);
      setShowAddForm(false);
      Alert.alert('Success', `Admin "${newName}" added successfully.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to add admin');
    }
  };

  const handleToggleAdmin = async (admin: AdminUser) => {
    await updateAdmin(admin.id, { isEnabled: !admin.isEnabled });
  };

  const handleRemoveAdmin = (admin: AdminUser) => {
    Alert.alert(
      'Remove Admin',
      `Remove "${admin.name}"? They will lose all access immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeAdmin(admin.id) },
      ]
    );
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isMain) {
    return (
      <View style={styles.noAccess}>
        <MaterialIcons name="lock" size={32} color={Colors.textMuted} />
        <Text style={styles.noAccessText}>Only Main Admin can manage sub-admins</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Sub-Admin Management</Text>
          <Text style={styles.subtitle}>{subAdmins.length}/10 admins active</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <MaterialIcons name={showAddForm ? 'close' : 'person-add'} size={14} color={Colors.studioDark} />
          <Text style={styles.addBtnText}>{showAddForm ? 'Cancel' : 'Add Admin'}</Text>
        </Pressable>
      </View>

      {/* Add Form */}
      {showAddForm && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>NEW ADMIN ACCOUNT</Text>

          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter admin name..."
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.fieldLabel}>Password (min 8 chars)</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Create secure password..."
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
          />

          <Text style={styles.fieldLabel}>Permissions</Text>
          <View style={styles.permsGrid}>
            {ALL_PERMISSIONS.map(perm => (
              <Pressable
                key={perm}
                style={[styles.permChip, newPerms.includes(perm) && styles.permChipActive]}
                onPress={() => togglePerm(perm)}
              >
                <MaterialIcons
                  name={newPerms.includes(perm) ? 'check-box' : 'check-box-outline-blank'}
                  size={12}
                  color={newPerms.includes(perm) ? Colors.gold : Colors.textMuted}
                />
                <Text style={[styles.permLabel, newPerms.includes(perm) && { color: Colors.gold }]}>
                  {PERMISSION_LABELS[perm]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
            onPress={handleAddAdmin}
          >
            <MaterialIcons name="person-add" size={15} color={Colors.studioDark} />
            <Text style={styles.submitBtnText}>Create Admin Account</Text>
          </Pressable>
        </View>
      )}

      {/* Sub-Admin List */}
      {subAdmins.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="group" size={36} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No sub-admins yet</Text>
          <Text style={styles.emptySubText}>Add up to 10 sub-admins with custom permissions</Text>
        </View>
      ) : (
        subAdmins.map(admin => (
          <View key={admin.id} style={[styles.adminCard, !admin.isEnabled && styles.adminCardDisabled]}>
            <View style={styles.adminCardHeader}>
              <View style={styles.adminAvatar}>
                <MaterialIcons name="person" size={20} color={admin.isEnabled ? Colors.gold : Colors.textMuted} />
              </View>
              <View style={styles.adminInfo}>
                <Text style={styles.adminName}>{admin.name}</Text>
                <Text style={styles.adminId}>ID: {admin.id.split('_')[1] || admin.id}</Text>
              </View>
              <Switch
                value={admin.isEnabled}
                onValueChange={() => handleToggleAdmin(admin)}
                trackColor={{ false: Colors.studioBorder, true: Colors.gold + '60' }}
                thumbColor={admin.isEnabled ? Colors.gold : Colors.textMuted}
              />
            </View>

            {/* Password Reveal (Main Admin Only) */}
            <View style={styles.passwordRow}>
              <Text style={styles.passwordLabel}>Password:</Text>
              <Text style={styles.passwordValue}>
                {showPasswords[admin.id] ? admin.password : '••••••••'}
              </Text>
              <Pressable onPress={() => toggleShowPassword(admin.id)} hitSlop={8}>
                <MaterialIcons
                  name={showPasswords[admin.id] ? 'visibility-off' : 'visibility'}
                  size={14}
                  color={Colors.gold}
                />
              </Pressable>
            </View>

            {/* Permissions */}
            <View style={styles.permsRow}>
              {admin.permissions.map(p => (
                <View key={p} style={styles.permBadge}>
                  <Text style={styles.permBadgeText}>{PERMISSION_LABELS[p]}</Text>
                </View>
              ))}
            </View>

            {/* Admin's last login */}
            {admin.lastLogin && (
              <Text style={styles.lastLogin}>
                Last login: {new Date(admin.lastLogin).toLocaleString()}
              </Text>
            )}

            {/* Remove Button */}
            <Pressable
              style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.7 }]}
              onPress={() => handleRemoveAdmin(admin)}
            >
              <MaterialIcons name="person-remove" size={12} color={Colors.error} />
              <Text style={styles.removeBtnText}>Remove Admin</Text>
            </Pressable>
          </View>
        ))
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.studioCard,
    padding: Spacing.md,
  },
  noAccess: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: Spacing.xxl,
  },
  noAccessText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  addBtnText: {
    color: Colors.studioDark,
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  addForm: {
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  formTitle: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    includeFontPadding: false,
  },
  permsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  permChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    backgroundColor: Colors.studioCard,
  },
  permChipActive: {
    borderColor: Colors.gold + '60',
    backgroundColor: Colors.gold + '10',
  },
  permLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.md,
    paddingVertical: 11,
    marginTop: Spacing.sm,
  },
  submitBtnText: {
    color: Colors.studioDark,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: 8,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  adminCard: {
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: 8,
  },
  adminCardDisabled: {
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  adminCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.studioCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.studioBorder,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  adminId: {
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.sm,
    padding: 6,
  },
  passwordLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  passwordValue: {
    flex: 1,
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  permsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  permBadge: {
    backgroundColor: Colors.gold + '15',
    borderRadius: BorderRadius.round,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  permBadgeText: {
    color: Colors.gold,
    fontSize: 8,
    fontWeight: '700',
  },
  lastLogin: {
    color: Colors.textMuted,
    fontSize: 9,
    fontStyle: 'italic',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.error + '15',
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  removeBtnText: {
    color: Colors.error,
    fontSize: 10,
    fontWeight: '700',
  },
});
