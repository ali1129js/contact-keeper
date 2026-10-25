import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { AuthForm } from "./AuthForm";

function renderForm(mode: "login" | "register") {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AuthForm mode={mode} />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("AuthForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("blocks registration when passwords do not match", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderForm("register");
    await userEvent.type(screen.getByLabelText("Name"), "Demo");
    await userEvent.type(screen.getByLabelText("Email"), "demo@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password-1");
    await userEvent.type(screen.getByLabelText("Confirm password"), "password-2");
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Passwords do not match");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows the server error on failed login", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ msg: "Invalid credentials" }), { status: 401 }),
    );
    renderForm("login");
    await userEvent.type(screen.getByLabelText("Email"), "demo@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "nope");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
  });
});
