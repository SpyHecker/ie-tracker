import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateSession } from "../lib/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ status: "loading", user: null });

  useEffect(() => {
    let active = true;
    validateSession().then((user) => {
      if (active) setState({ status: user ? "ok" : "guest", user });
    });
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="screen-center">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (state.status === "guest") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
