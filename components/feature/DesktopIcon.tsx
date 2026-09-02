// Powered by OnSpace.AI
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { AppKind } from '@/contexts/WindowContext';
import { useWindows } from '@/hooks/useWindows';

interface DesktopIconProps {
  app: AppKind;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export function DesktopIcon({ app, label, icon, color }: DesktopIconProps) {
  const { openWindow, windows, focusWindow } = useWindows();
  const onPress = () => {
    const existing = windows.find((w) => w.app === app);
    if (existing) focusWindow(existing.id);
    else openWindow(app);
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.75 : 1 }]}
      hitSlop={6}
    >
      <View style={[styles.tile, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={28} color="#1B1B24" />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 78, marginBottom: spacing.lg },
  tile: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  label: {
    marginTop: 6,
    color: colors.text.primary,
    ...typography.caption,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
