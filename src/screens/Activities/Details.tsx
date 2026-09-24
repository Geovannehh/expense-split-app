import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, radius, spacing, typography } from '@/theme';
import { getActivity, updateActivity, deleteActivity } from '@/api/activities';
import { getActivityBalance } from '@/api/balance';
import { Activity, ActivityBalance } from '@/api/types';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/contexts/AuthContext';
import { AppStackParamList } from '@/navigation/types';

type Route = { params: { activityId: string; name?: string } };

export default function ActivityDetails() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute() as unknown as Route;
  const { activityId } = route.params;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [balance, setBalance] = useState<ActivityBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getActivity(activityId);
      setActivity(data);
      setName(data.name);
      setDescription(data.description ?? '');
      try {
        const b = await getActivityBalance(activityId);
        setBalance(b);
      } catch {
        setBalance(null);
      }
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateActivity(activityId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setActivity(updated);
      setEditing(false);
    } catch (error) {
      Alert.alert('Não foi possível salvar', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert('Excluir atividade', 'Essa ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteActivity(activityId);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Não foi possível excluir', getErrorMessage(error));
          }
        },
      },
    ]);
  }

  if (loading || !activity) return <Loading />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      {editing ? (
        <View>
          <Input label="Nome" value={name} onChangeText={setName} />
          <Input label="Descrição" value={description} onChangeText={setDescription} />
          <View style={styles.row}>
            <Button title="Cancelar" variant="secondary" onPress={() => setEditing(false)} style={{ flex: 1, marginRight: spacing.sm }} />
            <Button title="Salvar" onPress={handleSave} loading={saving} style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>{activity.name}</Text>
          {activity.description ? <Text style={styles.description}>{activity.description}</Text> : null}
          <Button title="Editar informações" variant="secondary" onPress={() => setEditing(true)} style={{ marginTop: spacing.md }} />
        </View>
      )}

      {balance && balance.balances?.length > 0 ? (
        <View style={styles.balanceCard}>
          <Text style={styles.sectionTitle}>Saldo da atividade</Text>
          {balance.balances.map((b) => (
            <View key={b.userId} style={styles.balanceRow}>
              <Text style={styles.balanceName}>{b.name}</Text>
              <Text style={[styles.balanceAmount, { color: b.amount >= 0 ? colors.success : colors.danger }]}>
                {b.amount >= 0 ? '+ ' : '- '}
                {formatCurrency(Math.abs(b.amount))}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Ver despesas"
          onPress={() => navigation.navigate('Expenses', { activityId, activityName: activity.name })}
          style={{ marginBottom: spacing.sm }}
        />
        <Button
          title="Ver participantes"
          variant="secondary"
          onPress={() => navigation.navigate('ActivityParticipants', { activityId, activityName: activity.name })}
          style={{ marginBottom: spacing.sm }}
        />
        <Button title="Excluir atividade" variant="danger" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { ...typography.h1, color: colors.text },
  description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  row: { flexDirection: 'row', marginTop: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  balanceName: { ...typography.body, color: colors.text },
  balanceAmount: { ...typography.bodyBold },
  actions: { marginTop: spacing.xl },
});
