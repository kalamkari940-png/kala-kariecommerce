import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { Reveal } from "@/components/common/Reveal";
import { ProductCard } from "@/components/ecommerce/ProductCard";

export function ProductDetailPage({ slug }) {
  const { getProduct, addToCart, toggleWishlist, isWishlisted, products } = useStore();
  const product = getProduct(slug);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif">Product Not Found</h1>
        <p className="mt-2 text-neutral-500">The couture piece you requested is unavailable.</p>
        <Link to="/shop" className="mt-6 inline-block bg-black text-white px-6 py-3 text-xs uppercase tracking-widest">
          Return to Atelier Shop
        </Link>
      </div>
    );
  }

  const wished = isWishlisted(product.slug);
  const images = product.gallery?.length
    ? product.gallery
    : product.images?.length
    ? product.images.map((i) => i.src)
    : [product.image];

  const sizes = product.sizes?.length ? product.sizes : [];
  const relatedProducts = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.slug, selectedSize, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-widest text-neutral-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black">Shop</Link>
        <span>/</span>
        <span className="text-neutral-800 dark:text-neutral-200">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Thumbnails desktop side */}
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`aspect-[3/4] overflow-hidden rounded-sm border transition ${
                selectedImageIndex === idx ? "border-amber-800 ring-1 ring-amber-800" : "border-neutral-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main Gallery Display */}
        <div className="lg:col-span-6 relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
          <img
            src={images[selectedImageIndex] || product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 bg-neutral-950/90 text-amber-300 text-xs tracking-widest uppercase px-3 py-1 font-medium">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details right panel */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800 dark:text-amber-400">{product.category}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-neutral-900 dark:text-white leading-tight">{product.name}</h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatINR(product.price)}</span>
              {(product.compareAt || product.regular_price > product.price) && (
                <span className="text-base text-neutral-400 line-through">
                  {formatINR(product.compareAt || product.regular_price)}
                </span>
              )}
              <span className="text-xs text-emerald-600 font-medium ml-2">Inclusive of all taxes</span>
            </div>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-3">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Select Size:</span>
                <button className="text-neutral-400 underline hover:text-black">Size Guide</button>
              </div>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-11 rounded-sm text-xs font-medium uppercase tracking-wider flex items-center justify-center border transition ${
                      selectedSize === size
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-neutral-300 hover:border-neutral-900 dark:border-neutral-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 py-4 text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              {addedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
              {addedNotice ? "Added to Bag" : "Add to Shopping Bag"}
            </button>
            <button
              onClick={() => toggleWishlist(product.slug)}
              className={`p-4 border rounded-sm transition ${
                wished ? "border-rose-500 bg-rose-50 text-rose-500" : "border-neutral-300 hover:border-black"
              }`}
            >
              <Heart className={`w-5 h-5 ${wished ? "fill-rose-500" : ""}`} />
            </button>
          </div>

          {/* Features */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-3 text-xs text-neutral-600 dark:text-neutral-400 font-light">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              <span>Complimentary shipping across India on orders above ₹4,999</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              <span>Handcrafted by master karigars in Chennai</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              <span>7 day hassle-free return on unstitched pieces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
        <h2 className="text-2xl font-serif mb-8">Complete the Look</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {relatedProducts.map((p, i) => (
            <Reveal key={p.slug || p.id} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
