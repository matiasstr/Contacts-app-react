import { Link } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import type { Contact } from '../state/contacts.signals';

type ContactCardProps = {
  contact: Contact;
  onToggleFavorite: (contact: Contact) => void;
};

export default function ContactCard({ contact, onToggleFavorite }: ContactCardProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();

  return (
    <article className="rounded-md border border-line bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/contacts/${contact.id}`} className="block truncate text-lg font-bold text-ink hover:text-brand">
            {fullName || 'Unnamed contact'}
          </Link>
          <p className="mt-1 truncate text-sm text-muted">
            {[contact.jobTitle, contact.company].filter(Boolean).join(' at ') || contact.email || 'No role added'}
          </p>
        </div>
        <button
          type="button"
          className={`rounded-md px-2 py-1 text-lg ${contact.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
          aria-label={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => onToggleFavorite(contact)}
          title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="truncate">
          <dt className="sr-only">Email</dt>
          <dd>{contact.email || 'No email'}</dd>
        </div>
        <div className="truncate">
          <dt className="sr-only">Phone</dt>
          <dd>{contact.phone || 'No phone'}</dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <Link to={`/contacts/${contact.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Details
          </Button>
        </Link>
        <Link to={`/contacts/${contact.id}/edit`} className="flex-1">
          <Button variant="ghost" className="w-full">
            Edit
          </Button>
        </Link>
      </div>
    </article>
  );
}
