import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <Link to="/" className="brand">
        📇 Contact Keeper
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className="muted">Hi, {user.name}</span>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}
