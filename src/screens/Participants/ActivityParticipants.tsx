import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { ParticipantCard } from '@/components/ParticipantCard';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { listParticipants, addParticipants } from '@/api/participants';
import { Participant } from '@/api/types';
import { getErrorMessage } from '@/contexts/AuthContext';

type Route = { params: { activityId: string; activityName?: string } };

export default function ActivityParticipants() {
  const route = useRoute() as unknown as Route;
  const { activityId, activityName } = route.params;

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await listParticipants(activityId);
      setParticipants(data);
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleAdd() {
    if (!email.trim()) return;
    setAdding(true);
    try {
      await addParticipants(activityId, [email.trim()]);
      setEmail('');
      load();
    } catch (error) {
      Alert.alert('Não foi possível adicionar', getErrorMessage(error));
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Screen style={{ paddingHorizontal: spacing.lg }}>
      <Text style={styles.title}>{activityName ?? 'Participantes'}</Text>

      <View style={styles.addRow}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="E-mail do participante"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>
      <Button title="Adicionar participante" variant="secondary" onPress={handleAdd} loading={adding} style={{ marginBottom: spacing.md }} />

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ParticipantCard participant={item} />}
        ListEmptyComponent={<EmptyState title="Nenhum participante ainda" subtitle="Adicione pessoas para dividir despesas nessa atividade." />}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.text, marginVertical: spacing.md },
  addRow: { flexDirection: 'row', alignItems: 'flex-start' },
});
