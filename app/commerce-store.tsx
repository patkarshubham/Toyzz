"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { pushCartActivityToAdmin } from "@/app/lib/admin-live-orders";
import { toyProducts } from "@/app/data/toys";
import { toToyProducts } from "@/app/lib/catalog-normalizer";

type Address = {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

type DeliveryCheck = {
  checked: boolean;
  isServiceable: boolean;
  message: string;
  eta: string;
};

type CommerceContextType = {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  loadingUser: boolean;
  refreshUserState: () => Promise<void>;
  logoutUser: () => Promise<void>;
  cart: Record<number, number>;
  wishlist: number[];
  address: Address;
  delivery: DeliveryCheck;
  cartCount: number;
  wishlistCount: number;
  addToCart: (id: number) => void;
  updateCartQty: (id: number, diff: number) => void;
  removeFromCart: (id: number) => void;
  toggleWishlist: (id: number) => void;
  moveWishlistToCart: (id: number) => void;
  setAddressField: (field: keyof Address, value: string) => void;
  checkPincode: (pincode: string) => void;
  placeOrder: () => Promise<{ ok: boolean; message: string }>;
};

const initialAddress: Address = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

const initialDelivery: DeliveryCheck = {
  checked: false,
  isServiceable: false,
  message: "Check pincode to see delivery availability.",
  eta: "",
};

const CommerceContext = createContext<CommerceContextType | null>(null);

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CommerceContextType["user"]>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [address, setAddress] = useState<Address>(initialAddress);
  const [delivery, setDelivery] = useState<DeliveryCheck>(initialDelivery);

  const refreshUserState = async () => {
    setLoadingUser(true);
    try {
      const response = await fetch("/api/user/state", { cache: "no-store" });
      if (!response.ok) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const payload = await response.json();
      if (!payload?.success) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const serverUser = payload?.data?.user;
      setUser(
        serverUser
          ? {
              id: String(serverUser.id),
              name: String(serverUser.name || ""),
              email: String(serverUser.email || ""),
              phone: String(serverUser.phone || ""),
            }
          : null,
      );

      const serverWishlist = Array.isArray(payload?.data?.wishlist)
        ? payload.data.wishlist
            .map((item: unknown) => Number(item))
            .filter((item: number) => item > 0)
        : [];
      setWishlist(serverWishlist);

      const serverCart = Array.isArray(payload?.data?.cart)
        ? payload.data.cart.reduce(
            (acc: Record<number, number>, item: { productId?: number; qty?: number }) => {
              const id = Number(item.productId || 0);
              const qty = Number(item.qty || 0);
              if (id > 0 && qty > 0) acc[id] = qty;
              return acc;
            },
            {},
          )
        : {};
      setCart(serverCart);

      const addresses = Array.isArray(payload?.data?.addresses)
        ? payload.data.addresses
        : [];
      const primaryAddress =
        addresses.find((item: { isDefault?: boolean }) => item.isDefault) ||
        addresses[0];
      if (primaryAddress) {
        setAddress({
          fullName: String(primaryAddress.fullName || ""),
          email: String(serverUser?.email || ""),
          phone: String(primaryAddress.phone || ""),
          line1: String(primaryAddress.line1 || ""),
          line2: String(primaryAddress.line2 || ""),
          city: String(primaryAddress.city || ""),
          state: String(primaryAddress.state || ""),
          pincode: String(primaryAddress.pincode || ""),
        });
      }
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    refreshUserState();
  }, []);

  useEffect(() => {
    if (user) return;
    const raw = localStorage.getItem("pinetoyzz-commerce");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        cart?: Record<number, number>;
        wishlist?: number[];
        address?: Address;
      };
      if (parsed.cart) setCart(parsed.cart);
      if (parsed.wishlist) setWishlist(parsed.wishlist);
      if (parsed.address) setAddress(parsed.address);
    } catch {
      // Ignore invalid local storage data.
    }
  }, [user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem(
      "pinetoyzz-commerce",
      JSON.stringify({ cart, wishlist, address }),
    );
  }, [address, cart, user, wishlist]);

  useEffect(() => {
    if (!user) return;

    const timer = window.setTimeout(async () => {
      const addresses =
        address.fullName &&
        address.phone &&
        address.line1 &&
        address.city &&
        address.state &&
        address.pincode
          ? [
              {
                id: "primary",
                label: "Home",
                fullName: address.fullName,
                phone: address.phone,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                isDefault: true,
              },
            ]
          : [];

      const cartArray = Object.entries(cart).map(([productId, qty]) => ({
        productId: Number(productId),
        qty: Number(qty),
      }));

      await fetch("/api/user/state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishlist,
          cart: cartArray,
          addresses,
        }),
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [address, cart, user, wishlist]);

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    pushCartActivityToAdmin(id, 1);
  };

  const updateCartQty = (id: number, diff: number) => {
    setCart((prev) => {
      const next = (prev[id] || 0) + diff;
      if (next <= 0) {
        const { [id]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
    if (diff > 0) {
      pushCartActivityToAdmin(id, diff);
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const moveWishlistToCart = (id: number) => {
    addToCart(id);
    setWishlist((prev) => prev.filter((item) => item !== id));
  };

  const setAddressField = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));

    if (field === "pincode") {
      setDelivery(initialDelivery);
    }
  };

  const checkPincode = (pincode: string) => {
    const value = pincode.trim();
    if (!/^\d{6}$/.test(value)) {
      setDelivery({
        checked: true,
        isServiceable: false,
        message: "Please enter a valid 6-digit pincode.",
        eta: "",
      });
      return;
    }

    const serviceablePrefixes = ["110", "122", "201", "302", "400", "411", "500", "560", "600", "700"];
    const prefix = value.slice(0, 3);

    if (!serviceablePrefixes.includes(prefix)) {
      setDelivery({
        checked: true,
        isServiceable: false,
        message: "Delivery is not available for this pincode yet.",
        eta: "",
      });
      return;
    }

    const etaDays = Number(value[value.length - 1]) % 2 === 0 ? 2 : 4;
    setDelivery({
      checked: true,
      isServiceable: true,
      message: "Great news! Delivery is available.",
      eta: `${etaDays}-${etaDays + 1} days`,
    });
  };

  const placeOrder = async () => {
    if (!Object.keys(cart).length) {
      return { ok: false, message: "Your cart is empty." };
    }

    if (
      !address.fullName ||
      !address.email ||
      !address.phone ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      return { ok: false, message: "Please complete your address details." };
    }

    if (!delivery.checked || !delivery.isServiceable) {
      return { ok: false, message: "Please check a valid serviceable pincode." };
    }

    if (!user) {
      return {
        ok: false,
        message: "Please sign in to place your order.",
      };
    }

    try {
      let catalog = toyProducts;
      try {
        const catalogResponse = await fetch("/api/products", { cache: "no-store" });
        const catalogPayload = await catalogResponse.json();
        if (catalogResponse.ok && Array.isArray(catalogPayload?.data)) {
          catalog = toToyProducts(catalogPayload.data);
        }
      } catch {
        catalog = toyProducts;
      }

      const items = Object.entries(cart).map(([id, qty]) => {
        const productId = Number(id);
        const matched = catalog.find((item) => item.id === productId);
        return {
          productId,
          slug: matched?.slug || `toy-${productId}`,
          name: matched?.name || `Toy #${productId}`,
          qty: Number(qty),
          price: matched?.offerPrice || matched?.mrp || 1,
        };
      });

      const response = await fetch("/api/user/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: {
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        return {
          ok: false,
          message: String(payload?.message || "Unable to place order."),
        };
      }
    } catch {
      return {
        ok: false,
        message: "Network issue while placing order. Please try again.",
      };
    }

    setCart({});
    setWishlist([]);
    setAddress(initialAddress);
    setDelivery(initialDelivery);
    return { ok: true, message: "Order placed successfully. Happy shopping!" };
  };

  const logoutUser = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart],
  );

  const wishlistCount = wishlist.length;

  const value: CommerceContextType = {
    user,
    loadingUser,
    refreshUserState,
    logoutUser,
    cart,
    wishlist,
    address,
    delivery,
    cartCount,
    wishlistCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    toggleWishlist,
    moveWishlistToCart,
    setAddressField,
    checkPincode,
    placeOrder,
  };

  return (
    <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerce must be used within CommerceProvider");
  }
  return context;
}
