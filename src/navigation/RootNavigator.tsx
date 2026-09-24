import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/Loading';

import SignIn from '@/screens/SignIn';
import SignUp from '@/screens/SignUp';
import Summary from '@/screens/Summary';
import AllParticipants from '@/screens/Participants/AllParticipants';
import { ActivitiesStack } from './ActivitiesStack';
import { AuthStackParamList, RootTabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
}

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="AtividadesTab"
        component={ActivitiesStack}
        options={{ title: 'Atividades', tabBarIcon: () => <TabIcon emoji="📋" /> }}
      />
      <Tab.Screen
        name="ResumoTab"
        component={Summary}
        options={{ title: 'Resumo', tabBarIcon: () => <TabIcon emoji="💰" /> }}
      />
      <Tab.Screen
        name="PessoasTab"
        component={AllParticipants}
        options={{ title: 'Pessoas', tabBarIcon: () => <TabIcon emoji="👥" /> }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return isAuthenticated ? <AppTabs /> : <AuthNavigator />;
}
