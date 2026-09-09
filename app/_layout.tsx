// Root Layout — SMART WORLD NEWS
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { NewsProvider } from '@/contexts/NewsContext';
import { AdminProvider } from '@/contexts/AdminContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AdminProvider>
          <NewsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="admin" options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
          </NewsProvider>
        </AdminProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
