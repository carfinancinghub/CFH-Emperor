import React, { createContext, useContext } from "react";

export interface AuthContextValue {
  userId?: string | null;
  email?: string | null;
  isAdmin?: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Wave-20 stub: real implementation can hydrate from backend / auth SDK.
  const value: AuthContextValue = {
    userId: null,
    email: null,
    isAdmin: false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // For now, return a default empty value instead of throwing to keep tests predictable.
    return { userId: null, email: null, isAdmin: false };
  }
  return ctx;
};
