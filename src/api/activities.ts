import { request } from './client';
import { Activity } from './types';

export function listActivities(userId: string) {
  return request<Activity[]>(`/users/${userId}/activities`);
}

export function getActivity(activityId: string) {
  return request<Activity>(`/activities/${activityId}`);
}

export function createActivity(params: { name: string; description?: string }) {
  return request<Activity>('/activities', {
    method: 'POST',
    body: params,
  });
}

export function updateActivity(
  activityId: string,
  params: { name?: string; description?: string }
) {
  return request<Activity>(`/activities/${activityId}`, {
    method: 'PUT',
    body: params,
  });
}

export function deleteActivity(activityId: string) {
  return request<void>(`/activities/${activityId}`, { method: 'DELETE' });
}
