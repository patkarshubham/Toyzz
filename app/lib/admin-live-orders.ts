export type AdminLiveOrder = {
  id: string;
  productId: number;
  qty: number;
  channel: "delivery" | "pickup";
  status:
    | "processing"
    | "packed"
    | "in_transit"
    | "delivered"
    | "ready_for_pickup"
    | "picked_up"
    | "cancelled";
  placedAt: string;
  source: "cart";
};

export const ADMIN_LIVE_ORDERS_KEY = "pinetoyzz_admin_live_orders";

function readLiveOrders(): AdminLiveOrder[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ADMIN_LIVE_ORDERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as AdminLiveOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAdminLiveOrders() {
  return readLiveOrders();
}

export function pushCartActivityToAdmin(productId: number, qty = 1) {
  if (typeof window === "undefined") return;

  const existing = readLiveOrders();
  const now = new Date();
  const placedAt = now.toISOString().slice(0, 10);

  const order: AdminLiveOrder = {
    id: `LIVE-${now.getTime()}`,
    productId,
    qty,
    channel: "delivery",
    status: "processing",
    placedAt,
    source: "cart",
  };

  const next = [order, ...existing].slice(0, 200);
  window.localStorage.setItem(ADMIN_LIVE_ORDERS_KEY, JSON.stringify(next));
}
