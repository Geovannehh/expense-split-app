export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type ActivitiesStackParamList = {
  ActivitiesList: undefined;
  CreateActivity: undefined;
  ActivityDetails: { activityId: string; name?: string };
  Expenses: { activityId: string; activityName?: string };
  CreateExpense: { activityId: string };
  EditExpense: { expenseId: string; activityId: string };
  ActivityParticipants: { activityId: string; activityName?: string };
};

export type AppStackParamList = ActivitiesStackParamList;

export type RootTabParamList = {
  AtividadesTab: undefined;
  ResumoTab: undefined;
  PessoasTab: undefined;
};
