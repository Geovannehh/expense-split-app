import { request } from './client';
import { Participant } from './types';

export function listParticipants(activityId: string) {
  return request<Participant[]>(`/activities/${activityId}/participants`);
}

export function addParticipants(activityId: string, emails: string[]) {
  return request<Participant[]>(`/activities/${activityId}/participants`, {
    method: 'POST',
    body: { emails },
  });
}

export function removeParticipant(activityId: string, userId: string) {
  return request<void>(`/activities/${activityId}/participants/${userId}`, {
    method: 'DELETE',
  });
}
