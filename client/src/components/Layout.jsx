import { Link } from "react-router-dom";

export default function Layout({ children, wide }) {
  return (
    <div className="layout">
      <header className="topbar">
        <Link to="/" className="logo">
          <span className="logo-dot" />
          Flow
        </Link>
        <nav className="topnav">
          <Link to="/login">Sign in</Link>
          <Link to="/register" className="btn btn-sm">
            Get started
          </Link>
        </nav>
      </header>
      <main className={wide ? "main wide" : "main"}>{children}</main>
    </div>
  );
}
