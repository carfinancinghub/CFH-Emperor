// @ai-generated via ai-orchestrator
// File: useAuth.ts
// Path: frontend/src/components/auth/useAuth.ts
// Purpose: Minimal auth hook used by auth components (ProtectedRoute/LoginForm).
// Notes: Uses backend /api/auth/login (port 3000) and stores token in localStorage.

import { useCallback, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  token: string;
  userId?: string | null;
  role?: string | null;
  email?: string | null;
};

export type UseAuthResult = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const TOKEN_KEY = "token";
const USER_ID_KEY = "user_id";
const ROLE_KEY = "role";
const EMAIL_KEY = "email";

// Always point to backend (never 8020). Allow env override.
const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:3000";

export default function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);
    const role = localStorage.getItem(ROLE_KEY);
    const email = localStorage.getItem(EMAIL_KEY);

    if (token) setUser({ token, userId, role, email });
    else setUser(null);

    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) throw new Error("Missing credentials");

    const resp = await fetch(`${BACKEND}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // backend expects user_id per your health proof
      body: JSON.stringify({ user_id: email, password }),
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`Login failed (${resp.status}) ${txt}`);
    }

    const data = (await resp.json().catch(() => ({}))) as {
      token?: string;
      user_id?: string;
      role?: string;
      email?: string;
    };

    const token = data.token ?? "";
    const userId = data.user_id ?? email;
    const role = data.role ?? localStorage.getItem(ROLE_KEY);
    const finalEmail = data.email ?? email;

    if (!token) throw new Error("Login response missing token");

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem(EMAIL_KEY, finalEmail);
    if (role) localStorage.setItem(ROLE_KEY, role);

    setUser({ token, userId, role, email: finalEmail });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setUser(null);
  }, []);

  return useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );
}
