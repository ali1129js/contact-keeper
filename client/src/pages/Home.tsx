import { useEffect, useMemo, useState } from "react";
import { ContactFilter, filterContacts } from "../components/ContactFilter";
import { ContactForm } from "../components/ContactForm";
import { ContactItem } from "../components/ContactItem";
import { api } from "../lib/api";
import type { Contact, ContactInput } from "../lib/types";

export function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .listContacts()
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => filterContacts(contacts, query), [contacts, query]);

  async function save(data: ContactInput) {
    if (editing) {
      const updated = await api.updateContact(editing._id, data);
      setContacts((cs) => cs.map((c) => (c._id === updated._id ? updated : c)));
      setEditing(null);
    } else {
      const created = await api.createContact(data);
      setContacts((cs) => [created, ...cs]);
    }
  }

  async function remove(id: string) {
    await api.deleteContact(id);
    setContacts((cs) => cs.filter((c) => c._id !== id));
    if (editing?._id === id) setEditing(null);
  }

  return (
    <div className="grid">
      <ContactForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} />
      <section>
        <ContactFilter value={query} onChange={setQuery} />
        {loading ? (
          <p className="muted">Loading contacts...</p>
        ) : visible.length === 0 ? (
          <p className="muted">{contacts.length ? "No contacts match your filter." : "No contacts yet. Add one!"}</p>
        ) : (
          <div className="list">
            {visible.map((c) => (
              <ContactItem key={c._id} contact={c} onEdit={setEditing} onDelete={remove} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
