// Powered by OnSpace.AI
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, layout, spacing, typography } from '@/constants/theme';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);
  return now;
}

function fmtTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return hh + ':' + m + ' ' + ap;
}

function fmtDate(d: Date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate();
}

export function MenuBar() {
  const now = useClock();
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <MaterialIcons name="blur-on" size={16} color={colors.text.primary} />
        <Text style={styles.brand}>SandboxOS</Text>
        <Text style={styles.menu}>File</Text>
        <Text style={styles.menu}>Edit</Text>
        <Text style={styles.menu}>View</Text>
      </View>
      <View style={styles.right}>
        <MaterialIcons name="wifi" size={14} color={colors.text.primary} />
        <MaterialIcons name="battery-full" size={14} color={colors.text.primary} />
        <Text style={styles.clock}>{fmtDate(now)}  {fmtTime(now)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.menuBarHeight,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.overlay.menuBg,
    borderBottomWidth: Platform.select({ default: 1 }),
    borderBottomColor: colors.glass.borderSoft,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brand: {
    color: colors.text.primary,
    ...typography.caption,
    fontWeight: '700',
  },
  menu: {
    color: colors.text.secondary,
    ...typography.caption,
  },
  clock: {
    color: colors.text.primary,
    ...typography.caption,
  },
});
