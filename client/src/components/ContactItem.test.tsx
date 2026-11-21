import { render, screen, within } from "@testing-library/react";
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

  it("calls the edit handler from the card", async () => {
    const onEdit = vi.fn();
    render(<ContactItem contact={contact} onEdit={onEdit} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(contact);
  });

  it("asks for confirmation before deleting, with Cancel focused first", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<ContactItem contact={contact} onEdit={vi.fn()} onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("dialog", { name: "Delete contact?" });
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole("button", { name: "Delete contact" }));
    expect(onDelete).toHaveBeenCalledWith("1");
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not delete when Cancel, Escape, or the backdrop is used", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ContactItem contact={contact} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.keyboard("{Escape}");
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<ContactItem contact={contact} onEdit={vi.fn()} onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByTestId("dialog-backdrop"));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
