import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { ParticipantCard } from '@/components/ParticipantCard';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import { listActivities } from '@/api/activities';
import { listParticipants } from '@/api/participants';
import { Participant } from '@/api/types';

// Agrega os participantes de todas as atividades do usuário, removendo
// duplicados, já que a API não expõe um endpoint único para isso.
export default function AllParticipants() {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const activities = await listActivities(user.id);
      const lists = await Promise.all(
        activities.map((a) => listParticipants(a.id).catch(() => [] as Participant[]))
      );
      const map = new Map<string, Participant>();
      lists.flat().forEach((p) => {
        if (p.id !== user.id) map.set(p.id, p);
      });
      setParticipants(Array.from(map.values()));
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
      <Text style={styles.title}>Pessoas</Text>
      <Text style={styles.subtitle}>Quem já dividiu despesas com você</Text>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ParticipantCard participant={item} />}
        ListEmptyComponent={<EmptyState title="Você ainda não dividiu despesas com ninguém" />}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
