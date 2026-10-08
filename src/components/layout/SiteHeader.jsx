import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/hooks/useStore";
import { CartDrawer } from "@/components/ecommerce/CartDrawer";

const leftNavLinks = [
  { label: "Best Sellers", to: "/shop", search: { category: "Best Sellers" } },
  { label: "Daily Wears", to: "/shop", search: { category: "Daily Wears" } }
];

const rightNavLinks = [
  { label: "Recreation Outfits", to: "/shop", search: { category: "Recreation Outfits" } },
  { label: "Under ₹990", to: "/shop", search: { category: "Under 990" } }
];

export function SiteHeader() {
  const { cartCount, wishlistCount, settings, products, isCartDrawerOpen, openCartDrawer, closeCartDrawer } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setOpen(false);
      }
    };
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate({ to: "/shop", search: { search: searchQuery } });
    }
  };

  const matchingProducts = searchQuery.trim()
    ? (products || []).filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "shadow-md py-2.5" : "py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Left Column: Mobile Menu Trigger & Left Navigation */}
        <div className="flex items-center gap-6 flex-1 justify-start min-w-0">
          <button
            aria-label="Toggle Mobile Menu"
            onClick={() => setOpen(true)}
            className="p-2 lg:hidden text-foreground hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.24em] font-semibold text-foreground/90 whitespace-nowrap">
            {leftNavLinks.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                search={n.search}
                className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-amber-800 dark:after:bg-amber-400 hover:after:w-full after:transition-all"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Column: Brand Logo & Tagline */}
        <Link to="/" className="flex flex-col items-center justify-center text-center shrink-0 px-2 group">
          <span
            className={`font-serif italic tracking-tight transition-all duration-300 text-foreground font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-400 ${
              scrolled ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
            }`}
          >
            {settings.brandName || "Kalamkari"}
          </span>
          <span className="mt-0.5 text-[8.5px] md:text-[9.5px] tracking-[0.32em] uppercase text-amber-800 dark:text-amber-400 font-semibold whitespace-nowrap">
            Delivering Your Pride
          </span>
        </Link>

        {/* Right Column: Desktop Right Navigation & Action Icons */}
        <div className="flex items-center gap-6 flex-1 justify-end min-w-0">
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.24em] font-semibold text-foreground/90 whitespace-nowrap">
            {rightNavLinks.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                search={n.search}
                className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-amber-800 dark:after:bg-amber-400 hover:after:w-full after:transition-all"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-foreground/85 hover:text-amber-800 dark:hover:text-amber-400 hover:scale-110 transition-all cursor-pointer"
              aria-label="Search Collection"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/account"
              className="p-2 text-foreground/85 hover:text-amber-800 dark:hover:text-amber-400 hover:scale-110 transition-all"
              aria-label="Account Portal"
            >
              <User className="h-4 w-4" />
            </Link>
            <Link
              to="/wishlist"
              className="relative p-2 text-foreground/85 hover:text-amber-800 dark:hover:text-amber-400 hover:scale-110 transition-all group"
              aria-label="Saved Wishlist"
            >
              <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
              {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
            </Link>
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative p-2 text-foreground/85 hover:text-amber-800 dark:hover:text-amber-400 hover:scale-110 transition-all cursor-pointer group"
              aria-label="Open Shopping Bag Drawer"
            >
              <ShoppingBag className="h-4 w-4 transition-transform group-hover:-rotate-6" />
              {cartCount > 0 && <Badge className="animate-badge-bounce">{cartCount}</Badge>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl lg:hidden animate-in fade-in duration-300 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/80 p-5">
            <div className="flex flex-col">
              <span className="text-2xl font-serif italic text-foreground">{settings.brandName}</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-amber-800 dark:text-amber-400 font-semibold">Delivering Your Pride</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 text-foreground">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-6 overflow-y-auto flex-1">
            {[...leftNavLinks, ...rightNavLinks].map((n) => (
              <Link
                key={n.label}
                to={n.to}
                search={n.search}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-4 text-xl font-serif text-foreground hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center justify-between"
              >
                <span>{n.label}</span>
                <span className="text-xs uppercase tracking-widest text-neutral-400">→</span>
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setOpen(false)}
              className="border-b border-border/40 py-4 text-xl font-serif text-foreground flex items-center justify-between"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="text-xs font-sans bg-amber-800 text-white px-2 py-0.5 rounded-full">{wishlistCount}</span>}
            </Link>
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="border-b border-border/40 py-4 text-xl font-serif text-foreground"
            >
              Account Portal
            </Link>
          </nav>
        </div>
      )}

      {/* Search overlay modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-[#f7f4ee]/95 dark:bg-[#111d19]/95 backdrop-blur-2xl text-[#1c1917] dark:text-[#f7f4ee] flex flex-col animate-in fade-in duration-200">
          <div className="border-b border-[#e2ded5] dark:border-neutral-800 px-4 sm:px-8 py-5 flex items-center justify-between">
            <Link to="/" onClick={() => setSearchOpen(false)} className="flex flex-col">
              <span className="font-serif italic text-2xl md:text-3xl text-foreground font-semibold">
                {settings.brandName || "Kalamkari"}
              </span>
              <span className="text-[8.5px] tracking-[0.3em] uppercase text-amber-800 dark:text-amber-400 font-semibold">
                Delivering Your Pride
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close Search"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors p-2"
            >
              <span>Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 sm:px-6 pt-12 pb-16">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center gap-4 border-b-2 border-[#1c2d27] dark:border-amber-400 pb-4">
                <Search className="h-7 w-7 text-amber-800 dark:text-amber-400 shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search best sellers, daily wears, recreation outfits..."
                  className="flex-1 bg-transparent text-2xl sm:text-4xl font-serif outline-none placeholder:text-neutral-400 text-foreground font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear Query"
                    className="p-1 text-neutral-400 hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Popular Searches */}
            {!searchQuery && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-4">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {["Best Sellers", "Daily Wears", "Recreation Outfits", "Under 990", "Cotton", "Silk"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setSearchOpen(false);
                        navigate({ to: "/shop", search: { search: term } });
                      }}
                      className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 px-5 py-2.5 text-xs uppercase tracking-wider text-foreground hover:border-[#1c2d27] hover:bg-[#1c2d27] hover:text-[#f7f4ee] dark:hover:border-amber-400 dark:hover:text-amber-400 transition shadow-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Quick Results */}
            {searchQuery.trim() && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                    Matching Products ({matchingProducts.length})
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 hover:underline font-semibold"
                  >
                    View all results →
                  </button>
                </div>

                {matchingProducts.length === 0 ? (
                  <p className="text-sm text-neutral-500 font-serif italic py-8">
                    No products found for "{searchQuery}". Try searching for Anarkali, Lehenga, or Silk.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {matchingProducts.map((p) => (
                      <Link
                        key={p.slug || p.id}
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="group block glass-card rounded-xs overflow-hidden p-2 transition hover:shadow-md"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-neutral-200 rounded-xs">
                          <img
                            src={p.image || p.images?.[0]?.src || "/placeholder.jpg"}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        </div>
                        <div className="mt-2 space-y-0.5">
                          <p className="text-[9px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
                            {p.category}
                          </p>
                          <p className="text-xs font-serif line-clamp-1 font-medium text-foreground">
                            {p.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Luxury Glass Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </header>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={`absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#B85C2D] dark:bg-amber-400 text-white dark:text-black text-[9px] font-bold px-1 shadow-sm ${className}`}>
      {children}
    </span>
  );
}


