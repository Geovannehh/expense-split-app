import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useAuth, getErrorMessage } from '@/contexts/AuthContext';

export default function SignUp() {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (error) {
      Alert.alert('Não foi possível criar a conta', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Comece a dividir suas despesas com amigos</Text>
        </View>

        <Input label="Nome" placeholder="Seu nome" value={name} onChangeText={setName} />
        <Input
          label="E-mail"
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input label="Senha" placeholder="Mínimo de 6 caracteres" secureTextEntry value={password} onChangeText={setPassword} />

        <Button title="Criar conta" onPress={handleSignUp} loading={loading} />
        <Button title="Já tenho conta" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
