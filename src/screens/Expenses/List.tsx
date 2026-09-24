import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { ExpenseCard } from '@/components/ExpenseCard';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { listExpenses } from '@/api/expenses';
import { Expense } from '@/api/types';
import { formatCurrency } from '@/utils/currency';
import { AppStackParamList } from '@/navigation/types';

type Route = { params: { activityId: string; activityName?: string } };

export default function ExpensesList() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute() as unknown as Route;
  const { activityId, activityName } = route.params;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await listExpenses(activityId);
      setExpenses(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activityId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <Loading />;

  return (
    <Screen style={{ paddingHorizontal: spacing.lg }}>
      <View style={styles.header}>
        <Text style={styles.title}>{activityName ?? 'Despesas'}</Text>
        <Text style={styles.total}>Total: {formatCurrency(total)}</Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => navigation.navigate('EditExpense', { expenseId: item.id, activityId })}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          load();
        }}
        ListEmptyComponent={<EmptyState title="Nenhuma despesa cadastrada" subtitle="Adicione a primeira despesa dessa atividade." />}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xl }}
      />

      <Button
        title="+ Nova despesa"
        onPress={() => navigation.navigate('CreateExpense', { activityId })}
        style={{ marginBottom: spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginVertical: spacing.md },
  title: { ...typography.h2, color: colors.text },
  total: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
