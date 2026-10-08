import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { Reveal } from "@/components/common/Reveal";

export function CartPage() {
  const {
    detailedCart,
    removeFromCart,
    setQty,
    subtotal,
    shippingCost,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    cartCount
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState(null);

  if (cartCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/20 text-amber-800 dark:text-amber-400 grid place-items-center mb-6 shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">Atelier Bag</p>
        <h1 className="text-3xl sm:text-4xl font-serif mt-2 text-foreground">Your Shopping Bag is Empty</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
          Explore our signature edit of handcrafted drapes, raw silk Anarkalis, and heirloom lehengas.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponFeedback(null);
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput("");
  };

  const freeShippingThreshold = 4999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">Your Selection</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground mt-1">Shopping Bag ({cartCount})</h1>
      </Reveal>

      {/* Free shipping progress bar */}
      <div className="glass-panel p-4 rounded-sm mb-8">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                You qualify for Complimentary Delivery across India!
              </span>
            ) : (
              <span>
                Add <strong className="text-foreground">{formatINR(freeShippingThreshold - subtotal)}</strong> more for <strong>FREE shipping</strong>
              </span>
            )}
          </span>
          <span className="text-neutral-500 font-medium">{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {detailedCart.map((item) => (
            <div
              key={`${item.slug}-${item.size}`}
              className="glass-card p-4 sm:p-6 rounded-sm flex gap-4 sm:gap-6 items-center"
            >
              <img
                src={item.product?.image || item.product?.images?.[0]?.src}
                alt={item.product?.name}
                className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">{item.product?.category}</p>
                <Link
                  to="/product/$slug"
                  params={{ slug: item.slug }}
                  className="font-serif text-base sm:text-lg text-foreground hover:text-amber-800 dark:hover:text-amber-400 transition line-clamp-1 font-medium"
                >
                  {item.product?.name}
                </Link>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Size: <span className="font-semibold text-foreground">{item.size}</span>
                </p>

                <div className="flex items-center gap-4 pt-3">
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xs bg-white/50 dark:bg-neutral-900/50">
                    <button
                      onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                      className="px-2.5 py-1 text-xs hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-foreground">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.slug, item.size)}
                    className="text-xs text-neutral-400 hover:text-rose-600 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-right font-serif text-lg font-semibold text-foreground whitespace-nowrap">
                {formatINR((item.product?.price || 0) * item.qty)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary right sidebar */}
        <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-sm space-y-6 sticky top-24 shadow-xl">
          <h2 className="text-xl font-serif border-b border-neutral-200/80 dark:border-neutral-800 pb-4 text-foreground font-semibold">
            Order Summary
          </h2>

          {/* Promo code */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-amber-800 dark:text-amber-400" /> Apply Promo Code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/30 rounded-xs text-xs">
                <div>
                  <span className="font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wider">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-neutral-500 ml-2">({appliedCoupon.discountPct}% OFF)</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline text-[11px] font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. KALAM5"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 glass-input px-3 py-2 text-xs rounded-xs outline-none uppercase font-medium text-foreground"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-neutral-800 transition"
                >
                  Apply
                </button>
              </div>
            )}
            {couponFeedback && (
              <p className={`text-[11px] mt-1.5 ${couponFeedback.success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                {couponFeedback.message}
              </p>
            )}
          </div>

          <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{formatINR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-amber-800 dark:text-amber-400 font-medium">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>- {formatINR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Estimated Shipping</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {shippingCost === 0 ? "Complimentary" : formatINR(shippingCost)}
              </span>
            </div>

            <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-3 flex justify-between items-baseline">
              <span className="font-serif text-lg text-foreground font-semibold">Total</span>
              <span className="font-serif text-2xl font-semibold text-foreground">{formatINR(grandTotal)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black py-4 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition flex items-center justify-center gap-2 shadow-lg"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
