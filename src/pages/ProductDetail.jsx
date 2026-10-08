import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Star, MessageSquare, Send } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { formatINR } from "@/utils/cn";
import { Reveal } from "@/components/common/Reveal";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { wooReviewService } from "@/services/woocommerce/reviews";

export function ProductDetailPage({ slug }) {
  const { getProduct, addToCart, toggleWishlist, isWishlisted, products } = useStore();
  const product = getProduct(slug);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'craft' | 'care' | 'reviews'

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", email: "", rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product?.id) {
      wooReviewService.getProductReviews(product.id).then((revs) => {
        if (revs?.length) setReviews(revs);
      });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif text-foreground">Product Not Found</h1>
        <p className="mt-2 text-neutral-500 font-light">The couture piece you requested is currently unavailable.</p>
        <Link to="/shop" className="mt-6 inline-block bg-[#1c2d27] text-[#f7f4ee] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold">
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

  const sizes = product.sizes?.length ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const relatedProducts = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.slug, selectedSize, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const created = await wooReviewService.createReview(
      product.id || 101,
      newReview.comment,
      newReview.rating,
      newReview.name,
      newReview.email || "guest@example.com"
    );
    if (created) {
      setReviews((prev) => [created, ...prev]);
      setReviewSubmitted(true);
      setNewReview({ name: "", email: "", rating: 5, comment: "" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <div className="text-xs uppercase tracking-widest text-neutral-400 mb-8 flex items-center gap-2 font-medium">
        <Link to="/" className="hover:text-amber-800 dark:hover:text-amber-400 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-800 dark:hover:text-amber-400 transition">Shop</Link>
        <span>/</span>
        <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Thumbnails desktop column */}
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`aspect-[3/4] overflow-hidden rounded-xs border-2 transition-all ${
                selectedImageIndex === idx
                  ? "border-amber-800 dark:border-amber-400 scale-105 shadow-md"
                  : "border-neutral-200/80 dark:border-neutral-800 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main Gallery Display */}
        <div className="lg:col-span-6 relative aspect-[3/4] overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-900 glass-panel p-2 shadow-xl">
          <img
            src={images[selectedImageIndex] || product.image}
            alt={product.name}
            className="h-full w-full object-cover rounded-xs transition-opacity duration-300"
          />
          {product.badge && (
            <span className="absolute left-6 top-6 gold-badge text-[10px] tracking-[0.25em] uppercase px-3 py-1 font-bold shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details right panel */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400">{product.category || "Atelier Couture"}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-foreground leading-tight">{product.name}</h1>
            
            {/* Ratings Summary */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-medium">({product.rating_count || 24} reviews)</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-semibold text-foreground font-serif">{formatINR(product.price)}</span>
              {(product.compareAt || product.regular_price > product.price) && (
                <span className="text-base text-neutral-400 line-through font-serif">
                  {formatINR(product.compareAt || product.regular_price)}
                </span>
              )}
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-2 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider">
                <span className="font-semibold text-foreground">Select Size:</span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-amber-800 dark:text-amber-400 underline hover:text-foreground font-medium"
                >
                  Size Chart Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-11 rounded-xs text-xs font-semibold uppercase tracking-wider flex items-center justify-center border transition-all ${
                      selectedSize === size
                        ? "border-[#1c2d27] bg-[#1c2d27] text-white dark:border-amber-400 dark:bg-amber-400 dark:text-black shadow-md scale-105"
                        : "border-neutral-300 dark:border-neutral-700 bg-white/40 dark:bg-neutral-800/40 hover:border-black dark:hover:border-white"
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
              className="flex-1 bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black py-4 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition flex items-center justify-center gap-2 shadow-xl"
            >
              {addedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
              {addedNotice ? "Added to Shopping Bag" : "Add to Shopping Bag"}
            </button>
            <button
              onClick={() => toggleWishlist(product.slug)}
              aria-label="Wishlist"
              className={`p-4 border rounded-xs transition shadow-sm ${
                wished
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${wished ? "fill-rose-500" : ""}`} />
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="glass-panel p-5 rounded-xs space-y-3 text-xs text-neutral-600 dark:text-neutral-400 font-light">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
              <span>Complimentary shipping across India on orders above ₹4,999</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
              <span>Handcrafted by master karigars in Chennai atelier</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
              <span>7 day hassle-free exchange on unstitched standard pieces</span>
            </div>
          </div>

          {/* Tabbed Info Accordions */}
          <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-6">
            <div className="flex border-b border-neutral-200/80 dark:border-neutral-800 gap-6 text-xs uppercase tracking-wider font-semibold">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 border-b-2 transition ${activeTab === "details" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
              >
                Atelier Craft
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-3 border-b-2 transition ${activeTab === "care" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
              >
                Fabric & Care
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 border-b-2 transition ${activeTab === "reviews" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
              >
                Reviews ({reviews.length + (product.rating_count || 12)})
              </button>
            </div>

            <div className="py-4 text-xs text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
              {activeTab === "details" && (
                <div className="space-y-2">
                  <p><strong>Fabric:</strong> {product.fabric || "Pure Raw Silk / Chanderi Cotton"}</p>
                  <p><strong>Embroidery:</strong> {product.craft || "Hand Zardozi, Cutdana, and Gota work"}</p>
                  <p><strong>Pattern:</strong> {product.motive || "Heritage Floral Motif"}</p>
                  <p><strong>Origin:</strong> Hand-tailored at Wallace Garden Atelier, Chennai.</p>
                </div>
              )}

              {activeTab === "care" && (
                <div className="space-y-2">
                  <p>• Dry clean only for raw silk, georgette and velvet pieces.</p>
                  <p>• Store in breathable cotton muslin bags away from moisture.</p>
                  <p>• Iron on reverse side using low to medium heat setting.</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Write a review form */}
                  <form onSubmit={handleReviewSubmit} className="glass-panel p-4 rounded-xs space-y-3">
                    <p className="font-serif font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-800" /> Share Your Experience
                    </p>
                    {reviewSubmitted && (
                      <p className="text-emerald-600 font-medium">Thank you! Your review has been added.</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="glass-input p-2 rounded-xs outline-none text-xs"
                      />
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="glass-input p-2 rounded-xs outline-none text-xs"
                      >
                        <option value={5}>5 Stars — Exceptional</option>
                        <option value={4}>4 Stars — Very Good</option>
                        <option value={3}>3 Stars — Good</option>
                      </select>
                    </div>
                    <textarea
                      required
                      rows={2}
                      placeholder="Your feedback on fit, fabric, and finish..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full glass-input p-2 rounded-xs outline-none text-xs"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 text-white dark:bg-white dark:text-black px-4 py-2 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Submit Review
                    </button>
                  </form>

                  {/* Existing Reviews */}
                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-100/50 dark:bg-neutral-800/40 rounded-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-medium text-foreground">Ananya R.</span>
                        <div className="flex text-amber-500"><Star className="w-3 h-3 fill-amber-500" /><Star className="w-3 h-3 fill-amber-500" /><Star className="w-3 h-3 fill-amber-500" /><Star className="w-3 h-3 fill-amber-500" /><Star className="w-3 h-3 fill-amber-500" /></div>
                      </div>
                      <p className="mt-1 text-neutral-600 dark:text-neutral-400">"The fitting is impeccable and the zardozi embroidery is even more gorgeous in person. Received countless compliments!"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel bg-white dark:bg-neutral-900 max-w-lg w-full p-6 rounded-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif text-xl text-foreground font-semibold">Standard Atelier Size Chart (Inches)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-neutral-400 hover:text-black font-bold">✕</button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full border text-left">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-800">
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Bust</th>
                    <th className="p-2 border">Waist</th>
                    <th className="p-2 border">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-semibold">XS</td><td className="p-2 border">32"</td><td className="p-2 border">26"</td><td className="p-2 border">36"</td></tr>
                  <tr><td className="p-2 border font-semibold">S</td><td className="p-2 border">34"</td><td className="p-2 border">28"</td><td className="p-2 border">38"</td></tr>
                  <tr><td className="p-2 border font-semibold">M</td><td className="p-2 border">36"</td><td className="p-2 border">30"</td><td className="p-2 border">40"</td></tr>
                  <tr><td className="p-2 border font-semibold">L</td><td className="p-2 border">38"</td><td className="p-2 border">32"</td><td className="p-2 border">42"</td></tr>
                  <tr><td className="p-2 border font-semibold">XL</td><td className="p-2 border">40"</td><td className="p-2 border">34"</td><td className="p-2 border">44"</td></tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-[#1c2d27] text-[#f7f4ee] py-2 text-xs uppercase tracking-widest font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Related Products Carousel */}
      <section className="mt-24 pt-12 border-t border-neutral-200/80 dark:border-neutral-800">
        <h2 className="text-2xl sm:text-3xl font-serif mb-8 text-foreground">Complete the Look</h2>
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
