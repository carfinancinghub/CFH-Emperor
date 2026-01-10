const BASE = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:3000";

export const api = {
  async get<T>(path: string, opts?: { params?: Record<string, any> }): Promise<{ data: T }> {
    const url = new URL(path, BASE);
    if (opts?.params) {
      for (const [k, v] of Object.entries(opts.params)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
    }
    const resp = await fetch(url.toString(), { method: "GET" });
    const data = (await resp.json().catch(() => ({}))) as T;
    return { data };
  },
};

// Barrel file: re-exports
export * as auction from './auction';
export * as mechanic from './mechanic';
export * as storage from './storage';
export * as inventory from './inventory';
export * as insurance from './insurance';
export * as financing from './financing';
export * as user from './user';
export * as communication from './communication';

