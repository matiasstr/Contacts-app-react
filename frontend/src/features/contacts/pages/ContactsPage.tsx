import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import Button from '../../../shared/components/Button';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { useSignalValue } from '../../../shared/hooks/useSignalValue';
import { fetchContacts, toggleFavorite } from '../services/contacts.api';
import {
  contactsErrorSignal,
  contactsLoadingSignal,
  contactsSearchSignal,
  contactsSignal,
  filteredContactsSignal,
  type Contact,
} from '../state/contacts.signals';
import ContactList from '../components/ContactList';
import ContactSearchBar from '../components/ContactSearchBar';

export default function ContactsPage() {
  const searchInput$ = useMemo(() => new Subject<string>(), []);
  const contacts = useSignalValue(contactsSignal);
  const filteredContacts = useSignalValue(filteredContactsSignal);
  const searchValue = useSignalValue(contactsSearchSignal);
  const isLoading = useSignalValue(contactsLoadingSignal);
  const error = useSignalValue(contactsErrorSignal);

  useEffect(() => {
    const subscription = searchInput$.pipe(debounceTime(200), distinctUntilChanged()).subscribe((value) => {
      contactsSearchSignal.value = value;
    });

    return () => subscription.unsubscribe();
  }, [searchInput$]);

  useEffect(() => {
    let isActive = true;

    async function loadContacts() {
      contactsLoadingSignal.value = true;
      contactsErrorSignal.value = null;
      try {
        const contacts = await fetchContacts();
        if (isActive) contactsSignal.value = contacts;
      } catch (error) {
        if (isActive) contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to load contacts.';
      } finally {
        if (isActive) contactsLoadingSignal.value = false;
      }
    }

    loadContacts();
    return () => {
      isActive = false;
    };
  }, []);

  async function handleToggleFavorite(contact: Contact) {
    const previous = contactsSignal.value;
    contactsSignal.value = previous.map((item) =>
      item.id === contact.id ? { ...item, isFavorite: !item.isFavorite } : item,
    );

    try {
      const updated = await toggleFavorite(contact.id);
      contactsSignal.value = contactsSignal.value.map((item) => (item.id === updated.id ? updated : item));
    } catch (error) {
      contactsSignal.value = previous;
      contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to update favorite.';
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Contacts</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Your address book</h1>
          <p className="mt-2 text-sm text-muted">Search, favorite, edit, and message the people you work with.</p>
        </div>
        <Link to="/contacts/new">
          <Button className="w-full md:w-auto">New contact</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 md:flex-row md:items-end md:justify-between">
        <ContactSearchBar value={searchValue} onChange={(value) => searchInput$.next(value)} />
        <div className="text-sm text-muted">
          {filteredContacts.length} of {contacts.length} contacts
        </div>
      </div>

      <ErrorMessage message={error} />
      <ContactList
        contacts={filteredContacts}
        isLoading={isLoading}
        onToggleFavorite={handleToggleFavorite}
      />
    </section>
  );
}
