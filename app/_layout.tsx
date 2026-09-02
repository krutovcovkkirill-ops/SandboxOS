// Powered by OnSpace.AI
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { WindowProvider } from '@/contexts/WindowContext';
import { VFSProvider } from '@/contexts/VFSContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <VFSProvider>
          <WindowProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }} />
          </WindowProvider>
        </VFSProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
