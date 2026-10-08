import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";

export function CartDrawer({ isOpen, onClose }) {
  const { detailedCart, subtotal, shippingCost, grandTotal, setQty, removeFromCart, cartCount } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const freeShippingThreshold = 4999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-[440px] bg-[#F7F3EC] dark:bg-[#102B24] text-neutral-900 dark:text-[#F7F3EC] border-l border-neutral-300 dark:border-neutral-800 shadow-2xl flex flex-col justify-between h-full h-[100dvh] animate-in slide-in-from-right duration-300 z-10 relative">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-[#F7F3EC] dark:bg-[#102B24]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 grid place-items-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Your Shopping Bag</h2>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">{cartCount} bespoke item(s)</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-2.5 rounded-full hover:bg-neutral-200/80 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Meter */}
          <div className="px-4 sm:px-5 py-3 bg-amber-500/10 dark:bg-amber-400/10 border-b border-amber-800/15 dark:border-amber-400/15 text-xs shrink-0">
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-foreground">
                <Truck className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                {amountLeftForFreeShipping === 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Complimentary Shipping Unlocked!</span>
                ) : (
                  <span>Add <strong className="text-foreground">{formatINR(amountLeftForFreeShipping)}</strong> for Complimentary Shipping</span>
                )}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400 font-mono text-[10px] font-semibold">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-700 to-[#B85C2D] transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-neutral-200 dark:divide-neutral-800 overscroll-contain">
            {detailedCart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
                <p className="font-serif text-lg text-foreground">Your bag is currently empty</p>
                <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
                  Explore our curated bridal edits, raw silk Anarkalis, and recreation drapes.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate({ to: "/shop" });
                  }}
                  className="mt-4 inline-block bg-[#102B24] text-[#F7F3EC] dark:bg-amber-400 dark:text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#16382f] transition shadow-sm min-h-[44px]"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              detailedCart.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="pt-4 first:pt-0 flex gap-3.5 text-xs">
                  <img
                    src={item.product?.image || item.product?.images?.[0]?.src}
                    alt={item.product?.name}
                    className="w-20 h-26 object-cover rounded-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          onClick={onClose}
                          className="font-serif font-medium text-foreground hover:text-amber-800 dark:hover:text-amber-400 transition line-clamp-2 text-sm"
                        >
                          {item.product?.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.slug, item.size)}
                          aria-label="Remove item"
                          className="text-neutral-400 hover:text-rose-600 transition p-1.5 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Size: <span className="font-semibold text-foreground">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xs bg-white dark:bg-neutral-900 shadow-xs">
                        <button
                          onClick={() => setQty(item.slug, item.size, Math.max(1, item.qty - 1))}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-semibold text-foreground text-xs">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="font-serif font-bold text-sm text-[#102B24] dark:text-amber-400">
                        {formatINR((item.product?.price || 0) * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {detailedCart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-[#EFE9DF] dark:bg-[#0B1713] space-y-3 shrink-0">
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="font-bold text-foreground font-serif text-base">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {shippingCost === 0 ? "Complimentary" : formatINR(shippingCost)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate({ to: "/cart" });
                  }}
                  className="w-full border border-neutral-400 dark:border-neutral-700 py-3 text-xs uppercase tracking-widest font-semibold hover:border-black dark:hover:border-white transition text-foreground min-h-[44px] bg-white/40 dark:bg-neutral-800/40"
                >
                  View Full Bag
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate({ to: "/checkout" });
                  }}
                  className="w-full bg-[#102B24] text-[#F7F3EC] dark:bg-amber-400 dark:text-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#16382f] transition shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span>Checkout</span> <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>256-Bit SSL Encrypted & Verified Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
