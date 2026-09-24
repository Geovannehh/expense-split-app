import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Expense } from '@/api/types';
import { colors, radius, spacing, typography } from '@/theme';
import { formatCurrency, formatDate } from '@/utils/currency';

export function ExpenseCard({ expense, onPress }: { expense: Expense; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{expense.title}</Text>
        <Text style={styles.meta}>
          {expense.payer ? `Pago por ${expense.payer.name}` : 'Pagador não definido'}
          {expense.createdAt ? ` · ${formatDate(expense.createdAt)}` : ''}
        </Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
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
  title: { ...typography.bodyBold, color: colors.text },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  amount: { ...typography.bodyBold, color: colors.text, marginLeft: spacing.sm },
});
