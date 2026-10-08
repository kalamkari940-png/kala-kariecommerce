import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { Reveal } from "@/components/common/Reveal";
import { useStore } from "@/hooks/useStore";
import { Search, Sparkles } from "lucide-react";

export function ShopPage({ searchParams = {} }) {
  const { products, loading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.category || "All");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(searchParams?.search || "");

  useEffect(() => {
    if (searchParams?.category) {
      setSelectedCategory(searchParams.category);
    }
  }, [searchParams?.category]);

  useEffect(() => {
    if (searchParams?.search) {
      setSearchQuery(searchParams.search);
    }
  }, [searchParams?.search]);

  const categories = ["All", "Best Sellers", "Daily Wears", "Recreation Outfits", "Under 990"];
  const fabrics = ["All", "Silk", "Velvet", "Georgette", "Organza", "Cotton"];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      const catLower = selectedCategory.toLowerCase();
      if (catLower === "best sellers" || catLower === "bestsellers") {
        const bests = result.filter(
          (p) =>
            p.bestSeller ||
            p.featured ||
            (p.total_sales && p.total_sales > 0) ||
            p.category?.toLowerCase().includes("best seller") ||
            p.categories?.some((c) => c.name.toLowerCase().includes("best seller") || c.slug?.includes("best"))
        );
        result = bests.length > 0 ? bests : [...result].sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
      } else if (catLower === "under 990" || catLower === "under-990" || catLower.includes("990")) {
        result = result.filter((p) => p.price <= 990 || p.category?.toLowerCase().includes("990"));
      } else if (catLower === "daily wears" || catLower === "daily wear") {
        const daily = result.filter(
          (p) =>
            p.category?.toLowerCase().includes("daily") ||
            p.category?.toLowerCase().includes("kurti") ||
            p.category?.toLowerCase().includes("casual") ||
            p.fabric?.toLowerCase() === "cotton" ||
            p.categories?.some((c) => c.name.toLowerCase().includes("daily") || c.name.toLowerCase().includes("kurti"))
        );
        result = daily.length > 0 ? daily : result;
      } else if (catLower === "recreation outfits" || catLower === "recreation") {
        const recreation = result.filter(
          (p) =>
            p.category?.toLowerCase().includes("recreation") ||
            p.name?.toLowerCase().includes("recreation") ||
            p.description?.toLowerCase().includes("recreation") ||
            p.categories?.some((c) => c.name.toLowerCase().includes("recreation") || c.slug?.includes("recreation"))
        );
        result = recreation.length > 0 ? recreation : result;
      } else {
        result = result.filter(
          (p) =>
            p.category?.toLowerCase() === catLower ||
            p.categories?.some((c) => c.name.toLowerCase() === catLower || c.slug === catLower)
        );
      }
    }

    if (selectedFabric !== "All") {
      result = result.filter((p) => p.fabric?.toLowerCase() === selectedFabric.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedFabric, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header banner */}
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Atelier Edit · 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-foreground">The Atelier Collection</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
          Handcrafted South Indian couture, raw silk Anarkalis, and recreation drapes tailored with pride.
        </p>
      </Reveal>

      {/* Glass Filter & Search Control Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-sm mb-10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black shadow-md scale-102"
                    : "bg-white/60 text-neutral-700 hover:bg-white dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls right */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full glass-input pl-9 pr-4 py-2 text-xs rounded-xs outline-none text-foreground"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input px-3 py-2 text-xs uppercase tracking-wider rounded-xs outline-none font-semibold cursor-pointer text-foreground"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Fabric filter sub-row */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-xs">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Fabric:</span>
          <div className="flex flex-wrap gap-1.5">
            {fabrics.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFabric(f)}
                className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition ${
                  selectedFabric === f
                    ? "text-amber-900 dark:text-amber-300 font-bold underline"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-sm">
          <p className="text-xl font-serif text-neutral-600 dark:text-neutral-400">No couture pieces match your selected filters.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedFabric("All");
              setSearchQuery("");
            }}
            className="mt-4 inline-block bg-[#1c2d27] text-[#f7f4ee] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p, i) => (
            <Reveal key={p.slug || p.id} delay={i * 40}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
