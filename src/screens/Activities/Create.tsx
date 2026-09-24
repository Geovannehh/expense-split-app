import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { createActivity } from '@/api/activities';
import { getErrorMessage } from '@/contexts/AuthContext';

export default function CreateActivity() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe um nome para a atividade.');
      return;
    }
    setLoading(true);
    try {
      await createActivity({ name: name.trim(), description: description.trim() || undefined });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Não foi possível criar', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Nova atividade</Text>
      <Text style={styles.subtitle}>Dê um nome para a viagem, evento ou grupo de despesas.</Text>

      <View style={{ marginTop: spacing.lg }}>
        <Input label="Nome" placeholder="Ex: Viagem à praia" value={name} onChangeText={setName} />
        <Input
          label="Descrição (opcional)"
          placeholder="Ex: Fim de semana em Itaúnas"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <Button title="Criar atividade" onPress={handleCreate} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
