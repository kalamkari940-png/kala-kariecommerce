import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { Reveal } from "@/components/common/Reveal";
import { useStore } from "@/hooks/useStore";
import { Filter, SlidersHorizontal, Search } from "lucide-react";

export function ShopPage({ searchParams = {} }) {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.category || "All");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(searchParams?.search || "");

  useEffect(() => {
    if (searchParams?.category) {
      setSelectedCategory(searchParams.category);
    }
  }, [searchParams?.category]);

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
        result = bests.length > 0 ? bests : [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">Kalamkari Atelier</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif">The Atelier Collection</h1>
        <p className="mt-4 text-sm text-neutral-500 font-light leading-relaxed">
          Handcrafted Anarkalis, lehengas and couture drapes tailored to perfection.
        </p>
      </Reveal>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800 mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-full transition ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Controls right */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-neutral-100 dark:bg-neutral-800 pl-9 pr-4 py-2 text-xs rounded-md outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-xs uppercase tracking-wider rounded-md outline-none border-none font-medium cursor-pointer"
          >
            <option value="featured font-sans">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-serif text-neutral-500">No couture pieces match your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedFabric("All");
              setSearchQuery("");
            }}
            className="mt-4 text-xs uppercase tracking-widest text-amber-800 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p, i) => (
            <Reveal key={p.slug || p.id} delay={i * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
