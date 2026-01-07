type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

const levelFromEnv = (): LogLevel => {
  // Jest / Node-safe:
  const v = (process.env.VITE_LOG_LEVEL || process.env.LOG_LEVEL || 'info').toLowerCase();
  if (v === 'silent' || v === 'error' || v === 'warn' || v === 'info' || v === 'debug') return v;
  return 'info';
};

export const logger = {
  level: levelFromEnv(),
  debug: (..._args: unknown[]) => {},
  info: (..._args: unknown[]) => {},
  warn: (..._args: unknown[]) => {},
  error: (..._args: unknown[]) => {},
};

export default logger;

