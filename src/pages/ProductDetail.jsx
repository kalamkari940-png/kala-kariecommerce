import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Star, MessageSquare, Send, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", email: "", rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Swipe handling state
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

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
        <Link to="/shop" className="mt-6 inline-block bg-[#102B24] text-[#F7F3EC] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold">
          Return to Atelier Shop
        </Link>
      </div>
    );
  }

  const wished = isWishlisted(product.slug);
  const images = product.gallery?.length
    ? product.gallery
    : product.images?.length
    ? product.images.map((i) => (typeof i === "string" ? i : i.src))
    : [product.image || "/placeholder.jpg"];

  const sizes = product.sizes?.length ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const relatedProducts = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.slug, selectedSize, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="text-[11px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-6 sm:mb-8 flex items-center gap-2 font-medium overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-amber-800 dark:hover:text-amber-400 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-800 dark:hover:text-amber-400 transition">Shop</Link>
        <span>/</span>
        <span className="text-neutral-900 dark:text-neutral-100 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        
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

        {/* Main Gallery Display Container */}
        <div className="lg:col-span-6 space-y-3">
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-900 glass-panel p-1.5 sm:p-2 shadow-xl touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[selectedImageIndex] || product.image}
              alt={product.name}
              className="h-full w-full object-cover rounded-xs transition-all duration-300 cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />

            {/* Product Badge */}
            {product.badge && (
              <span className="absolute left-4 top-4 sm:left-6 sm:top-6 gold-badge text-[10px] tracking-[0.25em] uppercase px-3 py-1 font-bold shadow-md z-10">
                {product.badge}
              </span>
            )}

            {/* Image Slide Counter Badge */}
            {images.length > 1 && (
              <span className="absolute right-4 bottom-4 bg-black/60 text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                {selectedImageIndex + 1} / {images.length}
              </span>
            )}

            {/* Left & Right Chevron Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-neutral-900/80 text-foreground backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition min-w-[40px] min-h-[40px] z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-neutral-900/80 text-foreground backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition min-w-[40px] min-h-[40px] z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Zoom Action Button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View Fullscreen"
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/70 dark:bg-neutral-900/70 text-foreground backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition z-10"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Horizontal Thumbnail Strip & Navigation Dots */}
          {images.length > 1 && (
            <div className="lg:hidden space-y-2 pt-1">
              {/* Pagination Dots */}
              <div className="flex justify-center items-center gap-1.5 py-1">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      selectedImageIndex === idx
                        ? "w-6 bg-[#102B24] dark:bg-amber-400"
                        : "w-2 bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  />
                ))}
              </div>

              {/* Horizontal Scrollable Thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-22 rounded-xs overflow-hidden border-2 shrink-0 snap-start transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#102B24] dark:border-amber-400 scale-105 shadow-md"
                        : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Details right panel */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400">{product.category || "Atelier Couture"}</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-serif text-foreground leading-tight">{product.name}</h1>
            
            {/* Ratings Summary */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-medium">({product.rating_count || 24} verified reviews)</span>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-semibold text-foreground font-serif">{formatINR(product.price)}</span>
              {(product.compareAt || product.regular_price > product.price) && (
                <span className="text-base text-neutral-400 line-through font-serif">
                  {formatINR(product.compareAt || product.regular_price)}
                </span>
              )}
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
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
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-amber-800 dark:text-amber-400 underline hover:text-foreground font-medium py-1"
                >
                  Size Chart Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-11 rounded-xs text-xs font-semibold uppercase tracking-wider flex items-center justify-center border transition-all min-w-[44px] min-h-[44px] ${
                      selectedSize === size
                        ? "border-[#102B24] bg-[#102B24] text-white dark:border-amber-400 dark:bg-amber-400 dark:text-black shadow-md scale-105"
                        : "border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 hover:border-black dark:hover:border-white"
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
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-[#102B24] text-[#F7F3EC] dark:bg-amber-400 dark:text-black py-4 text-xs uppercase tracking-widest font-semibold hover:bg-[#16382f] transition flex items-center justify-center gap-2 shadow-xl min-h-[48px]"
            >
              {addedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
              {addedNotice ? "Added to Shopping Bag" : "Add to Shopping Bag"}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              aria-label="Wishlist"
              className={`p-4 border rounded-xs transition shadow-sm min-w-[48px] min-h-[48px] flex items-center justify-center ${
                wished
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white bg-white/50"
              }`}
            >
              <Heart className={`w-5 h-5 ${wished ? "fill-rose-500" : ""}`} />
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="glass-panel p-4 sm:p-5 rounded-xs space-y-3 text-xs text-neutral-600 dark:text-neutral-400 font-light">
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
            <div className="flex border-b border-neutral-200/80 dark:border-neutral-800 gap-4 sm:gap-6 text-xs uppercase tracking-wider font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`pb-3 border-b-2 transition whitespace-nowrap min-h-[40px] ${activeTab === "details" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
              >
                Atelier Craft
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`pb-3 border-b-2 transition whitespace-nowrap min-h-[40px] ${activeTab === "care" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
              >
                Fabric & Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 border-b-2 transition whitespace-nowrap min-h-[40px] ${activeTab === "reviews" ? "border-amber-800 text-amber-800 dark:text-amber-400 dark:border-amber-400" : "border-transparent text-neutral-500 hover:text-foreground"}`}
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
                  <p>• Dry clean only for raw silk, georgette, and velvet pieces.</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="glass-input p-2.5 rounded-xs outline-none text-xs"
                      />
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="glass-input p-2.5 rounded-xs outline-none text-xs"
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
                      className="w-full glass-input p-2.5 rounded-xs outline-none text-xs"
                    />
                    <button
                      type="submit"
                      className="bg-[#102B24] text-white dark:bg-amber-400 dark:text-black px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 min-h-[40px]"
                    >
                      <Send className="w-3 h-3" /> Submit Review
                    </button>
                  </form>

                  {/* Existing Reviews */}
                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-100/60 dark:bg-neutral-800/40 rounded-xs">
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close Fullscreen View"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedImageIndex] || product.image}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xs"
          />
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#F7F3EC] dark:bg-neutral-900 max-w-lg w-full p-6 rounded-sm space-y-4 shadow-2xl border border-neutral-300 dark:border-neutral-800">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif text-xl text-foreground font-semibold">Standard Atelier Size Chart (Inches)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-neutral-500 hover:text-black dark:hover:text-white p-2 min-w-[44px] min-h-[44px]">✕</button>
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
              className="w-full bg-[#102B24] text-[#F7F3EC] py-3 text-xs uppercase tracking-widest font-semibold min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Related Products Carousel */}
      <section className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-neutral-200/80 dark:border-neutral-800">
        <h2 className="text-2xl sm:text-3xl font-serif mb-6 sm:mb-8 text-foreground">Complete the Look</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4">
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
