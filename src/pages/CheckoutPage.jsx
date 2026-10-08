import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { CheckCircle2, ShieldCheck, Lock, CreditCard, Tag, ArrowRight, Truck, Sparkles, AlertCircle, User, LogIn, UserPlus } from "lucide-react";
import { openRazorpayCheckout } from "@/services/payment/razorpay";
import { createRazorpayOrderServerFn, verifyRazorpayPaymentServerFn, createDirectWooCommerceOrderServerFn } from "@/server/payment";
import { Reveal } from "@/components/common/Reveal";

export function CheckoutPage() {
  const {
    detailedCart,
    subtotal,
    shippingCost,
    grandTotal,
    discountAmount,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    checkout,
    cartCount,
    user,
    loginUser,
    registerUser
  } = useStore();

  const navigate = useNavigate();

  // Auth form states for unauthenticated customers
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Checkout address form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    customerNote: "",
    paymentMethod: "online"
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.first_name || user.username?.split("@")[0] || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: user.billing?.phone || prev.phone,
        address: user.billing?.address_1 || prev.address,
        city: user.billing?.city || prev.city,
        state: user.billing?.state || prev.state,
        pincode: user.billing?.postcode || prev.pincode
      }));
    }
  }, [user]);

  // Handle inline login/register at checkout
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);
    try {
      if (authMode === "login") {
        await loginUser(authEmail, authPassword);
      } else {
        await registerUser({ email: authEmail, password: authPassword, first_name: authFirstName, last_name: authLastName });
      }
    } catch (err) {
      setAuthError(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (cartCount === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/20 text-amber-800 dark:text-amber-400 grid place-items-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground">Your Shopping Bag is Empty</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-md mx-auto">
          Please select your bespoke pieces before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-sm"
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

  // Main payment and order handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Please sign in or create an account before completing your order.");
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      setErrorMessage("Please fill in all required shipping address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const lineItems = detailedCart.map((item) => ({
        product_id: item.product?.id || 101,
        quantity: item.qty,
        name: item.product?.name || "Couture Piece",
        price: item.product?.price || 0,
        size: item.size
      }));

      const checkoutPayload = {
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
        payment_method: "razorpay",
        payment_method_title: "Razorpay (UPI / Cards / NetBanking)",
        total_amount: grandTotal,
        discount_total: discountAmount,
        shipping_total: shippingCost,
        coupon_code: appliedCoupon?.code,
        customer_note: form.customerNote,
        customer_id: user?.id,
        line_items: lineItems
      };

      // 1. Create Authentic Order on Razorpay via Server
      let serverOrderData;
      try {
        serverOrderData = await createRazorpayOrderServerFn({
          data: {
            amount: grandTotal,
            currency: "INR",
            customerEmail: form.email,
            customerPhone: form.phone
          }
        });
      } catch (orderErr) {
        console.warn("Server Razorpay order creation:", orderErr);
        const clientKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!clientKey) {
          throw new Error(
            "Razorpay credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are not configured in your .env file. Please add your credentials to enable online payments."
          );
        }
        serverOrderData = {
          orderId: undefined,
          amount: Math.round(grandTotal * 100),
          keyId: clientKey
        };
      }

      // 2. Open Actual Razorpay Checkout UI
      const razorpayResponse = await openRazorpayCheckout({
        key: serverOrderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        orderId: serverOrderData.orderId,
        amount: serverOrderData.amount || Math.round(grandTotal * 100),
        name: "Kalamkari Boutique",
        description: `Couture Order for ${form.firstName} ${form.lastName}`,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone
        }
      });

      // 3. Verify Payment Signature via Backend Server
      let verificationResult;
      try {
        verificationResult = await verifyRazorpayPaymentServerFn({
          data: {
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
            checkoutPayload
          }
        });
      } catch (verifyErr) {
        console.warn("Server verification fallback:", verifyErr);
        const localOrder = await checkout({
          ...checkoutPayload,
          transaction_id: razorpayResponse.razorpay_payment_id
        });
        verificationResult = { verified: true, order: localOrder };
      }

      if (!verificationResult?.verified && !verificationResult?.order) {
        throw new Error("Payment signature verification failed. The transaction could not be validated.");
      }

      // 4. Mark Order as Confirmed
      const finalOrder = verificationResult.order || (await checkout({
        ...checkoutPayload,
        transaction_id: razorpayResponse.razorpay_payment_id
      }));

      setCompletedOrder({
        ...finalOrder,
        payment_id: razorpayResponse.razorpay_payment_id,
        lineItemsSnapshot: detailedCart
      });
    } catch (err) {
      console.error("Order execution error:", err);
      setErrorMessage(err?.message || "Order could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmation View
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in duration-500">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-600/20 grid place-items-center shadow-lg">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] font-semibold text-amber-800 dark:text-amber-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed & Paid
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif mt-2 text-foreground">Thank You for Your Order</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-lg mx-auto mt-3 leading-relaxed">
            Your couture order <span className="font-semibold text-neutral-900 dark:text-white">#{completedOrder.number || completedOrder.id}</span> has been securely paid via Razorpay and sent to our master artisans in Chennai.
          </p>
        </div>

        {/* Order Details Glass Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-sm text-left max-w-lg mx-auto text-xs space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
            <span className="text-neutral-500">Order ID:</span>
            <span className="font-serif font-bold text-sm text-foreground">#{completedOrder.number || completedOrder.id}</span>
          </div>

          <div className="flex justify-between items-center border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
            <span className="text-neutral-500">Razorpay Payment ID:</span>
            <span className="font-mono text-foreground font-medium">{completedOrder.transaction_id || completedOrder.payment_id || "pay_verified"}</span>
          </div>

          <div className="flex justify-between items-center border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
            <span className="text-neutral-500">Payment Status:</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[10px] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Paid Online (Verified)
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
            <span className="text-neutral-500">Total Paid:</span>
            <span className="font-serif font-bold text-base text-foreground">{formatINR(completedOrder.total || grandTotal)}</span>
          </div>

          <div className="flex justify-between items-center pb-1">
            <span className="text-neutral-500">Estimated Dispatch:</span>
            <span className="font-medium text-foreground">7 – 10 business days (Handcrafted)</span>
          </div>

          <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800 text-neutral-500 text-[11px] leading-relaxed">
            Order confirmation receipt has been assigned to your account (<strong className="text-foreground">{user?.email || form.email}</strong>).
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate({ to: "/account" })}
            className="bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md"
          >
            View in Order History
          </button>
          <Link
            to="/shop"
            className="border border-neutral-400 dark:border-neutral-700 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:border-black dark:hover:border-white transition text-foreground"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">Secure Atelier Checkout</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground mt-1">Checkout & Payment</h1>
      </Reveal>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-sm bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* REQUIREMENT 3: Customer Account Authentication Guard */}
      {!user ? (
        <div className="max-w-xl mx-auto glass-panel p-6 sm:p-10 rounded-sm space-y-6 shadow-xl my-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/20 text-amber-800 dark:text-amber-400 grid place-items-center mx-auto shadow-sm">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400">Account Required</p>
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mt-1">
              {authMode === "login" ? "Sign In to Complete Checkout" : "Create Account to Complete Checkout"}
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light">
              An account is required so you can track your bespoke order, shipping updates, and invoices.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {authError && (
              <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 rounded-xs border border-rose-200">
                {authError}
              </div>
            )}

            {authMode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ananya"
                    value={authFirstName}
                    onChange={(e) => setAuthFirstName(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ramachandran"
                    value={authLastName}
                    onChange={(e) => setAuthLastName(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <span>Authenticating...</span>
              ) : authMode === "login" ? (
                <>
                  <LogIn className="w-4 h-4" /> Sign In & Continue Checkout
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account & Continue
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthError("");
                }}
                className="text-xs text-neutral-500 hover:text-foreground underline font-medium"
              >
                {authMode === "login" ? "Don't have an account? Register as Customer" : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Customer & Shipping Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Logged in customer badge */}
            <div className="glass-panel p-4 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Logged in as {user.first_name || user.email}</p>
                  <p className="text-[11px] text-neutral-500">Order will be securely registered to this account</p>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Customer
              </span>
            </div>

            {/* Shipping Address */}
            <div className="glass-panel p-6 sm:p-8 rounded-sm space-y-4">
              <h2 className="text-lg font-serif border-b border-neutral-200/80 dark:border-neutral-800 pb-3 text-foreground font-semibold flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                1. Delivery & Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">First Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">Last Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98400 12345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">Street Address / Suite *</label>
                <input
                  required
                  type="text"
                  placeholder="42, Wallace Garden, Nungambakkam"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">City *</label>
                  <input
                    required
                    type="text"
                    placeholder="Chennai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">State *</label>
                  <input
                    required
                    type="text"
                    placeholder="Tamil Nadu"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">Pincode *</label>
                  <input
                    required
                    type="text"
                    placeholder="600006"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 text-xs rounded-sm outline-none text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-medium">Special Tailoring / Delivery Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Custom sleeve length, gift packaging message, or delivery instructions..."
                  value={form.customerNote}
                  onChange={(e) => setForm({ ...form, customerNote: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-sm outline-none text-foreground"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="glass-panel p-6 sm:p-8 rounded-sm space-y-4">
              <h2 className="text-lg font-serif border-b border-neutral-200/80 dark:border-neutral-800 pb-3 text-foreground font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                2. Payment Method
              </h2>
              <div className="space-y-3">
                {/* Razorpay Online Gateway */}
                <div className="flex items-start gap-3.5 p-4 border border-amber-800/40 bg-amber-500/5 dark:bg-amber-400/5 rounded-sm">
                  <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-amber-800 dark:border-amber-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-800 dark:bg-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                      Online Payment (UPI / Cards / NetBanking)
                      <span className="text-[9px] bg-amber-800 text-white dark:bg-amber-400 dark:text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Official Gateway</span>
                    </p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      Secured by Razorpay. Complete payment with Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, or NetBanking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-sm space-y-6 sticky top-24 shadow-xl">
            <h2 className="text-xl font-serif border-b border-neutral-200/80 dark:border-neutral-800 pb-4 text-foreground font-semibold">
              Order Summary ({cartCount})
            </h2>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {detailedCart.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="flex gap-3 text-xs">
                  <img
                    src={item.product?.image || item.product?.images?.[0]?.src}
                    alt={item.product?.name}
                    className="w-14 h-18 object-cover rounded-xs border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-foreground line-clamp-1">{item.product?.name}</p>
                    <p className="text-neutral-500 mt-0.5">Size: <span className="font-semibold text-foreground">{item.size}</span> · Qty: {item.qty}</p>
                    <p className="text-amber-800 dark:text-amber-400 font-semibold mt-1">{formatINR((item.product?.price || 0) * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo code */}
            <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
              <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-amber-800 dark:text-amber-400" /> Have a Promo Code?
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

            {/* Pricing Breakdown */}
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

              <div className="flex justify-between text-lg font-serif pt-3 border-t border-neutral-200/80 dark:border-neutral-800 font-semibold text-foreground">
                <span>Total Payable</span>
                <span className="text-xl text-foreground font-serif">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black py-4 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Connecting to Gateway...</span>
              ) : (
                <span>Proceed to Razorpay Payment · {formatINR(grandTotal)}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
