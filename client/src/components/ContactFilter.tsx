import type { Contact } from "../lib/types";

export function filterContacts(contacts: Contact[], query: string): Contact[] {
  const q = query.trim().toLowerCase();
  if (!q) return contacts;
  return contacts.filter((c) => [c.name, c.email, c.phone].some((f) => f?.toLowerCase().includes(q)));
}

export function ContactFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="input"
      type="search"
      placeholder="Filter contacts..."
      aria-label="Filter contacts"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
