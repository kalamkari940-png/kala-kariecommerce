import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { User, Package, Heart, LogOut, MapPin, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function AccountPage() {
  const { user, loginUser, registerUser, logoutUser, orders, wishlist, products } = useStore();

  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      if (authMode === "login") {
        await loginUser(email, password);
      } else {
        await registerUser({ email, password, first_name: firstName, last_name: lastName });
      }
    } catch (err) {
      setAuthError(err?.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <Reveal className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400">Atelier Portal</p>
          <h1 className="text-3xl sm:text-4xl font-serif mt-2 text-foreground">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light">
            Sign in to track your bespoke orders and manage shipping addresses.
          </p>
        </Reveal>

        <form onSubmit={handleAuthSubmit} className="glass-panel p-6 sm:p-8 rounded-sm space-y-4 shadow-xl">
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ramachandran"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input px-3 py-2 text-xs rounded-xs outline-none text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : authMode === "login" ? "Sign In" : "Register Account"}
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
              {authMode === "login" ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug) || wishlist.includes(String(p.id)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-neutral-200/80 dark:border-neutral-800 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400">Atelier Customer Account</p>
          <h1 className="text-3xl sm:text-4xl font-serif mt-1 text-foreground">Hello, {user.first_name || user.email}</h1>
        </div>
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-rose-600 transition border border-neutral-300 dark:border-neutral-700 px-4 py-2 rounded-xs glass-card"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Customer Profile Left Sidebar */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-sm space-y-6 shadow-md h-fit">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/20 text-amber-800 dark:text-amber-400 grid place-items-center shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <p className="font-serif font-bold text-lg text-foreground">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4 space-y-2 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-800 dark:text-amber-400" /> Default Shipping Address:
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light pl-6">
              {user.billing?.address_1 || "42, Wallace Garden, Nungambakkam"}<br />
              {user.billing?.city || "Chennai"}, {user.billing?.state || "Tamil Nadu"} {user.billing?.postcode || "600006"}<br />
              {user.billing?.phone && <span className="font-medium">Phone: {user.billing.phone}</span>}
            </p>
          </div>

          <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4 flex justify-between text-xs text-neutral-500">
            <span>Orders Placed: <strong className="text-foreground">{orders.length}</strong></span>
            <span>Saved Pieces: <strong className="text-foreground">{wishlistedProducts.length}</strong></span>
          </div>
        </div>

        {/* Orders & Wishlist right section */}
        <div className="lg:col-span-8 space-y-10">
          {/* Order History */}
          <div className="glass-panel p-6 sm:p-8 rounded-sm space-y-6 shadow-md">
            <h2 className="text-2xl font-serif text-foreground font-semibold flex items-center gap-2 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
              <Package className="w-5 h-5 text-amber-800 dark:text-amber-400" /> Order History ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-sm text-neutral-500 font-light py-4">No couture orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => {
                  const status = (o.status || "processing").toLowerCase();
                  const isPaid = o.needs_payment === false || o.date_paid || ["processing", "completed"].includes(status);
                  const isCompleted = status === "completed";
                  const isCancelled = ["cancelled", "failed", "refunded"].includes(status);

                  return (
                    <div
                      key={o.id || o.number}
                      className="p-5 sm:p-6 glass-card rounded-xs space-y-4 text-xs transition hover:shadow-lg border border-white/60 dark:border-white/10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-base text-foreground">Order #{o.number || o.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              isCancelled
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300"
                                : isCompleted
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300"
                                : "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-800/20"
                            }`}>
                              ● {o.status}
                            </span>
                          </div>
                          <p className="text-neutral-500 font-light">Placed on {o.date_created ? new Date(o.date_created).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : (o.placedAt || "Recent")}</p>
                          {o.payment_method_title && (
                            <p className="text-[11px] text-neutral-400">Payment: {o.payment_method_title}</p>
                          )}
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="font-serif font-bold text-xl text-[#102B24] dark:text-[#B4833E]">{formatINR(o.total)}</p>
                          <p className="text-[11px] text-neutral-500">{o.items || o.line_items?.length || 1} Couture Item(s)</p>
                        </div>
                      </div>

                      {/* Visual Order Timeline */}
                      {!isCancelled && (
                        <div className="pt-2">
                          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-3">Order Journey</p>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium">
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white grid place-items-center text-[9px] shadow-sm">✓</div>
                              <span className="text-foreground font-semibold">Placed</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full grid place-items-center text-[9px] shadow-sm ${
                                isPaid ? "bg-emerald-600 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                              }`}>{isPaid ? "✓" : "2"}</div>
                              <span className={isPaid ? "text-foreground font-semibold" : "text-neutral-400"}>Paid</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full grid place-items-center text-[9px] shadow-sm ${
                                ["processing", "completed"].includes(status) ? "bg-amber-600 text-white ring-2 ring-amber-400/40" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                              }`}>●</div>
                              <span className={["processing", "completed"].includes(status) ? "text-amber-800 dark:text-amber-400 font-semibold" : "text-neutral-400"}>Atelier</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full grid place-items-center text-[9px] shadow-sm ${
                                isCompleted ? "bg-emerald-600 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                              }`}>{isCompleted ? "✓" : "○"}</div>
                              <span className={isCompleted ? "text-emerald-600 font-semibold" : "text-neutral-400"}>Delivered</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Wishlist quick strip */}
          <div className="glass-panel p-6 sm:p-8 rounded-sm space-y-6 shadow-md">
            <div className="flex justify-between items-center border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
              <h2 className="text-2xl font-serif text-foreground font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Saved Wishlist ({wishlistedProducts.length})
              </h2>
              <Link to="/wishlist" className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {wishlistedProducts.length === 0 ? (
              <p className="text-sm text-neutral-500 font-light py-2">Your wishlist is currently empty.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {wishlistedProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.slug}
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="group block p-2 glass-card rounded-xs text-xs"
                  >
                    <img src={p.image || p.images?.[0]?.src} alt={p.name} className="aspect-[3/4] object-cover rounded-xs mb-2 group-hover:scale-105 transition duration-500" />
                    <p className="font-serif font-medium text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-amber-800 dark:text-amber-400 font-semibold mt-0.5">{formatINR(p.price)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
