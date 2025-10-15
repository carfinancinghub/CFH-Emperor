// @ai-generated via ai-orchestrator
This conversion uses a type alias for the return structure and explicitly types the `useState` calls to enforce `string | null` for the state variables.

```tsx
// File: useAuth.ts
// Path: frontend/src/utils/useAuth.ts

import { useEffect, useState } from 'react';

type AuthState = {
  token: string | null;
  role: string | null;
};

const useAuth = (): AuthState => {
  // Explicitly typing state to handle initial null value and subsequent string values
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // localStorage.getItem returns string | null
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return { token, role };
};

export default useAuth;
```