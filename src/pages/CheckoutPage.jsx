import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { CheckCircle2, ShieldCheck, Lock } from "lucide-react";

export function CheckoutPage() {
  const { detailedCart, subtotal, checkout, cartCount } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "Ananya",
    lastName: "Ramachandran",
    email: "ananya@example.com",
    phone: "+91 98400 12345",
    address: "42, Wallace Garden, Nungambakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600006",
    paymentMethod: "online"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (cartCount === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif">Your Bag is Empty</h1>
        <p className="mt-2 text-neutral-500">Please add items to your cart before checking out.</p>
      </div>
    );
  }

  const shippingCost = subtotal > 4999 ? 0 : 450;
  const grandTotal = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        billing: {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          address_1: form.address,
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: "IN"
        },
        shipping: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address,
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: "IN"
        },
        payment_method: form.paymentMethod,
        payment_method_title: "Online Payment (UPI/Cards)",
        line_items: detailedCart.map((item) => ({
          product_id: item.product?.id || 101,
          quantity: item.qty
        }))
      };

      const order = await checkout(payload);
      setCompletedOrder(order);
    } catch (err) {
      console.error("Checkout processing error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 grid place-items-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">WooCommerce Order Confirmed</p>
        <h1 className="text-4xl font-serif">Thank You for Your Order</h1>
        <p className="text-sm text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
          Your order number <span className="font-semibold text-neutral-900 dark:text-white">#{completedOrder.number || completedOrder.id}</span> has been received and sent to our Chennai atelier.
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-sm text-left max-w-md mx-auto text-xs space-y-2 border border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between border-b pb-2">
            <span className="text-neutral-500">Order ID:</span>
            <span className="font-medium">#{completedOrder.number || completedOrder.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-neutral-500">Total Amount:</span>
            <span className="font-medium">{formatINR(grandTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Payment Status:</span>
            <span className="font-medium text-emerald-600 uppercase">Processing</span>
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/account" })}
          className="mt-6 inline-block bg-neutral-950 text-white px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-neutral-800 transition"
        >
          View Order History in Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-serif mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact & Shipping Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-lg font-serif border-b pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-800" />
              1. Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">First Name</label>
                <input
                  required
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">Last Name</label>
                <input
                  required
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-lg font-serif border-b pb-3">2. Shipping Address</h2>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">Street Address</label>
              <input
                required
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">City</label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">State</label>
                <input
                  required
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">Pincode</label>
                <input
                  required
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-lg font-serif border-b pb-3">3. Payment Gateway</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-amber-800/40 bg-amber-50/20 dark:bg-amber-950/20 rounded-sm cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={form.paymentMethod === "online"}
                  onChange={() => setForm({ ...form, paymentMethod: "online" })}
                  className="accent-amber-800"
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground">Online Payment Gateway (UPI / Cards / NetBanking)</p>
                  <p className="text-[11px] text-neutral-500">Fast & secure instant online payment via Razorpay / Cards / UPI</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900/60 p-6 sm:p-8 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-xl font-serif border-b border-neutral-200 dark:border-neutral-800 pb-4">Your Order</h2>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {detailedCart.map((item) => (
              <div key={`${item.slug}-${item.size}`} className="flex gap-3 text-xs">
                <img src={item.product?.image} alt="" className="w-12 h-16 object-cover rounded-sm" />
                <div className="flex-1">
                  <p className="font-serif font-medium">{item.product?.name}</p>
                  <p className="text-neutral-500">Size: {item.size} × {item.qty}</p>
                </div>
                <div className="font-serif font-semibold">{formatINR((item.product?.price || 0) * item.qty)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Shipping</span>
              <span className="text-emerald-600">{shippingCost === 0 ? "Complimentary" : formatINR(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-serif pt-2 border-t font-semibold">
              <span>Total</span>
              <span>{formatINR(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neutral-950 text-white dark:bg-white dark:text-black py-4 text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Processing Order..." : `Place Order · ${formatINR(grandTotal)}`}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>
      </form>
    </div>
  );
}
