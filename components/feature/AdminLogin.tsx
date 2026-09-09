// AdminLogin — Password-protected admin access screen
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Please enter password');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const success = await login(password);
      if (success) {
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`Invalid password. Attempt ${newAttempts}/5`);
        setPassword('');
        if (newAttempts >= 5) {
          setError('Too many failed attempts. Please try later.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerArea}>
          <View style={styles.shieldIcon}>
            <MaterialIcons name="admin-panel-settings" size={32} color={Colors.gold} />
          </View>
          <Text style={styles.title}>ADMIN ACCESS</Text>
          <Text style={styles.subtitle}>Smart World News Control Panel</Text>
          <Text style={styles.subtitle2}>Authorized Personnel Only</Text>
        </View>

        {/* Input */}
        <View style={styles.inputArea}>
          <Text style={styles.inputLabel}>Admin Password</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="lock" size={18} color={Colors.gold} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter secure password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleLogin}
              editable={attempts < 5}
            />
            <Pressable onPress={() => setShowPw(!showPw)} hitSlop={8}>
              <MaterialIcons
                name={showPw ? 'visibility-off' : 'visibility'}
                size={18}
                color={Colors.textMuted}
              />
            </Pressable>
          </View>

          {error ? (
            <View style={styles.errorRow}>
              <MaterialIcons name="error" size={12} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.loginBtn,
              (isLoading || attempts >= 5) && styles.loginBtnDisabled,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleLogin}
            disabled={isLoading || attempts >= 5}
          >
            {isLoading ? (
              <Text style={styles.loginText}>Verifying...</Text>
            ) : (
              <>
                <MaterialIcons name="security" size={16} color={Colors.studioDark} />
                <Text style={styles.loginText}>Access Panel</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNote}>
          <MaterialIcons name="info" size={11} color={Colors.textMuted} />
          <Text style={styles.securityText}>
            All access attempts are logged. Unauthorized access is prohibited.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.overlay90,
  },
  card: {
    backgroundColor: Colors.studioCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.gold + '50',
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    ...Shadow.gold,
  },
  headerArea: {
    backgroundColor: Colors.studioPanel,
    padding: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.studioBorder,
  },
  shieldIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.gold + '40',
  },
  title: {
    color: Colors.gold,
    fontSize: FontSize.xl,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  subtitle2: {
    color: Colors.red,
    fontSize: FontSize.xs,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  inputArea: {
    padding: Spacing.lg,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.studioPanel,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    paddingHorizontal: Spacing.sm,
    height: 48,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    includeFontPadding: false,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.studioBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  loginBtn: {
    flex: 2,
    height: 46,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gold,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginBtnDisabled: {
    backgroundColor: Colors.studioBorder,
  },
  loginText: {
    color: Colors.studioDark,
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.studioPanel,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  securityText: {
    color: Colors.textMuted,
    fontSize: 9,
    flex: 1,
    lineHeight: 14,
  },
});
