import { useCallback, useEffect, useMemo, useState } from "react";
import { StoreContext } from "@/contexts/StoreContext";
import { DEFAULT_SETTINGS, ADMIN_PASSWORD, seedProducts } from "@/constants/seedCatalog";
import { wooProductService, normalizeWooProduct } from "@/services/woocommerce/products";
import { wooAuthService } from "@/services/woocommerce/auth";
import { wooCartService } from "@/services/woocommerce/cart";
import { wooOrderService } from "@/services/woocommerce/orders";
import { wooCheckoutService } from "@/services/woocommerce/checkout";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const STORAGE_KEY = "kalamkari_store_v2";

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => wooCartService.getLocalCart());
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState(() => seedProducts.map(normalizeWooProduct));
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState(() => wooOrderService.getLocalOrders());
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState(() => wooAuthService.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: 'KALAM5', discountPct: 5 }
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // 1. Initial product load from WooCommerce API (with instant seed fallback)
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const fetched = await wooProductService.getProducts({ per_page: 100 });
        if (isMounted && fetched && fetched.length > 0) {
          setProducts(fetched);
        }
      } catch (err) {
        console.warn("WooCommerce remote product fetch note:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  // 2. Load Local Storage Hydration on Client
  useEffect(() => {
    try {
      const raw = getStorageItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.wishlist && Array.isArray(parsed.wishlist)) setWishlist(parsed.wishlist);
        if (parsed.appliedCoupon) setAppliedCoupon(parsed.appliedCoupon);
        if (parsed.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed.settings,
            tagline: DEFAULT_SETTINGS.tagline,
            contact: {
              ...DEFAULT_SETTINGS.contact,
              ...(parsed.settings.contact ?? {})
            }
          });
        }
        if (parsed.adminUnlocked) setAdminUnlocked(true);
      }
    } catch (err) {
      console.error("Storage hydration error:", err);
    }
    setHydrated(true);
  }, []);

  // 3. Persist local changes on Client
  useEffect(() => {
    if (!hydrated) return;
    wooCartService.saveLocalCart(cart);
    const payload = { wishlist, settings, adminUnlocked, appliedCoupon };
    setStorageItem(STORAGE_KEY, JSON.stringify(payload));
  }, [cart, wishlist, settings, adminUnlocked, appliedCoupon, hydrated]);

  // Auth helper methods
  const loginUser = async (email, password) => {
    const res = await wooAuthService.login(email, password);
    setUser(res.user);
    const userOrders = await wooOrderService.getCustomerOrders(res.user.id);
    if (userOrders?.length) setOrders(userOrders);
    return res;
  };

  const registerUser = async (data) => {
    const newUser = await wooAuthService.register(data);
    setUser(newUser);
    return newUser;
  };

  const logoutUser = () => {
    wooAuthService.logout();
    setUser(null);
  };

  const resetContent = useCallback(() => {
    setProducts(seedProducts.map(normalizeWooProduct));
    setSettings(DEFAULT_SETTINGS);
    setOrders(wooOrderService.getLocalOrders());
  }, []);

  const applyCouponCode = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code.' };
    if (cleanCode === 'KALAM5' || cleanCode === 'KALAMKARI5') {
      const coupon = { code: cleanCode, discountPct: 5, description: '5% First Order Privilege' };
      setAppliedCoupon(coupon);
      return { success: true, message: 'Coupon KALAM5 applied (5% OFF)!' };
    }
    if (cleanCode === 'ROYAL10' || cleanCode === 'FESTIVE10') {
      const coupon = { code: cleanCode, discountPct: 10, description: '10% Festive Privilege' };
      setAppliedCoupon(coupon);
      return { success: true, message: `${cleanCode} applied (10% OFF)!` };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const value = useMemo(() => {
    const detailedCart = cart.map((c) => {
      const product = products.find((p) => p.slug === c.slug || String(p.id) === String(c.slug));
      return product ? { ...c, product } : null;
    }).filter(Boolean);

    const subtotal = detailedCart.reduce((s, i) => s + (i.product.price || 0) * i.qty, 0);
    const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPct) / 100) : 0;
    const shippingCost = subtotal > 4999 || subtotal === 0 ? 0 : 450;
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

    return {
      cart,
      wishlist,
      products,
      loading,
      user,
      loginUser,
      registerUser,
      logoutUser,
      appliedCoupon,
      discountAmount,
      applyCouponCode,
      removeCoupon,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      openCartDrawer: () => setIsCartDrawerOpen(true),
      closeCartDrawer: () => setIsCartDrawerOpen(false),

      addToCart: async (slug, size = "M", qty = 1, openDrawer = true) => {
        setCart((c) => {
          const idx = c.findIndex((x) => x.slug === slug && x.size === size);
          if (idx >= 0) {
            const copy = [...c];
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
            return copy;
          }
          return [...c, { slug, size, qty }];
        });

        if (openDrawer) {
          setIsCartDrawerOpen(true);
        }

        // Trigger WooCommerce Store API cart sync if configured
        const product = products.find(p => p.slug === slug || String(p.id) === String(slug));
        if (product && product.id) {
          await wooCartService.addItem(product.id, qty, size);
        }
      },

      removeFromCart: async (slug, size) => {
        setCart((c) => c.filter((x) => !(x.slug === slug && x.size === size)));
      },

      setQty: async (slug, size, qty) => {
        setCart((c) => c.map((x) => (x.slug === slug && x.size === size) ? { ...x, qty: Math.max(1, qty) } : x));
      },

      clearCart: () => setCart([]),

      toggleWishlist: (slug) => {
        setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]));
      },

      isWishlisted: (slug) => wishlist.includes(slug) || wishlist.includes(String(slug)),
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      wishlistCount: wishlist.length,
      subtotal,
      shippingCost,
      grandTotal,
      detailedCart,
      getProduct: (slug) => products.find((p) => p.slug === slug || String(p.id) === String(slug)),

      addProduct: async (p) => {
        const created = await wooProductService.createProduct(p);
        setProducts((list) => [created, ...list]);
      },

      updateProduct: async (slugOrId, patch) => {
        const updated = await wooProductService.updateProduct(slugOrId, patch);
        setProducts((list) => list.map((p) => (p.slug === slugOrId || String(p.id) === String(slugOrId)) ? { ...p, ...patch } : p));
      },

      removeProduct: async (slugOrId) => {
        await wooProductService.deleteProduct(slugOrId);
        setProducts((list) => list.filter((p) => p.slug !== slugOrId && String(p.id) !== String(slugOrId)));
      },

      checkout: async (checkoutPayload) => {
        const order = await wooCheckoutService.processCheckout(checkoutPayload);
        setOrders((os) => [order, ...os]);
        setCart([]);
        setAppliedCoupon(null);
        return order;
      },

      settings,
      updateSettings: (patch) => setSettings((s) => ({
        ...s,
        ...patch,
        contact: { ...s.contact, ...(patch.contact ?? {}) }
      })),

      orders,
      updateOrderStatus: async (id, status) => {
        await wooOrderService.updateOrderStatus(id, status);
        setOrders((os) => os.map((o) => (o.id === id || o.number === id) ? { ...o, status } : o));
      },

      adminUnlocked,
      unlockAdmin: (password) => {
        if (password === ADMIN_PASSWORD) {
          setAdminUnlocked(true);
          return true;
        }
        return false;
      },
      lockAdmin: () => setAdminUnlocked(false),
      resetContent
    };
  }, [cart, wishlist, products, loading, user, appliedCoupon, settings, orders, adminUnlocked, resetContent]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}
