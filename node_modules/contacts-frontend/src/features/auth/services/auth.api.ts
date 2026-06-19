import { apiClient } from '../../../shared/http/api-client';
import { authTokenSignal, clearAuthSession, setAuthSession, type AuthUser } from '../state/auth.signals';
import {
  loginWithFirebase,
  logoutFirebase,
  registerWithFirebase,
  shouldUseFirebaseAuth,
} from './firebase-auth.service';

type AuthResponse = {
  token?: string;
  accessToken?: string;
  user?: Record<string, any>;
} & Record<string, any>;

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = AuthCredentials & {
  displayName: string;
};

function normalizeUser(raw: Record<string, any> | null | undefined): AuthUser {
  const source = raw || {};

  return {
    id: String(source.id || source._id || source.firebaseUid || source.uid || source.email || 'current-user'),
    email: String(source.email || ''),
    displayName: source.displayName,
    photoUrl: source.photoUrl || source.photoURL,
    firebaseUid: source.firebaseUid || source.uid,
  };
}

function normalizeAuthResponse(response: AuthResponse, fallbackToken?: string) {
  const token = response.token || response.accessToken || fallbackToken || null;
  const user = normalizeUser(response.user || response);

  return { user, token };
}

async function syncFirebaseSession(profile: Awaited<ReturnType<typeof loginWithFirebase>>) {
  const response = await apiClient<AuthResponse>('/auth/firebase/session', {
    method: 'POST',
    body: {
      token: profile.token,
      firebaseUid: profile.firebaseUid,
      email: profile.email,
      displayName: profile.displayName,
      photoUrl: profile.photoUrl,
    },
  });

  return normalizeAuthResponse(response, profile.token);
}

export async function login(credentials: AuthCredentials) {
  if (shouldUseFirebaseAuth()) {
    const profile = await loginWithFirebase(credentials.email, credentials.password);
    return syncFirebaseSession(profile);
  }

  const response = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
  return normalizeAuthResponse(response);
}

export async function register(credentials: RegisterCredentials) {
  if (shouldUseFirebaseAuth()) {
    const profile = await registerWithFirebase(credentials.email, credentials.password, credentials.displayName);
    return syncFirebaseSession(profile);
  }

  const response = await apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: credentials,
  });
  return normalizeAuthResponse(response);
}

export async function loadCurrentUser() {
  const response = await apiClient<AuthResponse>('/auth/me');
  return normalizeUser(response.user || response);
}

export async function logout() {
  await logoutFirebase();
  clearAuthSession();
}

export function getAuthToken() {
  return authTokenSignal.value;
}

export function applyAuthSession(session: { user: AuthUser; token: string | null }) {
  setAuthSession(session.user, session.token);
}
