import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { Reveal } from "@/components/common/Reveal";

export function WishlistPage() {
  const { wishlist, products, toggleWishlist, addToCart } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug) || wishlist.includes(String(p.id)));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-800/20 text-amber-800 dark:text-amber-400 grid place-items-center mb-6 shadow-sm">
          <Heart className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">Atelier Saved Pieces</p>
        <h1 className="text-3xl sm:text-4xl font-serif mt-2 text-foreground">Your Wishlist is Empty</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
          Save your favourite bespoke sarees, Anarkalis, and handcrafted couture pieces to revisit anytime.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md"
        >
          Explore Atelier Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">Saved For Later</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-serif text-foreground">My Saved Wishlist ({wishlistedProducts.length})</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light">
          Your curated selection of heirloom garments crafted with pride.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistedProducts.map((p, idx) => (
          <Reveal key={p.slug || p.id} delay={idx * 50}>
            <div className="group relative rounded-sm bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-800">
                  <Link to="/product/$slug" params={{ slug: p.slug }}>
                    <img
                      src={p.image || p.images?.[0]?.src}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(p.slug)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-950/90 rounded-full text-rose-500 hover:scale-110 transition shadow-sm backdrop-blur-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {p.category && (
                    <span className="absolute bottom-3 left-3 bg-[#1c2d27]/90 text-amber-300 px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-semibold backdrop-blur-md">
                      {p.category}
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1">
                  <Link
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="font-serif text-lg font-medium text-foreground line-clamp-1 hover:text-amber-800 dark:hover:text-amber-400 transition"
                  >
                    {p.name}
                  </Link>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatINR(p.price)}</span>
                    {p.regular_price > p.price && (
                      <span className="text-xs text-neutral-400 line-through">{formatINR(p.regular_price)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex gap-2">
                <button
                  onClick={() => {
                    addToCart(p.slug, p.sizes?.[0] || "M", 1);
                  }}
                  className="flex-1 bg-[#1c2d27] text-[#f7f4ee] dark:bg-white dark:text-black py-2.5 text-[11px] uppercase tracking-widest font-medium hover:bg-[#263e36] transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  Move to Bag
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
