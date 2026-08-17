import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { User, Package, Heart, LogOut, MapPin } from "lucide-react";

export function AccountPage() {
  const { user, loginUser, registerUser, logoutUser, orders, wishlist, products } = useStore();

  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authError, setAuthError] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "login") {
        await loginUser(email, password);
      } else {
        await registerUser({ email, password, first_name: firstName, last_name: lastName });
      }
    } catch (err) {
      setAuthError(err?.message || "Authentication failed.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">WooCommerce Customer Portal</p>
          <h1 className="text-3xl font-serif mt-2">{authMode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-xs text-neutral-500 mt-2 font-light">Sign in to manage your couture orders and addresses.</p>
        </div>

        <form onSubmit={handleAuthSubmit} className="bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
          {authError && (
            <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-sm">{authError}</div>
          )}

          {authMode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border px-3 py-2 text-xs rounded-sm outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border px-3 py-2 text-xs rounded-sm outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border px-3 py-2 text-xs rounded-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-950 text-white dark:bg-white dark:text-black py-3 text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition"
          >
            {authMode === "login" ? "Sign In" : "Register Customer"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="text-xs text-neutral-500 underline hover:text-black"
            >
              {authMode === "login" ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">WooCommerce Profile</p>
          <h1 className="text-3xl sm:text-4xl font-serif mt-1">Hello, {user.first_name || user.email}</h1>
        </div>
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-rose-600 transition border px-4 py-2 rounded-sm"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Customer Details left card */}
        <div className="lg:col-span-4 bg-neutral-50 dark:bg-neutral-900 p-6 rounded-sm border space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 grid place-items-center">
              <User className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
            </div>
            <div>
              <p className="font-serif font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-xs">
            <p className="font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-800" /> Default Shipping Address:
            </p>
            <p className="text-neutral-500 leading-relaxed font-light pl-6">
              {user.billing?.address_1 || "42, Wallace Garden, Nungambakkam"}<br />
              {user.billing?.city || "Chennai"}, {user.billing?.state || "Tamil Nadu"} {user.billing?.postcode || "600006"}
            </p>
          </div>
        </div>

        {/* Orders & Wishlist right section */}
        <div className="lg:col-span-8 space-y-10">
          {/* Order history */}
          <div>
            <h2 className="text-2xl font-serif mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-800" /> Order History
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-neutral-500 font-light">No orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 border rounded-sm flex justify-between items-center text-xs">
                    <div>
                      <p className="font-serif font-semibold text-sm">Order #{o.number || o.id}</p>
                      <p className="text-neutral-500">Placed on {o.date_created || o.placedAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatINR(o.total)}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-amber-100 text-amber-900 mt-1">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div>
            <h2 className="text-2xl font-serif mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Saved Wishlist ({wishlistedProducts.length})
            </h2>
            {wishlistedProducts.length === 0 ? (
              <p className="text-sm text-neutral-500 font-light">Your wishlist is currently empty.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistedProducts.map((p) => (
                  <div key={p.slug} className="p-3 border rounded-sm text-xs">
                    <img src={p.image} alt={p.name} className="aspect-[3/4] object-cover rounded-sm mb-2" />
                    <p className="font-serif font-medium line-clamp-1">{p.name}</p>
                    <p className="text-neutral-500 font-semibold">{formatINR(p.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
