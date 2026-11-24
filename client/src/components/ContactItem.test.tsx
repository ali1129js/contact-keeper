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

  it("turns valid email and phone into mailto and tel links, with a named copy button", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ContactItem contact={contact} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole("link", { name: "ada@example.com" })).toHaveAttribute("href", "mailto:ada@example.com");
    expect(screen.getByRole("link", { name: "555-0101" })).toHaveAttribute("href", "tel:5550101");

    const copyEmail = screen.getByRole("button", { name: "Copy email ada@example.com" });
    await user.click(copyEmail);
    expect(writeText).toHaveBeenCalledWith("ada@example.com");
    expect(copyEmail).toHaveTextContent("Copied");
  });

  it("does not link invalid or empty email and phone values", () => {
    render(
      <ContactItem
        contact={{ ...contact, email: "not-an-email", phone: "call me" }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/not-an-email/)).toBeInTheDocument();
    expect(screen.getByText(/call me/)).toBeInTheDocument();

    const { rerender } = render(
      <ContactItem contact={{ ...contact, email: "", phone: "" }} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    rerender(<ContactItem contact={{ ...contact, email: undefined, phone: undefined }} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
