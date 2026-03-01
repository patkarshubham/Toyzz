"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCommerce } from "@/app/commerce-store";
import { toyProducts } from "@/app/data/toys";

type AccountAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type AccountOrder = {
  id: string;
  orderNo: string;
  total: number;
  itemCount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
};

const emptyAddress: AccountAddress = {
  id: "",
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function ProfilePage() {
  const { user, loadingUser, cart, wishlist, refreshUserState, logoutUser } =
    useCommerce();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addressForm, setAddressForm] = useState<AccountAddress>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const cartItems = useMemo(
    () =>
      toyProducts
        .filter((item) => cart[item.id])
        .map((item) => ({ ...item, qty: cart[item.id] })),
    [cart],
  );
  const wishlistItems = useMemo(
    () => toyProducts.filter((item) => wishlist.includes(item.id)),
    [wishlist],
  );

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const response = await fetch("/api/user/state", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload?.success) return;

      const serverUser = payload?.data?.user;
      setName(String(serverUser?.name || ""));
      setPhone(String(serverUser?.phone || ""));
      setAddresses(
        Array.isArray(payload?.data?.addresses) ? payload.data.addresses : [],
      );
      setOrders(Array.isArray(payload?.data?.orders) ? payload.data.orders : []);
    };
    load();
  }, [user]);

  if (loadingUser) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-2xl border border-[#e6d5bf] bg-white p-4 text-sm font-semibold text-slate-700">
          Loading account...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-3xl border border-[#e6d5bf] bg-white p-8">
          <h1 className="text-3xl font-black text-slate-900">Account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Login to access profile, address book, wishlist, cart and orders.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl bg-[#8a4f2b] px-4 py-2 text-sm font-semibold text-white"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl border border-[#8a4f2b] px-4 py-2 text-sm font-semibold text-[#8a4f2b]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const saveAll = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/user/state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, addresses }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        setMessage(String(payload?.message || "Unable to save account details."));
      } else {
        setMessage("Account details updated successfully.");
        await refreshUserState();
      }
    } catch {
      setMessage("Network issue while saving account details.");
    } finally {
      setSaving(false);
    }
  };

  const upsertAddress = () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.line1 ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.pincode
    ) {
      setMessage("Please complete required fields for address.");
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === editingAddressId
            ? { ...addressForm, id: editingAddressId, isDefault: item.isDefault }
            : item,
        ),
      );
      setEditingAddressId(null);
      setMessage("Address updated in draft. Click Save All.");
    } else {
      const next: AccountAddress = {
        ...addressForm,
        id: `${Date.now()}`,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, next]);
      setMessage("Address added in draft. Click Save All.");
    }

    setAddressForm(emptyAddress);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="mb-6 rounded-3xl border border-[#e5ceb2] bg-[linear-gradient(130deg,#fff8f0,#f6e4d0)] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
              Customer Account
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
              Hello, {name || user.name}
            </h1>
            <p className="mt-1 text-sm text-slate-700">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveAll}
              disabled={saving}
              className="rounded-xl bg-[#8a4f2b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save All"}
            </button>
            <button
              onClick={async () => {
                await logoutUser();
                window.location.href = "/";
              }}
              className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e0c3a0] bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Orders</p>
            <p className="text-2xl font-black text-slate-900">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-[#e0c3a0] bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Wishlist</p>
            <p className="text-2xl font-black text-slate-900">{wishlistItems.length}</p>
          </div>
          <div className="rounded-2xl border border-[#e0c3a0] bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Cart Items</p>
            <p className="text-2xl font-black text-slate-900">{cartItems.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5">
            <h2 className="text-xl font-black text-slate-900">Profile Details</h2>
            <div className="mt-3 grid gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
            </div>
          </article>

          <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5">
            <h2 className="text-xl font-black text-slate-900">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="mt-3 grid gap-2">
              <input
                value={addressForm.label}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, label: event.target.value }))
                }
                placeholder="Label (Home/Office)"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
              <input
                value={addressForm.fullName}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
                placeholder="Full name"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
              <input
                value={addressForm.phone}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="Phone"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
              <input
                value={addressForm.line1}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, line1: event.target.value }))
                }
                placeholder="Address line 1"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
              <input
                value={addressForm.line2}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, line2: event.target.value }))
                }
                placeholder="Address line 2"
                className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
              />
              <div className="grid gap-2 sm:grid-cols-3">
                <input
                  value={addressForm.city}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, city: event.target.value }))
                  }
                  placeholder="City"
                  className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
                />
                <input
                  value={addressForm.state}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, state: event.target.value }))
                  }
                  placeholder="State"
                  className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
                />
                <input
                  value={addressForm.pincode}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, pincode: event.target.value }))
                  }
                  placeholder="Pincode"
                  className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={upsertAddress}
                  className="rounded-xl border border-[#8a4f2b] px-4 py-2 text-sm font-semibold text-[#8a4f2b]"
                >
                  {editingAddressId ? "Update Address" : "Add Address"}
                </button>
                {editingAddressId && (
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressForm(emptyAddress);
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5">
            <h2 className="text-xl font-black text-slate-900">Saved Addresses</h2>
            <div className="mt-3 space-y-2 text-sm">
              {addresses.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#eee0cf] bg-[#fff9f2] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {item.label} {item.isDefault ? "(Default)" : ""}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => {
                          setEditingAddressId(item.id);
                          setAddressForm(item);
                        }}
                        className="font-semibold text-[#8a4f2b] underline"
                      >
                        Edit
                      </button>
                      {!item.isDefault && (
                        <button
                          onClick={() =>
                            setAddresses((prev) =>
                              prev.map((entry) => ({
                                ...entry,
                                isDefault: entry.id === item.id,
                              })),
                            )
                          }
                          className="font-semibold text-slate-700 underline"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setAddresses((prev) => prev.filter((entry) => entry.id !== item.id))
                        }
                        className="font-semibold text-red-700 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-slate-700">
                    {item.fullName}, {item.phone}, {item.line1}, {item.city}, {item.state} - {item.pincode}
                  </p>
                </div>
              ))}
              {!addresses.length && (
                <p className="text-slate-600">No addresses added. Add address from left panel.</p>
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5">
            <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
            <div className="mt-3 overflow-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#f0e2d1] text-xs uppercase text-slate-500">
                    <th className="pb-2">Order No</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#f6ebde]">
                      <td className="py-2 font-semibold text-[#8a4f2b]">{order.orderNo}</td>
                      <td className="py-2">{order.itemCount}</td>
                      <td className="py-2">Rs. {order.total}</td>
                      <td className="py-2 capitalize">{order.orderStatus.replaceAll("_", " ")}</td>
                      <td className="py-2">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                  {!orders.length && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-600">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e6d5bf] bg-white p-4">
              <h3 className="text-base font-black text-slate-900">Wishlist</h3>
              <div className="mt-2 space-y-2 text-sm">
                {wishlistItems.slice(0, 4).map((item) => (
                  <Link key={item.id} href={`/shop/${item.slug}`} className="block rounded-lg bg-[#fff7ee] p-2">
                    {item.name}
                  </Link>
                ))}
                {!wishlistItems.length && <p className="text-slate-600">No wishlist items.</p>}
              </div>
            </article>
            <article className="rounded-2xl border border-[#e6d5bf] bg-white p-4">
              <h3 className="text-base font-black text-slate-900">Cart Items</h3>
              <div className="mt-2 space-y-2 text-sm">
                {cartItems.slice(0, 4).map((item) => (
                  <Link key={item.id} href={`/shop/${item.slug}`} className="block rounded-lg bg-[#fff7ee] p-2">
                    {item.name} x {item.qty}
                  </Link>
                ))}
                {!cartItems.length && <p className="text-slate-600">No cart items.</p>}
              </div>
            </article>
          </div>
        </div>
      </section>

      {message && (
        <p className="mt-4 rounded-xl bg-[#fff0dc] px-3 py-2 text-sm font-semibold text-[#8a4f2b]">
          {message}
        </p>
      )}
    </main>
  );
}
