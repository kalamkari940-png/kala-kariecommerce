import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import { useStore } from "@/hooks/useStore";
import { formatINR, cn } from "@/utils/cn";

export function ProductCard({ product, priority = false }) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const wished = isWishlisted(product.slug);
  const tiltRef = useRef(null);

  const currentPrice = Number(product.price || 0);
  const regularPrice = Number(product.regular_price || product.compareAt || currentPrice);
  const hasDiscount = regularPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) : 0;

  const badgeText = product.badge || (hasDiscount ? `${discountPercent}% OFF` : (product.bestSeller ? "BESTSELLER" : null));

  const onMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("transform", `perspective(1000px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`);
  };

  const onLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("transform", `perspective(1000px) rotateX(0deg) rotateY(0deg)`);
  };

  const primaryImage = product.image || product.images?.[0]?.src || "/placeholder.jpg";
  const hoverImage = product.gallery?.[1] || product.images?.[1]?.src || primaryImage;

  return (
    <div className="group relative transition-all duration-300">
      <div
        ref={tiltRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative overflow-hidden rounded-sm bg-[#ede9df] dark:bg-neutral-900 transition-transform duration-300 ease-out shadow-xs group-hover:shadow-md border border-neutral-300/60 dark:border-neutral-800"
      >
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block overflow-hidden relative aspect-[3/4]"
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
          />
          {hoverImage !== primaryImage && (
            <img
              src={hoverImage}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {badgeText && (
            <span className="absolute left-3 top-3 bg-[#1c2d27]/90 backdrop-blur-md px-2.5 py-1 text-[9px] tracking-[0.2em] text-amber-300 uppercase font-semibold border border-amber-500/20 z-10">
              {badgeText}
            </span>
          )}

          {/* Quick Add overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1c2d27]/95 via-[#1c2d27]/70 to-transparent translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product.slug, product.sizes?.[0] || "M", 1);
              }}
              className="flex-1 bg-[#1c2d27] text-[#f7f4ee] py-2.5 text-[11px] tracking-widest uppercase font-semibold flex items-center justify-center gap-2 hover:bg-[#263e36] transition shadow-sm border border-amber-500/30"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              Quick Add
            </button>
          </div>
        </Link>

        <button
          aria-label="Wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.slug);
          }}
          className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 dark:bg-neutral-950/90 shadow-sm backdrop-blur-md transition hover:scale-110"
        >
          <Heart className={cn("h-4 w-4 transition-colors", wished ? "fill-rose-500 text-rose-500" : "text-neutral-700 dark:text-neutral-300")} />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[10px] tracking-[0.2em] uppercase text-amber-800 dark:text-amber-400 font-semibold">
          {product.category || "Atelier"}
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block font-serif text-base md:text-lg leading-snug text-neutral-900 dark:text-neutral-100 hover:text-amber-800 dark:hover:text-amber-400 transition line-clamp-1 font-medium"
        >
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatINR(currentPrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
              {formatINR(regularPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

