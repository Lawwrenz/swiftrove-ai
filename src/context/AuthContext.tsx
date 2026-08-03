// ============================================================================
// AuthContext — Centralized Authentication State
// ============================================================================
// Provides authentication state, profile data, and auth methods to the entire
// application. Uses Supabase Auth as the authentication provider.
// ============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase, type Profile } from "../lib/supabase";
import type { User, AuthError, Session } from "@supabase/supabase-js";

// ============================================================================
// Types
// ============================================================================

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  // Fetch profile from the profiles table
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("[Auth] Error fetching profile:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("[Auth] Failed to fetch profile:", err);
      return null;
    }
  }, []);

  // Create profile for new users
  const createProfile = useCallback(
    async (userId: string, email: string, fullName: string): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email,
            full_name: fullName,
            role: "Admin",
            avatar_url: null,
          })
          .select()
          .single();

        if (error) {
          console.error("[Auth] Error creating profile:", error.message);
          return null;
        }
        return data;
      } catch (err) {
        console.error("[Auth] Failed to create profile:", err);
        return null;
      }
    },
    [],
  );

  // Ensure a profile exists for the authenticated user — if not, auto-create it
  const ensureProfile = useCallback(
    async (session: Session): Promise<Profile | null> => {
      const userId = session.user.id;
      let profile = await fetchProfile(userId);

      if (!profile) {
        // Auto-create profile from user metadata
        const userMeta = session.user.user_metadata;
        const fullName = userMeta?.full_name || session.user.email?.split('@')[0] || '';
        profile = await createProfile(userId, session.user.email || '', fullName);
      }

      return profile;
    },
    [fetchProfile, createProfile],
  );

  const refreshProfile = useCallback(async () => {
    if (!state.user || !state.session) return;
    const profile = await ensureProfile(state.session);
    setState((prev) => ({ ...prev, profile }));
  }, [state.user, state.session, ensureProfile]);

  // Set auth state from session + ensure profile exists
  const setAuthState = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          isAuthenticated: false,
        });
        return;
      }

      const profile = await ensureProfile(session);
      setState({
        user: session.user,
        profile,
        session,
        loading: false,
        isAuthenticated: true,
      });
    },
    [ensureProfile],
  );

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Restore session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      await setAuthState(session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        await setAuthState(session);
      } else if (event === "SIGNED_OUT") {
        setState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setAuthState]);

  // ========================================================================
  // Auth Methods
  // ========================================================================

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
    ): Promise<{ error: AuthError | null; user: User | null }> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error, user: null };
      }

      return { error: null, user: data.user ?? null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    },
    [],
  );

  const updatePassword = useCallback(
    async (password: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}