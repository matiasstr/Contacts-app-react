import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import Loading from '../../../shared/components/Loading';
import { useSignalValue } from '../../../shared/hooks/useSignalValue';
import ContactForm from '../components/ContactForm';
import { fetchContact, updateContact } from '../services/contacts.api';
import {
  contactsErrorSignal,
  contactsLoadingSignal,
  contactsSignal,
  selectedContactSignal,
  type ContactPayload,
} from '../state/contacts.signals';

export default function EditContactPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function handleSubmit(payload: ContactPayload) {
    if (!id) return;
    setIsSubmitting(true);
    contactsErrorSignal.value = null;

    try {
      const updated = await updateContact(id, payload);
      selectedContactSignal.value = updated;
      contactsSignal.value = contactsSignal.value.map((item) => (item.id === updated.id ? updated : item));
      navigate(`/contacts/${updated.id}`);
    } catch (error) {
      contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to update contact.';
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading && !contact) return <Loading label="Loading contact..." />;

  return (
    <section className="mx-auto grid max-w-3xl gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Edit contact</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">
            {contact ? `${contact.firstName} ${contact.lastName}` : 'Contact'}
          </h1>
        </div>
        <Link to={contact ? `/contacts/${contact.id}` : '/contacts'}>
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>
      <ErrorMessage message={error} />
      {contact ? (
        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <ContactForm contact={contact} submitLabel="Save changes" isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        </div>
      ) : (
        <ErrorMessage message="Contact not found." />
      )}
    </section>
  );
}
