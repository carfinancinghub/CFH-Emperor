/**
 * @file UserBehaviorTracker.ts
 * @path C:\CFH\frontend\src\utils\UserBehaviorTracker.ts
 *
 * PURPOSE
 * - Minimal, safe analytics stub to unblock builds.
 * - Real implementation can be wired later (PostHog/GA/custom backend).
 *
 * CONTRACT
 * - Keep exported function names stable to avoid breaking callers.
 */

export type BehaviorEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export function track(eventName: string, properties?: Record<string, unknown>): void {
  try {
    // Intentionally no-op in production build until real tracker is wired.
    // Safe for SSR/build-time.
    if (typeof window !== "undefined" && process?.env?.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[UserBehaviorTracker.track]", eventName, properties ?? {});
    }
  } catch {
    // swallow
  }
}

export function trackEvent(evt: BehaviorEvent): void {
  track(evt.name, evt.properties);
}

export const UserBehaviorTracker = {
  track,
  trackEvent,
};
