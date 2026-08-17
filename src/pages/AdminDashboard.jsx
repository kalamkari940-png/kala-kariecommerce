import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { ShieldCheck, Plus, Trash2, Edit3, Lock, CheckCircle2 } from "lucide-react";

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

  const [newProd, setNewProd] = useState({
    name: "",
    slug: "",
    price: "",
    category: "Anarkali",
    description: "",
    image: "/placeholder.jpg"
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
      regular_price: Number(newProd.price)
    });
    setNewProd({ name: "", slug: "", price: "", category: "Anarkali", description: "", image: "/placeholder.jpg" });
  };

  if (!adminUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-900 grid place-items-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif">WooCommerce Admin</h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">Enter key to access WooCommerce catalog & order controls.</p>

        <form onSubmit={handleUnlock} className="mt-6 space-y-3">
          {errorMsg && <p className="text-xs text-rose-500">{errorMsg}</p>}
          <input
            type="password"
            placeholder="Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-800 px-4 py-2.5 text-xs rounded-sm outline-none border"
          />
          <button type="submit" className="w-full bg-neutral-950 text-white dark:bg-white dark:text-black py-3 text-xs uppercase tracking-widest font-medium">
            Unlock Admin Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">WooCommerce Backend Manager</p>
          <h1 className="text-3xl sm:text-4xl font-serif mt-1">Store Management</h1>
        </div>
        <button onClick={lockAdmin} className="text-xs uppercase tracking-widest text-neutral-500 border px-4 py-2 rounded-sm hover:text-black">
          Lock Panel
        </button>
      </div>

      {/* Product Creation Form */}
      <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-sm border space-y-4">
        <h2 className="text-xl font-serif flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-800" /> Add New WooCommerce Product
        </h2>
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-500 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={newProd.name}
              onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
              placeholder="e.g. Maya Gold Anarkali"
              className="w-full border px-3 py-2 rounded-sm bg-white dark:bg-neutral-800"
            />
          </div>

          <div>
            <label className="block text-neutral-500 mb-1">Price (INR)</label>
            <input
              type="number"
              required
              value={newProd.price}
              onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
              placeholder="7500"
              className="w-full border px-3 py-2 rounded-sm bg-white dark:bg-neutral-800"
            />
          </div>

          <div>
            <label className="block text-neutral-500 mb-1">Category</label>
            <select
              value={newProd.category}
              onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
              className="w-full border px-3 py-2 rounded-sm bg-white dark:bg-neutral-800"
            >
              <option value="Anarkali">Anarkali</option>
              <option value="Lehenga">Lehenga</option>
              <option value="Gown">Gown</option>
              <option value="Kurti">Kurti</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <button type="submit" className="bg-neutral-950 text-white dark:bg-white dark:text-black px-6 py-2.5 uppercase tracking-widest text-xs font-medium">
              Create Product in WooCommerce Catalog
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Listing & Manage */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Product Catalog ({products.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.slug || p.id} className="p-4 border rounded-sm flex gap-4 items-center bg-white dark:bg-neutral-900">
              <img src={p.image || p.images?.[0]?.src} alt="" className="w-16 h-20 object-cover rounded-sm" />
              <div className="flex-1 text-xs space-y-1">
                <p className="font-serif font-semibold text-sm line-clamp-1">{p.name}</p>
                <p className="text-neutral-500">{p.category} · {formatINR(p.price)}</p>
                <button
                  onClick={() => removeProduct(p.slug || p.id)}
                  className="text-rose-500 hover:underline flex items-center gap-1 text-[11px] pt-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Management */}
      <div className="space-y-4 pt-6 border-t">
        <h2 className="text-2xl font-serif">Customer Orders ({orders.length})</h2>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="p-4 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
              <div>
                <p className="font-serif font-semibold text-sm">Order #{o.number || o.id}</p>
                <p className="text-neutral-500">Total: {formatINR(o.total)}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  className="bg-neutral-100 dark:bg-neutral-800 border px-3 py-1.5 rounded-sm uppercase tracking-wider font-medium text-[10px]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
