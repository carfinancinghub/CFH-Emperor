// Admin-local shim: keeps legacy admin imports working.
// Source of truth remains the app-wide auth hook.
// If '@/utils/useAuth' does not exist in your repo, we will adjust after proof.

import useAuth from '@/utils/useAuth';

export default useAuth;
