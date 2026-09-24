import { request } from './client';
import { ActivityBalance, GlobalBalance } from './types';

export function getActivityBalance(activityId: string) {
  return request<ActivityBalance>(`/activities/${activityId}/balance`);
}

export function getGlobalBalance(userId: string) {
  return request<GlobalBalance>(`/balance/users/${userId}/global`);
}

export function getDetailedBalance(userId: string) {
  return request(`/balance/users/${userId}/detailed`);
}

export function getBalanceBetween(userId1: string, userId2: string) {
  return request(`/balance/between/${userId1}/${userId2}`);
}
