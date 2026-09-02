// Powered by OnSpace.AI
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import { AppKind } from '@/contexts/WindowContext';
import { useWindows } from '@/hooks/useWindows';

interface DockAppDef {
  app: AppKind;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const APPS: DockAppDef[] = [
  { app: 'files', label: 'Finder', icon: 'folder', color: '#7CC5FF' },
  { app: 'notes', label: 'Notes', icon: 'edit-note', color: '#FFB84D' },
  { app: 'ai', label: 'AI', icon: 'auto-awesome', color: '#C56BA3' },
  { app: 'browser', label: 'Web', icon: 'public', color: '#7CE7B2' },
];

interface DockProps {
  bottomInset: number;
}

export function Dock({ bottomInset }: DockProps) {
  const { openWindow, windows, focusWindow } = useWindows();

  const handlePress = (app: AppKind) => {
    const existing = windows.find((w) => w.app === app);
    if (existing) {
      focusWindow(existing.id);
    } else {
      openWindow(app);
    }
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottomInset, 12) }]}>
      <View style={styles.dock}>
        {APPS.map((a) => {
          const active = windows.some((w) => w.app === a.app);
          return (
            <Pressable
              key={a.app}
              onPress={() => handlePress(a.app)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.item,
                { transform: [{ scale: pressed ? 0.92 : 1 }] },
              ]}
            >
              <View style={[styles.iconTile, { backgroundColor: a.color }]}>
                <MaterialIcons name={a.icon} size={26} color="#1B1B24" />
              </View>
              <View style={[styles.pip, { opacity: active ? 1 : 0 }]} />
              <Text style={styles.label} numberOfLines={1}>
                {a.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.overlay.docBg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.glass.border,
    ...shadow.dock,
  },
  item: { alignItems: 'center', width: 60 },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  pip: {
    marginTop: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.primary,
  },
  label: {
    marginTop: 2,
    color: colors.text.primary,
    ...typography.caption,
    fontSize: 10,
  },
});
