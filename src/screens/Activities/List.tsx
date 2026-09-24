import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { ActivityCard } from '@/components/ActivityCard';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import { listActivities } from '@/api/activities';
import { Activity } from '@/api/types';
import { AppStackParamList } from '@/navigation/types';

export default function ActivitiesList() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await listActivities(user.id);
      setActivities(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.title}>Suas atividades</Text>
        </View>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => navigation.navigate('ActivityDetails', { activityId: item.id, name: item.name })}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          load();
        }}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma atividade ainda"
            subtitle="Crie a primeira atividade para começar a dividir despesas com seus amigos."
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xl }}
      />

      <Button title="+ Nova atividade" onPress={() => navigation.navigate('CreateActivity')} style={styles.fab} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing.md },
  greeting: { ...typography.caption, color: colors.textSecondary },
  title: { ...typography.h2, color: colors.text, marginTop: 2 },
  fab: { marginBottom: spacing.md },
});
