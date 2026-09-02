// Powered by OnSpace.AI
import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from './theme';

export const commonStyles = StyleSheet.create({
  fill: { flex: 1 },
  glassPanel: {
    backgroundColor: colors.glass.medium,
    borderColor: colors.glass.border,
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.glass.soft,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
});
