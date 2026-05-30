import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { clearSession } from "../lib/api";

export default function AppShell({ user, children }) {
  const navigate = useNavigate();
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  function logout() {
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="appbar">
        <Link to="/app" className="logo">
          <span className="logo-dot" />
          Flow
        </Link>
        <div className="appbar-right">
          <span className="user-chip" title={user?.email}>
            {initial}
          </span>
          <button type="button" className="icon-btn" onClick={logout} title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
