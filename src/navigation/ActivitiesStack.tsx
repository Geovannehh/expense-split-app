import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import { ActivitiesStackParamList } from './types';

import ActivitiesList from '@/screens/Activities/List';
import CreateActivity from '@/screens/Activities/Create';
import ActivityDetails from '@/screens/Activities/Details';
import ExpensesList from '@/screens/Expenses/List';
import CreateExpense from '@/screens/Expenses/Create';
import EditExpense from '@/screens/Expenses/Edit';
import ActivityParticipants from '@/screens/Participants/ActivityParticipants';

const Stack = createNativeStackNavigator<ActivitiesStackParamList>();

export function ActivitiesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ActivitiesList" component={ActivitiesList} options={{ headerShown: false }} />
      <Stack.Screen name="CreateActivity" component={CreateActivity} options={{ title: 'Nova atividade' }} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetails} options={{ title: 'Atividade' }} />
      <Stack.Screen name="Expenses" component={ExpensesList} options={{ title: 'Despesas' }} />
      <Stack.Screen name="CreateExpense" component={CreateExpense} options={{ title: 'Nova despesa' }} />
      <Stack.Screen name="EditExpense" component={EditExpense} options={{ title: 'Editar despesa' }} />
      <Stack.Screen name="ActivityParticipants" component={ActivityParticipants} options={{ title: 'Participantes' }} />
    </Stack.Navigator>
  );
}
