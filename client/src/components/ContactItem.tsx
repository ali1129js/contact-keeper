import { useState } from "react";
import type { Contact } from "../lib/types";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  contact: Contact;
  onEdit: (c: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactItem({ contact, onEdit, onDelete }: Props) {
  const { name, email, phone, type } = contact;
  const [confirming, setConfirming] = useState(false);

  return (
    <article className="card" aria-label={name}>
      <header className="card-head">
        <h3>{name}</h3>
        <span className={`badge badge-${type}`}>{type}</span>
      </header>
      <ul className="meta">
        {email && <li>✉ {email}</li>}
        {phone && <li>☎ {phone}</li>}
      </ul>
      <div className="actions">
        <button type="button" className="btn btn-ghost" onClick={() => onEdit(contact)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
          Delete
        </button>
      </div>
      {confirming ? (
        <ConfirmDialog
          title="Delete contact?"
          message={`Delete ${name}? This cannot be undone.`}
          confirmLabel="Delete contact"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onDelete(contact._id);
          }}
        />
      ) : null}
    </article>
  );
}
