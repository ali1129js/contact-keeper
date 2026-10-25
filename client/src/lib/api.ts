import type { Contact, ContactInput, User } from "./types";

const BASE = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "ck_token";

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

interface ErrorBody {
  msg?: string;
  errors?: { field: string; msg: string }[];
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = body as ErrorBody;
    throw new ApiError(err.msg ?? err.errors?.map((e) => e.msg).join(", ") ?? "Request failed", res.status);
  }
  return body as T;
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request<User>("/auth/me"),
  listContacts: () => request<Contact[]>("/contacts"),
  createContact: (c: ContactInput) => request<Contact>("/contacts", { method: "POST", body: JSON.stringify(c) }),
  updateContact: (id: string, c: Partial<ContactInput>) =>
    request<Contact>(`/contacts/${id}`, { method: "PUT", body: JSON.stringify(c) }),
  deleteContact: (id: string) => request<{ msg: string }>(`/contacts/${id}`, { method: "DELETE" }),
};
