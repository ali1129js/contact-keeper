import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("shows a validation error when name is empty", async () => {
    const onSubmit = vi.fn();
    render(<ContactForm editing={null} onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Add contact" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered contact and resets", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ContactForm editing={null} onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText("Name"), "Cleo Marigold");
    await userEvent.type(screen.getByLabelText("Email"), "cleo@example.com");
    await userEvent.click(screen.getByLabelText(/professional/));
    await userEvent.click(screen.getByRole("button", { name: "Add contact" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Cleo Marigold", email: "cleo@example.com", phone: "", type: "professional" });
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("prefills when editing", () => {
    const editing = { _id: "9", name: "Felix Underhill", phone: "555-0106", type: "personal" as const };
    render(<ContactForm editing={editing} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText("Name")).toHaveValue("Felix Underhill");
    expect(screen.getByRole("button", { name: "Update contact" })).toBeInTheDocument();
  });
});
