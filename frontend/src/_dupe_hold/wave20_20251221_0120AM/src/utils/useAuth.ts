// @ai-generated via ai-orchestrator
// File: useAuth.ts
// Path: frontend/src/utils/useAuth.ts
// Purpose: Lightweight auth state helper (token/role) used by non-auth UI.

import { useEffect, useState } from "react";

export type AuthState = {
  token: string | null;
  role: string | null;
};

const useAuth = (): AuthState => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  return { token, role };
};

export default useAuth;
