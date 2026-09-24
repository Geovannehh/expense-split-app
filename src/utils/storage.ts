import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@expense-split:token';
const USER_KEY = '@expense-split:user';

export async function saveSession(token: string, user: unknown) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function loadSession() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const rawUser = await AsyncStorage.getItem(USER_KEY);
  return {
    token,
    user: rawUser ? JSON.parse(rawUser) : null,
  };
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
