import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { Plus, Trash2, Lock, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function AdminDashboardPage() {
  const {
    adminUnlocked,
    unlockAdmin,
    lockAdmin,
    products,
    addProduct,
    removeProduct,
    orders,
    updateOrderStatus
  } = useStore();

  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders'

  const [newProd, setNewProd] = useState({
    name: "",
    slug: "",
    price: "",
    regular_price: "",
    category: "Best Sellers",
    fabric: "Silk",
    craft: "Zardozi",
    description: "",
    image: ""
  });

  const handleUnlock = (e) => {
    e.preventDefault();
    const success = unlockAdmin(passwordInput);
    if (!success) {
      setErrorMsg("Invalid password. (Default: kalamkari2026)");
    } else {
      setErrorMsg("");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    const slug = newProd.slug || newProd.name.toLowerCase().replace(/\s+/g, "-");
    await addProduct({
      ...newProd,
      slug,
      price: Number(newProd.price),
      regular_price: Number(newProd.regular_price || newProd.price)
    });
    setNewProd({
      name: "",
      slug: "",
      price: "",
      regular_price: "",
      category: "Best Sellers",
      fabric: "Silk",
      craft: "Zardozi",
      description: "",
      image: ""
    });
  };

  if (!adminUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/20 text-amber-800 dark:text-amber-400 grid place-items-center mb-4 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400">Atelier Administration</p>
        <h1 className="text-3xl font-serif text-foreground mt-2">WooCommerce Manager</h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light">
          Enter your authorized key to access store catalog controls and order tracking.
        </p>

        <form onSubmit={handleUnlock} className="glass-panel p-6 rounded-sm mt-6 space-y-4 shadow-xl">
          {errorMsg && <p className="text-xs text-rose-500">{errorMsg}</p>}
          <input
            type="password"
            placeholder="Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full glass-input px-4 py-2.5 text-xs rounded-xs outline-none text-foreground font-medium"
          />
          <button
            type="submit"
            className="w-full bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md"
          >
            Unlock Manager Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-neutral-200/80 dark:border-neutral-800 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Backend Manager
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-foreground mt-1">Catalog & Order Operations</h1>
        </div>
        <button
          onClick={lockAdmin}
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-foreground border border-neutral-300 dark:border-neutral-700 px-4 py-2 rounded-xs glass-card"
        >
          Lock Panel
        </button>
      </Reveal>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200/80 dark:border-neutral-800 gap-6 text-xs uppercase tracking-widest font-semibold">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 border-b-2 transition ${activeTab === "products" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
        >
          Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 border-b-2 transition ${activeTab === "orders" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-10">
          {/* Add Product Form */}
          <div className="glass-panel p-6 sm:p-8 rounded-sm space-y-4 shadow-md">
            <h2 className="text-xl font-serif text-foreground font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-800 dark:text-amber-400" /> Create New WooCommerce Product
            </h2>

            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Gold Raw Silk Anarkali"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Price (INR) *</label>
                <input
                  type="number"
                  required
                  placeholder="8500"
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Category</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground font-semibold"
                >
                  <option value="Best Sellers">Best Sellers</option>
                  <option value="Daily Wears">Daily Wears</option>
                  <option value="Recreation Outfits">Recreation Outfits</option>
                  <option value="Under 990">Under 990</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Fabric</label>
                <select
                  value={newProd.fabric}
                  onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground font-semibold"
                >
                  <option value="Silk">Silk</option>
                  <option value="Velvet">Velvet</option>
                  <option value="Georgette">Georgette</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Organza">Organza</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Craft / Embroidery</label>
                <input
                  type="text"
                  placeholder="Hand Zardozi"
                  value={newProd.craft}
                  onChange={(e) => setNewProd({ ...newProd, craft: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://... (or leave blank for catalog asset)"
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Artisanal details, lining, dupatta specifications..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xs outline-none text-foreground"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 pt-2">
                <button
                  type="submit"
                  className="bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black px-6 py-2.5 uppercase tracking-widest text-xs font-semibold shadow-md hover:bg-[#263e36] transition"
                >
                  Add Product to Store Catalog
                </button>
              </div>
            </form>
          </div>

          {/* Products Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground font-semibold">Active Catalog ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.slug || p.id} className="p-4 glass-card rounded-xs flex gap-4 items-center">
                  <img
                    src={p.image || p.images?.[0]?.src}
                    alt=""
                    className="w-16 h-20 object-cover rounded-xs border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0 text-xs space-y-1">
                    <p className="font-serif font-semibold text-sm text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-neutral-500">{p.category} · {formatINR(p.price)}</p>
                    <button
                      onClick={() => removeProduct(p.slug || p.id)}
                      className="text-rose-600 hover:underline flex items-center gap-1 text-[11px] pt-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove from Catalog
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-serif text-foreground font-semibold">Customer Orders ({orders.length})</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id || o.number}
                className="p-5 glass-card rounded-xs flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-base text-foreground">Order #{o.number || o.id}</span>
                    <span className="text-neutral-500">· {o.customer || o.billing?.first_name || "Online Customer"}</span>
                  </div>
                  <p className="text-neutral-500">Amount: <strong className="text-foreground">{formatINR(o.total)}</strong> · Date: {o.date_created || o.placedAt || "Recent"}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Status:</span>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id || o.number, e.target.value)}
                    className="glass-input px-3 py-1.5 rounded-xs uppercase tracking-wider font-semibold text-[11px] cursor-pointer text-foreground"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
