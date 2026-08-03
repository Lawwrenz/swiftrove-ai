// ============================================================================
// AuthGuard — Route Protection Component
// ============================================================================
// Wraps protected routes. Redirects unauthenticated users to the login page,
// automatically redirects authenticated users away from auth pages.
// ============================================================================

import { type ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/nativelyai.svg"
            alt="Swiftrove AI"
            className="w-12 h-12 rounded-2xl shadow-lg shadow-indigo-500/20"
          />
          <Loader2 size={24} className="text-primary animate-spin" />
          <p className="text-sm text-text-secondary">Loading Swiftrove AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// ============================================================================
// PublicRoute — Redirects authenticated users away from auth pages
// ============================================================================

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/nativelyai.svg"
            alt="Swiftrove AI"
            className="w-12 h-12 rounded-2xl shadow-lg shadow-indigo-500/20"
          />
          <Loader2 size={24} className="text-primary animate-spin" />
          <p className="text-sm text-text-secondary">Loading Swiftrove AI...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}