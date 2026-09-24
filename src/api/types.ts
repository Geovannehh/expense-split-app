export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Activity = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  participantsCount?: number;
  totalAmount?: number;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
};

export type ExpensePayer = {
  id: string;
  name: string;
} | null;

export type Expense = {
  id: string;
  activityId: string;
  title: string;
  description?: string | null;
  amount: number;
  createdAt?: string;
  payer?: ExpensePayer;
  participants?: Participant[];
};

export type ActivityBalance = {
  activityId: string;
  balances: {
    userId: string;
    name: string;
    amount: number; // positivo = a receber, negativo = a pagar
  }[];
};

export type GlobalBalance = {
  userId: string;
  totalOwed: number; // total que devem a ele
  totalOwes: number; // total que ele deve
  net: number;
};
