import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Activity } from '@/api/types';
import { colors, radius, spacing, typography } from '@/theme';
import { formatCurrency } from '@/utils/currency';

export function ActivityCard({ activity, onPress }: { activity: Activity; onPress: () => void }) {
  const hasAmount = typeof activity.totalAmount === 'number';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{activity.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{activity.name}</Text>
        {activity.description ? (
          <Text style={styles.description} numberOfLines={1}>{activity.description}</Text>
        ) : null}
        {typeof activity.participantsCount === 'number' ? (
          <Text style={styles.meta}>{activity.participantsCount} participante(s)</Text>
        ) : null}
      </View>
      {hasAmount ? (
        <Text style={styles.amount}>{formatCurrency(activity.totalAmount ?? 0)}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.8 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: { ...typography.h3, color: colors.white },
  name: { ...typography.bodyBold, color: colors.text },
  description: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  meta: { ...typography.small, color: colors.textMuted, marginTop: 4 },
  amount: { ...typography.bodyBold, color: colors.primaryLight, marginLeft: spacing.sm },
});
