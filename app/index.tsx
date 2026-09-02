// Powered by OnSpace.AI
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Desktop } from '@/components/layout/Desktop';

export default function SandboxScreen() {
  return (
    <View style={styles.root}>
      <Desktop />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
});
