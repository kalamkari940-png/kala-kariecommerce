import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";

export function CartPage() {
  const { detailedCart, removeFromCart, setQty, subtotal, cartCount } = useStore();

  if (cartCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 grid place-items-center mb-6">
          <ShoppingBag className="w-8 h-8 text-neutral-400" />
        </div>
        <h1 className="text-3xl font-serif">Your Shopping Bag is Empty</h1>
        <p className="mt-2 text-sm text-neutral-500 font-light">Explore our luxury collection of handcrafted couture.</p>
        <Link to="/shop" className="mt-8 inline-block bg-neutral-950 text-white px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-neutral-800 transition">
          Explore Collection
        </Link>
      </div>
    );
  }

  const shippingCost = subtotal > 4999 ? 0 : 450;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-serif mb-8">Shopping Bag ({cartCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-6">
          {detailedCart.map((item) => (
            <div
              key={`${item.slug}-${item.size}`}
              className="flex gap-4 sm:gap-6 p-4 sm:p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm items-center"
            >
              <img
                src={item.product?.image || item.product?.images?.[0]?.src}
                alt={item.product?.name}
                className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-sm bg-neutral-100"
              />

              <div className="flex-1 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-amber-800 font-medium">{item.product?.category}</p>
                <h3 className="font-serif text-lg text-neutral-900 dark:text-white line-clamp-1">{item.product?.name}</h3>
                <p className="text-xs text-neutral-500">Size: <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.size}</span></p>

                <div className="flex items-center gap-3 pt-3">
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-sm">
                    <button
                      onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                      className="px-2.5 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-medium">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.slug, item.size)}
                    className="text-xs text-neutral-400 hover:text-rose-500 transition flex items-center gap-1 ml-4"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-right font-serif text-lg font-semibold">
                {formatINR((item.product?.price || 0) * item.qty)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary right sidebar */}
        <div className="lg:col-span-4 bg-neutral-50 dark:bg-neutral-900/60 p-6 sm:p-8 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-xl font-serif border-b border-neutral-200 dark:border-neutral-800 pb-4">Order Summary</h2>

          <div className="space-y-3 text-sm font-light">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
              <span className="font-medium text-neutral-900 dark:text-white">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Estimated Shipping</span>
              <span className="font-medium text-emerald-600">
                {shippingCost === 0 ? "Complimentary" : formatINR(shippingCost)}
              </span>
            </div>
            {shippingCost > 0 && (
              <p className="text-[11px] text-amber-800 font-normal">Add {formatINR(5000 - subtotal)} more for FREE shipping!</p>
            )}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-baseline">
            <span className="font-serif text-lg">Total</span>
            <span className="font-serif text-2xl font-semibold">{formatINR(grandTotal)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-neutral-950 text-white dark:bg-white dark:text-black py-4 text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-lg"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
