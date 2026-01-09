// src/services/domainEvents.ts
export type DomainEventName = "royalty_trigger" | "deal_closed" | "listing_context";

type Handler<T = any> = (payload: T) => void;

const listeners: Record<string, Set<Handler>> = {};

export function on<T = any>(name: DomainEventName, handler: Handler<T>) {
  listeners[name] ??= new Set();
  listeners[name].add(handler as Handler);
  return () => off(name, handler);
}

export function off<T = any>(name: DomainEventName, handler: Handler<T>) {
  listeners[name]?.delete(handler as Handler);
}

export function emit<T = any>(name: DomainEventName, payload: T) {
  listeners[name]?.forEach((h) => {
    try { h(payload); } catch { /* no-op */ }
  });
}
