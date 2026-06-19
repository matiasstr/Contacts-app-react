import { apiClient } from '../../../shared/http/api-client';
import type { Contact, ContactPayload } from '../state/contacts.signals';

function normalizeContact(raw: Record<string, any>): Contact {
  return {
    id: String(raw.id || raw._id),
    ownerId: raw.ownerId,
    firstName: raw.firstName || '',
    lastName: raw.lastName || '',
    email: raw.email || '',
    phone: raw.phone || '',
    company: raw.company || '',
    jobTitle: raw.jobTitle || '',
    notes: raw.notes || '',
    isFavorite: Boolean(raw.isFavorite),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function unwrapList(response: any): any[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.contacts)) return response.contacts;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export async function fetchContacts() {
  const response = await apiClient<unknown>('/contacts');
  return unwrapList(response).map(normalizeContact);
}

export async function fetchContact(id: string) {
  const response = await apiClient<Record<string, any>>(`/contacts/${id}`);
  return normalizeContact(response);
}

export async function createContact(payload: ContactPayload) {
  const response = await apiClient<Record<string, any>>('/contacts', {
    method: 'POST',
    body: payload,
  });
  return normalizeContact(response);
}

export async function updateContact(id: string, payload: ContactPayload) {
  const response = await apiClient<Record<string, any>>(`/contacts/${id}`, {
    method: 'PATCH',
    body: payload,
  });
  return normalizeContact(response);
}

export async function deleteContact(id: string) {
  await apiClient<unknown>(`/contacts/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleFavorite(id: string) {
  const response = await apiClient<Record<string, any>>(`/contacts/${id}/favorite`, {
    method: 'PATCH',
  });
  return normalizeContact(response);
}
