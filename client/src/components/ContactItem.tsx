import type { Contact } from "../lib/types";

interface Props {
  contact: Contact;
  onEdit: (c: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactItem({ contact, onEdit, onDelete }: Props) {
  const { name, email, phone, type } = contact;
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
        <button type="button" className="btn btn-danger" onClick={() => onDelete(contact._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
