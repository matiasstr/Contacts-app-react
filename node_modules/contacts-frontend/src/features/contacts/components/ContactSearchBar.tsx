import Input from '../../../shared/components/Input';

type ContactSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ContactSearchBar({ value, onChange }: ContactSearchBarProps) {
  return (
    <div className="w-full max-w-xl">
      <Input
        label="Search contacts"
        placeholder="Name, email, phone, company..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
