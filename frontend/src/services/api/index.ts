const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:8080';
// Barrel file: re-exports
export * as auction from './auction';
export * as mechanic from './mechanic';
export * as storage from './storage';
export * as inventory from './inventory';
export * as insurance from './insurance';
export * as financing from './financing';
export * as user from './user';
export * as communication from './communication';

