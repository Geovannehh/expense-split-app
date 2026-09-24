import { request } from './client';
import { Expense } from './types';

export function listExpenses(activityId: string) {
  return request<Expense[]>(`/activities/${activityId}/expenses`);
}

export function getExpense(expenseId: string) {
  return request<Expense>(`/expenses/${expenseId}`);
}

export function createExpense(
  activityId: string,
  params: { title: string; amount: number; description?: string; participantIds?: string[] }
) {
  return request<Expense>(`/activities/${activityId}/expenses`, {
    method: 'POST',
    body: params,
  });
}

export function updateExpense(
  expenseId: string,
  params: { title?: string; amount?: number; description?: string }
) {
  return request<Expense>(`/expenses/${expenseId}`, {
    method: 'PUT',
    body: params,
  });
}

export function setExpensePayer(expenseId: string, payerId: string) {
  return request<Expense>(`/expenses/${expenseId}/payer`, {
    method: 'PUT',
    body: { payerId },
  });
}

export function markPayment(expenseId: string, params: { userId: string }) {
  return request(`/expenses/${expenseId}/payments`, {
    method: 'POST',
    body: params,
  });
}

export function deleteExpense(expenseId: string) {
  return request<void>(`/expenses/${expenseId}`, { method: 'DELETE' });
}
