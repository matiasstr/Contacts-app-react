import Loading from '../../../shared/components/Loading';
import type { Contact } from '../state/contacts.signals';
import ContactCard from './ContactCard';

type ContactListProps = {
  contacts: Contact[];
  isLoading: boolean;
  onToggleFavorite: (contact: Contact) => void;
};

export default function ContactList({ contacts, isLoading, onToggleFavorite }: ContactListProps) {
  if (isLoading) return <Loading label="Loading contacts..." />;

  if (!contacts.length) {
    return (
      <div className="rounded-md border border-dashed border-line bg-white p-8 text-center">
        <h3 className="text-lg font-bold text-ink">No contacts yet</h3>
        <p className="mt-2 text-sm text-muted">Create your first contact or adjust the search filter.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
