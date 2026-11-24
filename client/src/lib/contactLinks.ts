/** A conservative email check: one @, a domain with a dot, no spaces. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Phone characters we accept in a tel: link: digits, spaces, dashes, dots, slashes, parentheses, one leading +. */
const PHONE_RE = /^\+?[\d\s()./-]+$/;
const MIN_PHONE_DIGITS = 7;

export function mailtoHref(email: string): string | null {
  const trimmed = email.trim();
  if (!EMAIL_RE.test(trimmed)) return null;
  return `mailto:${trimmed}`;
}

export function telHref(phone: string): string | null {
  const trimmed = phone.trim();
  if (!PHONE_RE.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < MIN_PHONE_DIGITS) return null;
  const number = trimmed.startsWith("+") ? `+${digits}` : digits;
  return `tel:${number}`;
}
