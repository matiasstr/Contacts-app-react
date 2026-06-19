import { FormEvent, useEffect, useMemo, useState } from 'react';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import TextArea from '../../../shared/components/TextArea';
import type { Contact, ContactPayload } from '../state/contacts.signals';

type ContactFormProps = {
  contact?: Contact | null;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (payload: ContactPayload) => Promise<void>;
};

type FormState = ContactPayload;

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  notes: '',
  isFavorite: false,
};

export default function ContactForm({ contact, submitLabel, isSubmitting, onSubmit }: ContactFormProps) {
  const initialValue = useMemo<FormState>(
    () => ({
      ...emptyForm,
      ...contact,
      isFavorite: Boolean(contact?.isFavorite),
    }),
    [contact],
  );
  const [form, setForm] = useState<FormState>(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onSubmit({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email?.trim(),
      phone: form.phone?.trim(),
      company: form.company?.trim(),
      jobTitle: form.jobTitle?.trim(),
      notes: form.notes?.trim(),
    });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="First name"
          value={form.firstName}
          error={errors.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          required
        />
        <Input
          label="Last name"
          value={form.lastName}
          error={errors.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Input label="Phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Company" value={form.company} onChange={(event) => updateField('company', event.target.value)} />
        <Input label="Job title" value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} />
      </div>
      <TextArea label="Notes" value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
          checked={form.isFavorite}
          onChange={(event) => updateField('isFavorite', event.target.checked)}
        />
        Favorite contact
      </label>
      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
