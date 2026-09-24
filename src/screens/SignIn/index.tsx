import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useAuth, getErrorMessage } from '@/contexts/AuthContext';
import { AuthStackParamList } from '@/navigation/types';

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      Alert.alert('Não foi possível entrar', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>💜</Text>
        <Text style={styles.title}>Divisão de despesas</Text>
        <Text style={styles.subtitle}>Entre para continuar dividindo suas contas</Text>
      </View>

      <View>
        <Input
          label="E-mail"
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Senha"
          placeholder="Sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Entrar" onPress={handleSignIn} loading={loading} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem conta?</Text>
        <Button
          title="Criar conta"
          variant="ghost"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 40, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  footer: { alignItems: 'center', marginTop: spacing.lg },
  footerText: { ...typography.caption, color: colors.textSecondary },
});
