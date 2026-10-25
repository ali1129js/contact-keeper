import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactItem } from "./ContactItem";

const contact = { _id: "1", name: "Ada Quill", email: "ada@example.com", phone: "555-0101", type: "professional" as const };

describe("ContactItem", () => {
  it("renders contact details and type badge", () => {
    render(<ContactItem contact={contact} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Ada Quill" })).toBeInTheDocument();
    expect(screen.getByText(/ada@example.com/)).toBeInTheDocument();
    expect(screen.getByText("professional")).toHaveClass("badge-professional");
  });

  it("calls edit and delete handlers", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<ContactItem contact={contact} onEdit={onEdit} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onEdit).toHaveBeenCalledWith(contact);
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
