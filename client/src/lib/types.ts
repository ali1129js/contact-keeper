export type ContactType = "personal" | "professional";

export interface Contact {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  type: ContactType;
}

export type ContactInput = Omit<Contact, "_id">;

export interface User {
  id: string;
  name: string;
  email: string;
}
