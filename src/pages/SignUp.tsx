// ============================================================================
// Sign Up Page — Registration with Profile Creation
// ============================================================================

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);

    if (signUpError) {
      setError(mapSignUpError(signUpError.message));
      return;
    }

    // Success — navigate to dashboard
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/nativelyai.svg"
              alt="Swiftrove AI"
              className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0"
            />
            <span className="font-semibold text-foreground text-lg">Swiftrove AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-foreground mb-1">Create your account.</h1>
          <p className="text-sm text-text-secondary mb-8">
            Get started with your AI Business Operating System.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lawrence Ezealor"
                autoComplete="name"
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted
                  transition-all duration-150 outline-none
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted
                  transition-all duration-150 outline-none
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted
                    transition-all duration-150 outline-none
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                    disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted
                  transition-all duration-150 outline-none
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm
                transition-all duration-150 cursor-pointer
                hover:brightness-110 active:brightness-95 active:scale-[0.97]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <UserPlus size={18} />
              )}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In link */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel — Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=")`,
          }}
        />

        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <img
              src="/nativelyai.svg"
              alt="Swiftrove AI"
              className="w-10 h-10"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Automate. Optimise. Grow.
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Join thousands of businesses using Swiftrove AI to automate
            workflows, manage payments, and deliver exceptional customer experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

function mapSignUpError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("duplicate")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("password")) {
    return "Password must be at least 6 characters long.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Network error — please check your connection and try again.";
  }
  return message;
}