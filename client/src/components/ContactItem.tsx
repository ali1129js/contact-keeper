import { useState } from "react";
import type { Contact } from "../lib/types";
import { mailtoHref, telHref } from "../lib/contactLinks";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  contact: Contact;
  onEdit: (c: Contact) => void;
  onDelete: (id: string) => void;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="btn btn-ghost btn-copy" onClick={() => void copy()} aria-label={label}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ContactField({
  icon,
  value,
  href,
  copyLabel,
}: {
  icon: string;
  value: string;
  href: string | null;
  copyLabel: string;
}) {
  return (
    <li className="meta-row">
      <span>
        {icon} {href ? <a href={href}>{value}</a> : value}
      </span>
      <CopyButton value={value} label={copyLabel} />
    </li>
  );
}

export function ContactItem({ contact, onEdit, onDelete }: Props) {
  const { name, email, phone, type } = contact;
  const [confirming, setConfirming] = useState(false);
  const mail = email?.trim() ? mailtoHref(email) : null;
  const tel = phone?.trim() ? telHref(phone) : null;

  return (
    <article className="card" aria-label={name}>
      <header className="card-head">
        <h3>{name}</h3>
        <span className={`badge badge-${type}`}>{type}</span>
      </header>
      <ul className="meta">
        {email ? (
          <ContactField icon="✉" value={email} href={mail} copyLabel={`Copy email ${email}`} />
        ) : null}
        {phone ? (
          <ContactField icon="☎" value={phone} href={tel} copyLabel={`Copy phone ${phone}`} />
        ) : null}
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
