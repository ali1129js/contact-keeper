import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`;

  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-row">
        <input
          id={id}
          className="input"
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-ghost"
          aria-label={toggleLabel}
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { user, login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) return setError("Please fill in all fields");
    if (isRegister && password.length < 8) return setError("Password must be at least 8 characters");
    if (isRegister && password !== confirm) return setError("Passwords do not match");
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className="panel narrow" onSubmit={handleSubmit} noValidate>
      <h1>{isRegister ? "Create account" : "Log in"}</h1>
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      {isRegister && (
        <label>
          Name
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      )}
      <label>
        Email
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <PasswordField
        id="password"
        label="Password"
        value={password}
        autoComplete={isRegister ? "new-password" : "current-password"}
        onChange={setPassword}
      />
      {isRegister && (
        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirm}
          autoComplete="new-password"
          onChange={setConfirm}
        />
      )}
      <button className="btn btn-primary" type="submit">
        {isRegister ? "Register" : "Log in"}
      </button>
      <p className="muted">
        {isRegister ? <Link to="/login">Already have an account?</Link> : <Link to="/register">Need an account?</Link>}
      </p>
    </form>
  );
}
