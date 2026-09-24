import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { ActivityCard } from '@/components/ActivityCard';
import { colors, radius, spacing, typography } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import { listActivities } from '@/api/activities';
import { getGlobalBalance } from '@/api/balance';
import { Activity, GlobalBalance } from '@/api/types';
import { formatCurrency } from '@/utils/currency';
import { AppStackParamList } from '@/navigation/types';

export default function Summary() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [global, setGlobal] = useState<GlobalBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [acts, bal] = await Promise.all([
        listActivities(user.id),
        getGlobalBalance(user.id).catch(() => null),
      ]);
      setActivities(acts);
      setGlobal(bal);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <Loading />;

  return (
    <Screen style={{ paddingHorizontal: spacing.lg }}>
      <Text style={styles.title}>Resumo</Text>

      {global ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Você deve</Text>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>{formatCurrency(global.totalOwes)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Te devem</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{formatCurrency(global.totalOwed)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={[styles.summaryValue, { color: global.net >= 0 ? colors.success : colors.danger }]}>
              {formatCurrency(global.net)}
            </Text>
          </View>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Suas atividades</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => navigation.navigate('ActivityDetails', { activityId: item.id, name: item.name })}
          />
        )}
        ListEmptyComponent={<EmptyState title="Nenhuma atividade para resumir ainda" />}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.md },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.xs },
  summaryValue: { ...typography.bodyBold },
  divider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
});
