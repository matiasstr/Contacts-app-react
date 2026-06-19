import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import ContactForm from '../components/ContactForm';
import { createContact } from '../services/contacts.api';
import { contactsErrorSignal, contactsSignal, type ContactPayload } from '../state/contacts.signals';

export default function CreateContactPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(payload: ContactPayload) {
    setIsSubmitting(true);
    contactsErrorSignal.value = null;
    try {
      const created = await createContact(payload);
      contactsSignal.value = [created, ...contactsSignal.value];
      navigate(`/contacts/${created.id}`);
    } catch (error) {
      contactsErrorSignal.value = error instanceof Error ? error.message : 'Unable to create contact.';
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-3xl gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">New contact</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Create contact</h1>
        </div>
        <Link to="/contacts">
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>
      <ErrorMessage message={contactsErrorSignal.value} />
      <div className="rounded-md border border-line bg-white p-5 shadow-sm">
        <ContactForm submitLabel="Create contact" isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
