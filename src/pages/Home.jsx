import { Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Scissors, Sparkles } from "lucide-react";
import bridal from "@/assets/collection-bridal.jpg";
import festive from "@/assets/collection-festive.jpg";
import { seedOccasions } from "@/constants/seedCatalog";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { Reveal } from "@/components/common/Reveal";
import { Product3DCarousel } from "@/components/home/Product3DCarousel";
import { HeroSlider } from "@/components/home/HeroSlider";
import { useStore } from "@/hooks/useStore";

export function HomePage() {
  const { products, loading, settings } = useStore();
  const bestSellers = products.filter((p) => p.bestSeller || p.featured || p.on_sale);
  const newArrivals = products.filter((p) => p.newArrival || !p.bestSeller);

  return (
    <div>
      {/* Interactive Hero Slider (Wardrobe Edit & Founder Story Swipe) */}
      <HeroSlider />

      {/* Category Strip */}
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">Shop by category</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif">The atelier</h2>
          </div>
          <Link to="/shop" className="hidden md:inline text-xs uppercase tracking-widest hover:text-amber-800 dark:hover:text-amber-400 transition font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {seedOccasions.map((o, i) => (
            <Reveal key={o.name} delay={i * 60}>
              <Link to="/shop" className="group text-center block">
                <div className="mx-auto aspect-square w-full overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-800 group-hover:border-amber-800 transition">
                  <img src={o.image} alt={o.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-300 font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-400 transition">{o.name}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>



      {/* 3D Product Carousel */}
      <Product3DCarousel products={products} />

      {/* Editorial Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 py-16 md:grid-cols-2">
        <Reveal><EditorialCard image={bridal} eyebrow="The Bridal Diaries" title="An heirloom, in the making." to="/shop" /></Reveal>
        <Reveal delay={120}><EditorialCard image={festive} eyebrow="Festive 26" title="The colour of celebration." to="/shop" /></Reveal>
      </section>

      {/* All Products Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">Fresh off the loom</p>
              <h2 className="mt-2 text-3xl md:text-5xl font-serif">Our Collection</h2>
            </div>
            <Link to="/shop" className="hidden md:inline text-xs uppercase tracking-widest hover:text-amber-800 dark:hover:text-amber-400 transition font-medium">Explore all →</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={(p.slug || p.id) + "-home"} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <Reveal className="border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 py-16 sm:grid-cols-2 md:grid-cols-4">
          <ValueProp icon={<Scissors className="h-5 w-5" />} title="Made to order" text="Each piece tailored to your measurements by our karigars." />
          <ValueProp icon={<Truck className="h-5 w-5" />} title="Worldwide shipping" text="Complimentary within India above ₹4,999." />
          <ValueProp icon={<ShieldCheck className="h-5 w-5" />} title="7 day returns" text="On unstitched pieces. Full refund, no questions." />
          <ValueProp icon={<Sparkles className="h-5 w-5" />} title="Atelier care" text="Personal stylists on call, 7 days a week." />
        </div>
      </Reveal>

      {/* Testimonial */}
      <Reveal className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">From our clients</p>
        <blockquote className="mt-6 font-serif text-2xl leading-relaxed md:text-4xl italic text-foreground">
          "Every time I’ve ordered from {settings.brandName || "Kalamkari"}, the outfit has felt even better than I imagined. The quality, the fit and the attention to detail make me keep coming back."
        </blockquote>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-amber-800 dark:text-amber-400 font-semibold">— Ananya R. · Bengaluru</p>
      </Reveal>
    </div>
  );
}



function EditorialCard({ image, eyebrow, title, to }) {
  return (
    <Link to={to} className="group relative block aspect-[4/5] overflow-hidden rounded-sm md:aspect-[5/6]">
      <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white md:p-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-medium">{eyebrow}</p>
        <h3 className="mt-3 font-serif text-3xl md:text-5xl">{title}</h3>
        <p className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/80">
          Discover <ArrowRight className="h-3 w-3" />
        </p>
      </div>
    </Link>
  );
}

function ValueProp({ icon, title, text }) {
  return (
    <div>
      <div className="grid h-10 w-10 place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
        {icon}
      </div>
      <p className="mt-4 font-serif text-lg">{title}</p>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">{text}</p>
    </div>
  );
}
