import { useEffect, useMemo, useState } from "react";
import { ContactFilter, filterContacts } from "../components/ContactFilter";
import { ContactForm } from "../components/ContactForm";
import { ContactItem } from "../components/ContactItem";
import { api } from "../lib/api";
import type { Contact, ContactInput } from "../lib/types";

/** Small enough that the six-contact demo seed needs a second page. */
export const CONTACT_PAGE_SIZE = 5;

export function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .listContacts({ limit: CONTACT_PAGE_SIZE, offset: 0 })
      .then((page) => {
        setContacts(page.contacts);
        setTotal(page.total);
      })
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => filterContacts(contacts, query), [contacts, query]);
  const hasMore = contacts.length < total;

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const page = await api.listContacts({ limit: CONTACT_PAGE_SIZE, offset: contacts.length });
      setContacts((cs) => [...cs, ...page.contacts]);
      setTotal(page.total);
    } finally {
      setLoadingMore(false);
    }
  }

  async function save(data: ContactInput) {
    if (editing) {
      const updated = await api.updateContact(editing._id, data);
      setContacts((cs) => cs.map((c) => (c._id === updated._id ? updated : c)));
      setEditing(null);
    } else {
      const created = await api.createContact(data);
      setContacts((cs) => [created, ...cs]);
      setTotal((n) => n + 1);
    }
  }

  async function remove(id: string) {
    await api.deleteContact(id);
    setContacts((cs) => cs.filter((c) => c._id !== id));
    setTotal((n) => Math.max(0, n - 1));
    if (editing?._id === id) setEditing(null);
  }

  const countLabel = query.trim()
    ? `${visible.length} match${visible.length === 1 ? "" : "es"} in ${contacts.length} loaded (${total} total)`
    : `${contacts.length} of ${total} contact${total === 1 ? "" : "s"}`;

  return (
    <div className="grid">
      <ContactForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} />
      <section>
        <div className="list-toolbar">
          <ContactFilter value={query} onChange={setQuery} />
          {!loading && (
            <p className="muted list-count" aria-live="polite">
              {countLabel}
            </p>
          )}
        </div>
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
        {!loading && hasMore ? (
          <button type="button" className="btn btn-ghost load-more" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : `Load more (${total - contacts.length} remaining)`}
          </button>
        ) : null}
      </section>
    </div>
  );
}
