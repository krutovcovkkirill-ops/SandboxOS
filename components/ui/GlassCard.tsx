// Powered by OnSpace.AI
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: 'soft' | 'medium' | 'strong';
  radiusSize?: number;
}

export function GlassCard({ children, style, intensity = 'medium', radiusSize = radius.lg }: GlassCardProps) {
  const bg =
    intensity === 'strong'
      ? colors.glass.strong
      : intensity === 'soft'
      ? colors.glass.soft
      : colors.glass.medium;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bg, borderRadius: radiusSize },
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.glass.border,
    overflow: 'hidden',
  },
});
