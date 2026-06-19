import { signal } from '@preact/signals-react';

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  firebaseUid?: string;
};

export const authUserSignal = signal<AuthUser | null>(null);
export const authTokenSignal = signal<string | null>(null);
export const authLoadingSignal = signal(false);
export const authErrorSignal = signal<string | null>(null);

export function setAuthSession(user: AuthUser | null, token: string | null) {
  authUserSignal.value = user;
  authTokenSignal.value = token;
  authErrorSignal.value = null;
}

export function clearAuthSession() {
  setAuthSession(null, null);
}
