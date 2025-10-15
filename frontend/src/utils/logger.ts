// Simple logger with levels; replace with winston/pino later if desired.
type Level = 'debug' | 'info' | 'warn' | 'error';

const levelOrder: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const current: Level = (import.meta.env.VITE_LOG_LEVEL as Level) ?? 'info';

function log(l: Level, ...args: unknown[]) {
  if (levelOrder[l] >= levelOrder[current]) {
    // eslint-disable-next-line no-console
    console[l === 'debug' ? 'log' : l](...args);
  }
}
export const logger = {
  debug: (...a: unknown[]) => log('debug', ...a),
  info:  (...a: unknown[]) => log('info',  ...a),
  warn:  (...a: unknown[]) => log('warn',  ...a),
  error: (...a: unknown[]) => log('error', ...a),
};
export default logger;
