import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Quote, Heart, Award } from "lucide-react";
import hero from "@/assets/hero-1.jpg";
import kirubavani1 from "@/assets/kirubavani-1.jpg";
import kirubavaniCollage from "@/assets/kirubavani-collage.jpg";
import { useStore } from "@/hooks/useStore";

export function HeroSlider() {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const heroImgRef = useRef(null);

  const totalSlides = 2;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = heroImgRef.current;
      if (!el) return;
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${Math.min(y * 0.1, 50)}px, 0) scale(${1 + Math.min(y / 6000, 0.03)})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden bg-[#f7f4ee] dark:bg-[#111d19] transition-colors duration-500 border-b border-neutral-200/60 dark:border-neutral-800"
    >
      {/* Slide Controls - Floating Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white grid place-items-center shadow-lg hover:bg-neutral-950 hover:text-white dark:hover:bg-amber-400 dark:hover:text-black transition duration-300 group"
      >
        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white grid place-items-center shadow-lg hover:bg-neutral-950 hover:text-white dark:hover:bg-amber-400 dark:hover:text-black transition duration-300 group"
      >
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* SLIDE 01: The Wardrobe Edit */}
        {currentSlide === 0 && (
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-xs uppercase tracking-[0.25em] font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Wardrobe Edit · 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.06] tracking-tight text-[#1c1917] dark:text-[#f7f4ee]">
                Grand styles<br />for <em className="italic text-[#b4833e] dark:text-amber-400 font-normal">grand</em> moments.
              </h1>

              <p className="mt-6 max-w-lg text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                From everyday comfort to your favourite moments.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="bg-[#1c2d27] text-[#f7f4ee] px-8 py-4 text-xs uppercase tracking-widest hover:bg-[#263e36] transition flex items-center gap-2 font-semibold shadow-md rounded-xs"
                >
                  Shop the edit <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/shop"
                  className="border border-neutral-400 dark:border-neutral-700 px-8 py-4 text-xs uppercase tracking-widest hover:border-[#1c2d27] dark:hover:border-amber-400 transition font-semibold text-[#1c1917] dark:text-[#f7f4ee] rounded-xs"
                >
                  New arrivals
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-6 sm:gap-8 text-xs text-neutral-500 border-t border-neutral-200/80 dark:border-neutral-800 pt-6">
                <div>
                  <p className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white">10,000+</p>
                  <p className="mt-0.5 uppercase tracking-widest text-[10px] text-neutral-500">Happy Orders</p>
                </div>
                <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700" />
                <div>
                  <p className="text-2xl font-serif font-semibold text-amber-800 dark:text-amber-400">4.9★</p>
                  <p className="mt-0.5 uppercase tracking-widest text-[10px] text-neutral-500">Customer Rating</p>
                </div>
                <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700" />
                <div>
                  <p className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white">Est. 2023</p>
                  <p className="mt-0.5 uppercase tracking-widest text-[10px] text-neutral-500">Founded in Chennai</p>
                </div>
              </div>
            </div>

            {/* Slide 1 Image Showcase */}
            <div className="order-1 md:order-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xs shadow-2xl border border-neutral-200/60 dark:border-neutral-800">
                <div ref={heroImgRef} className="h-full w-full transition-transform duration-100 ease-out">
                  <img
                    src={hero}
                    alt="Kalamkari Couture"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-neutral-950/95 p-5 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800 rounded-xs shadow-xl">
                  <p className="text-[10px] tracking-widest uppercase text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Look 01 · Handcrafted Collection
                  </p>
                  <p className="mt-1 font-serif text-xl sm:text-2xl text-foreground">Delivering Your Pride</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 02: Meet the Founder */}
        {currentSlide === 1 && (
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Story Text Left */}
            <div className="order-2 md:order-1 md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-xs uppercase tracking-[0.25em] font-semibold">
                <Heart className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 fill-amber-800 dark:fill-amber-400" />
                <span>Meet The Founder</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#1c1917] dark:text-[#f7f4ee]">
                Behind Kalamkari was a girl who started with a vision —{" "}
                <em className="italic text-[#b4833e] dark:text-amber-400 font-normal">and a lot of love for fashion.</em>
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                Hi, I’m <strong className="font-semibold text-neutral-900 dark:text-white">Kirubavani</strong>, the founder of Kalamkari. What began in <strong className="font-semibold text-amber-800 dark:text-amber-400">2023</strong> as a small dream slowly grew into something much bigger than I had ever imagined. One order became another, one happy customer became many, and along the way, Kalamkari became more than just a brand — it became a journey built on trust, love and the beautiful people who chose to be a part of it. Today, with <strong className="font-semibold text-neutral-900 dark:text-white">10,000+ orders</strong>, every message, every review and every returning customer reminds me of how far we’ve come.
              </p>

              {/* Quote Highlight Box */}
              <div className="relative p-5 sm:p-6 bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-800 dark:border-amber-400 rounded-r-xs shadow-xs text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed italic font-serif">
                <Quote className="absolute right-4 top-4 w-8 h-8 text-amber-800/10 dark:text-amber-400/10" />
                "A dream may begin with one person, but it grows because people believe in it. And for every person who trusted Kalamkari, chose us, came back to us or simply supported this journey — thank you. You helped turn a little dream into something real. 🤍"
              </div>

              <div className="pt-2 flex items-center gap-4">
                <div>
                  <p className="font-serif text-xl text-neutral-900 dark:text-white font-medium">— Kirubavani</p>
                  <p className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold mt-0.5">
                    Founder & Creative Director, Kalamkari
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Image Right */}
            <div className="order-1 md:order-2 md:col-span-5">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xs shadow-2xl border-2 border-amber-800/30 dark:border-amber-400/30 group">
                <img
                  src={kirubavani1}
                  alt="Kirubavani - Founder of Kalamkari"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlaid luxury label */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-neutral-950/95 p-4 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800 rounded-xs shadow-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-serif font-semibold text-neutral-900 dark:text-white">Kirubavani</p>
                    <p className="text-[9px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">Founder, Kalamkari</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-800 text-white rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3" />
                    <span>10k+ Orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switchers / Navigation Indicators */}
        <div className="mt-12 flex items-center justify-center gap-3 border-t border-neutral-200/80 dark:border-neutral-800 pt-6">
          <button
            onClick={() => setCurrentSlide(0)}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center gap-2 ${currentSlide === 0
                ? "bg-[#1c2d27] text-white dark:bg-amber-400 dark:text-black shadow-md"
                : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300"
              }`}
          >
            <span className="text-[10px] opacity-70">01</span>
            <span>The Wardrobe Edit</span>
          </button>

          <button
            onClick={() => setCurrentSlide(1)}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center gap-2 ${currentSlide === 1
                ? "bg-[#1c2d27] text-white dark:bg-amber-400 dark:text-black shadow-md"
                : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300"
              }`}
          >
            <span className="text-[10px] opacity-70">02</span>
            <span>Meet The Founder</span>
          </button>
        </div>
      </div>
    </section>
  );
}
