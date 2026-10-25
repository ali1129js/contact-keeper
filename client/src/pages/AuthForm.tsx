import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      <label>
        Password
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {isRegister && (
        <label>
          Confirm password
          <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
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
