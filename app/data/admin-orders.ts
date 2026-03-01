export type AdminOrder = {
  id: string;
  productId: number;
  qty: number;
  channel: "delivery" | "pickup";
  status: "processing" | "packed" | "in_transit" | "delivered" | "ready_for_pickup" | "picked_up" | "cancelled";
  placedAt: string;
};

export const adminOrders: AdminOrder[] = [
  { id: "PTZ-1001", productId: 1, qty: 3, channel: "delivery", status: "delivered", placedAt: "2026-02-18" },
  { id: "PTZ-1002", productId: 2, qty: 2, channel: "delivery", status: "in_transit", placedAt: "2026-02-19" },
  { id: "PTZ-1003", productId: 6, qty: 1, channel: "pickup", status: "picked_up", placedAt: "2026-02-19" },
  { id: "PTZ-1004", productId: 4, qty: 2, channel: "delivery", status: "delivered", placedAt: "2026-02-20" },
  { id: "PTZ-1005", productId: 8, qty: 2, channel: "pickup", status: "ready_for_pickup", placedAt: "2026-02-20" },
  { id: "PTZ-1006", productId: 10, qty: 4, channel: "delivery", status: "packed", placedAt: "2026-02-21" },
  { id: "PTZ-1007", productId: 7, qty: 1, channel: "delivery", status: "cancelled", placedAt: "2026-02-21" },
  { id: "PTZ-1008", productId: 5, qty: 2, channel: "delivery", status: "delivered", placedAt: "2026-02-22" },
  { id: "PTZ-1009", productId: 3, qty: 3, channel: "pickup", status: "picked_up", placedAt: "2026-02-23" },
  { id: "PTZ-1010", productId: 9, qty: 1, channel: "delivery", status: "processing", placedAt: "2026-02-23" },
  { id: "PTZ-1011", productId: 12, qty: 2, channel: "delivery", status: "delivered", placedAt: "2026-02-24" },
  { id: "PTZ-1012", productId: 11, qty: 2, channel: "delivery", status: "in_transit", placedAt: "2026-02-24" }
];
