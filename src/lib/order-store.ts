import { Order } from "@/types/crm";

// Global fallback in-memory order store across Next.js API routes
declare global {
  // eslint-disable-next-line no-var
  var __holsteinDevOrderStore: Map<string, Order> | undefined;
}

export const devOrderStore: Map<string, Order> =
  globalThis.__holsteinDevOrderStore ?? (globalThis.__holsteinDevOrderStore = new Map());

