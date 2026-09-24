import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { getExpense, updateExpense, deleteExpense } from '@/api/expenses';
import { Expense } from '@/api/types';
import { getErrorMessage } from '@/contexts/AuthContext';

type Route = { params: { expenseId: string; activityId: string } };

export default function EditExpense() {
  const navigation = useNavigation();
  const route = useRoute() as unknown as Route;
  const { expenseId } = route.params;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getExpense(expenseId);
      setExpense(data);
      setTitle(data.title);
      setAmount(String(data.amount));
      setDescription(data.description ?? '');
    } finally {
      setLoading(false);
    }
  }, [expenseId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleSave() {
    const parsedAmount = Number(amount.replace(',', '.'));
    if (!title.trim() || !parsedAmount || parsedAmount <= 0) {
      Alert.alert('Atenção', 'Preencha título e valor corretamente.');
      return;
    }
    setSaving(true);
    try {
      await updateExpense(expenseId, {
        title: title.trim(),
        amount: parsedAmount,
        description: description.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Não foi possível salvar', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert('Excluir despesa', 'Essa ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(expenseId);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Não foi possível excluir', getErrorMessage(error));
          }
        },
      },
    ]);
  }

  if (loading || !expense) return <Loading />;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Editar despesa</Text>

        <Input label="Título" value={title} onChangeText={setTitle} />
        <Input label="Valor (R$)" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
        <Input label="Descrição (opcional)" value={description} onChangeText={setDescription} />

        <Button title="Salvar alterações" onPress={handleSave} loading={saving} style={{ marginBottom: spacing.sm }} />
        <Button title="Excluir despesa" variant="danger" onPress={confirmDelete} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.lg },
});
