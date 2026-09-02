// Powered by OnSpace.AI
import React, { useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, layout, radius, shadow, spacing, typography } from '@/constants/theme';
import { WindowInstance } from '@/contexts/WindowContext';
import { useWindows } from '@/hooks/useWindows';

interface WindowProps {
  win: WindowInstance;
  screenWidth: number;
  screenHeight: number;
  children: React.ReactNode;
}

export function Window({ win, screenWidth, screenHeight, children }: WindowProps) {
  const { moveWindow, closeWindow, focusWindow, toggleMinimize } = useWindows();
  const pan = useRef(new Animated.ValueXY({ x: win.x, y: win.y })).current;
  const start = useRef({ x: win.x, y: win.y });

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) + Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        focusWindow(win.id);
        start.current = { x: (pan.x as any)._value, y: (pan.y as any)._value };
      },
      onPanResponderMove: (_, g) => {
        const nx = Math.min(
          Math.max(start.current.x + g.dx, -win.width * 0.5),
          screenWidth - win.width * 0.3
        );
        const ny = Math.min(
          Math.max(start.current.y + g.dy, layout.menuBarHeight),
          screenHeight - 80
        );
        pan.setValue({ x: nx, y: ny });
      },
      onPanResponderRelease: () => {
        const nx = (pan.x as any)._value;
        const ny = (pan.y as any)._value;
        moveWindow(win.id, nx, ny);
      },
    })
  ).current;

  if (win.minimized) return null;

  return (
    <Animated.View
      style={[
        styles.win,
        {
          width: win.width,
          height: win.height,
          zIndex: win.z,
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <View style={styles.chrome} {...responder.panHandlers}>
        <View style={styles.lights}>
          <Pressable
            onPress={() => closeWindow(win.id)}
            style={[styles.dot, { backgroundColor: colors.traffic.close }]}
            hitSlop={10}
          />
          <Pressable
            onPress={() => toggleMinimize(win.id)}
            style={[styles.dot, { backgroundColor: colors.traffic.minimize }]}
            hitSlop={10}
          />
          <View style={[styles.dot, { backgroundColor: colors.traffic.maximize }]} />
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {win.title}
        </Text>
        <View style={styles.spacer} />
      </View>
      <Pressable
        onPress={() => focusWindow(win.id)}
        style={styles.body}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  win: {
    position: 'absolute',
    borderRadius: radius.lg,
    backgroundColor: colors.glass.strong,
    borderWidth: 1,
    borderColor: colors.glass.border,
    overflow: 'hidden',
    ...shadow.window,
  },
  chrome: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  lights: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.text.primary,
    ...typography.caption,
    fontWeight: '600',
  },
  spacer: { width: 46 },
  body: { flex: 1, padding: spacing.md },
});
