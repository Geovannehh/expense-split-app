import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, radius, spacing, typography } from '@/theme';
import { createExpense } from '@/api/expenses';
import { listParticipants } from '@/api/participants';
import { Participant } from '@/api/types';
import { getErrorMessage } from '@/contexts/AuthContext';

type Route = { params: { activityId: string } };

export default function CreateExpense() {
  const navigation = useNavigation();
  const route = useRoute() as unknown as Route;
  const { activityId } = route.params;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadParticipants = useCallback(async () => {
    try {
      const data = await listParticipants(activityId);
      setParticipants(data);
      setSelected(new Set(data.map((p) => p.id)));
    } catch {
      // segue sem a lista pré-selecionada
    }
  }, [activityId]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreate() {
    const parsedAmount = Number(amount.replace(',', '.'));
    if (!title.trim()) {
      Alert.alert('Atenção', 'Informe um título para a despesa.');
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }
    setLoading(true);
    try {
      await createExpense(activityId, {
        title: title.trim(),
        amount: parsedAmount,
        description: description.trim() || undefined,
        participantIds: Array.from(selected),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Não foi possível criar', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nova despesa</Text>

        <Input label="Título" placeholder="Ex: Jantar" value={title} onChangeText={setTitle} />
        <Input
          label="Valor (R$)"
          placeholder="0,00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Input
          label="Descrição (opcional)"
          placeholder="Detalhes da despesa"
          value={description}
          onChangeText={setDescription}
        />

        {participants.length > 0 ? (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={styles.label}>Dividir com</Text>
            {participants.map((p) => {
              const active = selected.has(p.id);
              return (
                <Pressable key={p.id} onPress={() => toggle(p.id)} style={[styles.participantRow, active && styles.participantRowActive]}>
                  <Text style={[styles.participantName, active && styles.participantNameActive]}>{p.name}</Text>
                  <View style={[styles.checkbox, active && styles.checkboxActive]}>
                    {active ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Button title="Salvar despesa" onPress={handleCreate} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  participantRowActive: { borderColor: colors.primary },
  participantName: { ...typography.body, color: colors.textSecondary },
  participantNameActive: { color: colors.text },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: colors.white, fontSize: 13, fontWeight: '700' },
});
