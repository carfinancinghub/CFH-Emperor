// @ai-generated via ai-orchestrator
// File: useAuth.ts
// Path: frontend/src/components/auth/useAuth.ts
// Purpose: Minimal auth hook used by auth components (ProtectedRoute/LoginForm).
// Notes: Keeps types predictable for TS/TSX compilation.

import { useCallback, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  token: string;
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
const ROLE_KEY = "role";
const EMAIL_KEY = "email";

export default function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const role = localStorage.getItem(ROLE_KEY);
    const email = localStorage.getItem(EMAIL_KEY);

    if (token) {
      setUser({ token, role, email });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) throw new Error("Missing credentials");

    const fakeToken = "local-dev-token";
    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(EMAIL_KEY, email);

    const role = localStorage.getItem(ROLE_KEY);
    setUser({ token: fakeToken, role, email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setUser(null);
  }, []);

  return useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
}
