import { useEffect, useState, type FormEvent } from "react";
import type { Contact, ContactInput } from "../lib/types";

const EMPTY: ContactInput = { name: "", email: "", phone: "", type: "personal" };

interface Props {
  editing: Contact | null;
  onSubmit: (data: ContactInput) => Promise<void>;
  onCancel: () => void;
}

export function ContactForm({ editing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ContactInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(editing ? { name: editing.name, email: editing.email ?? "", phone: editing.phone ?? "", type: editing.type } : EMPTY);
    setError(null);
  }, [editing]);

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      await onSubmit(form);
      if (!editing) setForm(EMPTY);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save contact");
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? "Edit contact" : "Add contact"}</h2>
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      <label>
        Name
        <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </label>
      <label>
        Email
        <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </label>
      <label>
        Phone
        <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </label>
      <fieldset className="radios">
        <legend>Type</legend>
        {(["personal", "professional"] as const).map((t) => (
          <label key={t}>
            <input type="radio" name="type" checked={form.type === t} onChange={() => set("type", t)} /> {t}
          </label>
        ))}
      </fieldset>
      <button className="btn btn-primary" type="submit">
        {editing ? "Update contact" : "Add contact"}
      </button>
      {editing && (
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
