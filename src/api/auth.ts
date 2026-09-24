import { request } from './client';
import { AuthResponse, User } from './types';

export function signUp(params: { name: string; email: string; password: string }) {
  return request<AuthResponse>('/users/sign-up', {
    method: 'POST',
    body: params,
    auth: false,
  });
}

export function signIn(params: { email: string; password: string }) {
  return request<AuthResponse>('/users/sign-in', {
    method: 'POST',
    body: params,
    auth: false,
  });
}

export function getMe() {
  return request<User>('/users/me');
}
