import { computed, signal } from '@preact/signals-react';

export type Contact = {
  id: string;
  ownerId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactPayload = Omit<Contact, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

export const contactsSignal = signal<Contact[]>([]);
export const selectedContactSignal = signal<Contact | null>(null);
export const contactsSearchSignal = signal('');
export const contactsLoadingSignal = signal(false);
export const contactsErrorSignal = signal<string | null>(null);

export const filteredContactsSignal = computed(() => {
  const query = contactsSearchSignal.value.trim().toLowerCase();
  const contacts = [...contactsSignal.value].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  if (!query) return contacts;

  return contacts.filter((contact) =>
    [contact.firstName, contact.lastName, contact.email, contact.phone, contact.company, contact.jobTitle]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );
});
