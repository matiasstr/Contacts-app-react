import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import Loading from '../../../shared/components/Loading';
import { useSignalValue } from '../../../shared/hooks/useSignalValue';
import { deleteContact, fetchContact, toggleFavorite } from '../services/contacts.api';
import {
  contactsErrorSignal,
  contactsLoadingSignal,
  contactsSignal,
  selectedContactSignal,
} from '../state/contacts.signals';

export default function ContactDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = useSignalValue(selectedContactSignal);
  const isLoading = useSignalValue(contactsLoadingSignal);
  const error = useSignalValue(contactsErrorSignal);

  useEffect(() => {
    if (!id) return;
    const contactId = id;
    let isActive = true;
    const cached = contactsSignal.value.find((item) => item.id === contactId);

    if (cached) {
      selectedContactSignal.value = cached;
      return;
    }

    async function loadContact() {
      contactsLoadingSignal.value = true;
      contactsErrorSignal.value = null;
      try {
        const result = await fetchContact(contactId);
        if (isActive) selectedContactSignal.value = result;
      } catch (error) {
        if (isActive) contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to load contact.';
      } finally {
        if (isActive) contactsLoadingSignal.value = false;
      }
    }

    loadContact();
    return () => {
      isActive = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!contact || !window.confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) return;
    contactsLoadingSignal.value = true;
    contactsErrorSignal.value = null;

    try {
      await deleteContact(contact.id);
      contactsSignal.value = contactsSignal.value.filter((item) => item.id !== contact.id);
      selectedContactSignal.value = null;
      navigate('/contacts');
    } catch (error) {
      contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to delete contact.';
    } finally {
      contactsLoadingSignal.value = false;
    }
  }

  async function handleToggleFavorite() {
    if (!contact) return;

    try {
      const updated = await toggleFavorite(contact.id);
      selectedContactSignal.value = updated;
      contactsSignal.value = contactsSignal.value.map((item) => (item.id === updated.id ? updated : item));
    } catch (error) {
      contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to update favorite.';
    }
  }

  if (isLoading && !contact) return <Loading label="Loading contact..." />;

  if (!contact) {
    return (
      <section className="grid gap-4">
        <ErrorMessage message={error || 'Contact not found.'} />
        <Link to="/contacts">
          <Button variant="secondary">Back to contacts</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Link className="text-sm font-semibold text-brand hover:text-blue-700" to="/contacts">
            Back to contacts
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {[contact.jobTitle, contact.company].filter(Boolean).join(' at ') || 'No role added'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleToggleFavorite}>
            {contact.isFavorite ? 'Unfavorite' : 'Favorite'}
          </Button>
          <Link to={`/contacts/${contact.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Email', contact.email || 'Not added'],
          ['Phone', contact.phone || 'Not added'],
          ['Company', contact.company || 'Not added'],
          ['Job title', contact.jobTitle || 'Not added'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-line bg-white p-4">
            <p className="text-sm font-semibold text-muted">{label}</p>
            <p className="mt-1 break-words text-lg font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-line bg-white p-4">
        <p className="text-sm font-semibold text-muted">Notes</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{contact.notes || 'No notes added.'}</p>
      </div>
    </section>
  );
}
