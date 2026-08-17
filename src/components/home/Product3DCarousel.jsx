import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { formatINR } from "@/utils/cn";

export function Product3DCarousel({ products = [] }) {
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Mouse drag scrolling state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  // Ensure unique products array (max 8)
  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.slug || p.id, p])).values()
  ).slice(0, 8);

  // Detect touch device / reduced motion
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    setIsTouchDevice(isTouch);
  }, []);

  // Automatic swipe every 2 seconds (pauses when user hovers or interacts)
  useEffect(() => {
    if (!isVisible || isHovered || uniqueProducts.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIdx = (prevIndex + 1) % uniqueProducts.length;
        const el = scrollRef.current;
        if (el && el.children[nextIdx]) {
          const child = el.children[nextIdx];
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const targetScroll = childCenter - el.clientWidth / 2;
          el.scrollTo({ left: targetScroll, behavior: "smooth" });
        }
        return nextIdx;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isVisible, isHovered, uniqueProducts.length]);

  // Update card 3D transforms based on horizontal scroll position
  const updateCardTransforms = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.children);

    let minDistance = Infinity;
    let currentActiveIdx = 0;

    cards.forEach((child, idx) => {
      const cRect = child.getBoundingClientRect();
      const cCenter = cRect.left + cRect.width / 2;
      const dist = (cCenter - center) / (rect.width / 2);
      const clamped = Math.max(-1.5, Math.min(1.5, dist));
      const absClamped = Math.abs(clamped);

      if (absClamped < minDistance) {
        minDistance = absClamped;
        currentActiveIdx = idx;
      }

      // Base asymmetric tilt offset per card for an organic runway feel
      const asymmetricOffset = ((idx % 3) - 1) * 1.5;
      const rotateY = -clamped * 14 + asymmetricOffset;
      const translateZ = 60 - absClamped * 100;
      const scale = 1 - absClamped * 0.08;
      const opacity = 1 - Math.min(absClamped * 0.2, 0.35);

      child.style.setProperty("--scroll-rotate-y", `${rotateY.toFixed(2)}deg`);
      child.style.setProperty("--scroll-translate-z", `${translateZ.toFixed(0)}px`);
      child.style.setProperty("--scroll-scale", `${scale.toFixed(3)}`);
      child.style.setProperty("--scroll-opacity", `${opacity.toFixed(2)}`);
      child.setAttribute("data-active", absClamped < 0.35 ? "true" : "false");
    });

    setActiveIndex(currentActiveIdx);
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  // Scroll event & Resize listener
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateCardTransforms();
    const handleScroll = () => requestAnimationFrame(updateCardTransforms);

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateCardTransforms, uniqueProducts]);

  // Convert vertical wheel to horizontal scroll inside section when applicable
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      const atLeft = el.scrollLeft <= 2;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;

      // Allow natural page scroll if user scrolls up at beginning or down at end
      if ((e.deltaY < 0 && atLeft) || (e.deltaY > 0 && atRight)) return;

      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 1.1, behavior: "auto" });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // primary button only
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    scrollLeftStart.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) {
      hasDragged.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftStart.current - dx;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Scroll to index
  const scrollToIndex = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx];
    if (child) {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const targetScroll = childCenter - el.clientWidth / 2;
      el.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const scrollStep = (direction) => {
    const targetIdx =
      direction === "next"
        ? Math.min(activeIndex + 1, uniqueProducts.length - 1)
        : Math.max(activeIndex - 1, 0);
    scrollToIndex(targetIdx);
  };

  if (!uniqueProducts.length) return null;

  return (
    <section
      ref={sectionRef}
      className="bg-[#132621] text-white py-16 md:py-20 relative overflow-hidden select-none transition-opacity duration-1000 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUpOrLeave();
      }}
      onMouseUp={handleMouseUpOrLeave}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Ambient Runway Lighting */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-[#162c26]/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-amber-600/5 blur-[120px] rounded-full"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div
        className={`max-w-4xl mx-auto px-4 text-center relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-amber-400 font-semibold">
          Swipe the runway
        </p>
        <h2 className="mt-2 text-3xl md:text-5xl font-serif tracking-tight text-neutral-100">
          The Signature Edit
        </h2>
        <p className="mt-2.5 text-xs md:text-sm text-neutral-300/80 font-light max-w-md mx-auto leading-relaxed">
          Scroll horizontally — each piece rotates through the light like it would on the ramp.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative mt-8 md:mt-10 z-10">
        {/* Navigation Arrow Left */}
        <button
          onClick={() => scrollStep("prev")}
          disabled={!canScrollLeft}
          aria-label="Previous couture item"
          className={`hidden md:flex absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-[#1c352e]/90 text-amber-300 border border-amber-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 ${
            canScrollLeft
              ? "opacity-90 hover:opacity-100 hover:scale-110 hover:border-amber-400 cursor-pointer"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={() => scrollStep("next")}
          disabled={!canScrollRight}
          aria-label="Next couture item"
          className={`hidden md:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-[#1c352e]/90 text-amber-300 border border-amber-500/20 backdrop-blur-md shadow-2xl transition-all duration-300 ${
            canScrollRight
              ? "opacity-90 hover:opacity-100 hover:scale-110 hover:border-amber-400 cursor-pointer"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Scrollable Cards Track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 sm:gap-8 md:gap-10 px-[12vw] sm:px-[22vw] lg:px-[32vw] py-10 md:py-14 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {uniqueProducts.map((p, i) => (
            <Runway3DCard
              key={`runway-${p.slug || p.id}-${i}`}
              product={p}
              index={i}
              isActive={i === activeIndex}
              isTouchDevice={isTouchDevice}
              hasDragged={hasDragged}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Runway Pagination Indicator Dots */}
        <div className="mt-2 flex justify-center items-center gap-2">
          {uniqueProducts.map((p, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "w-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  : "w-1.5 bg-neutral-600/60 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Runway3DCard({ product, index, isActive, isTouchDevice, hasDragged, isVisible }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const price = Number(product.price || 0);

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Subtle 3D tilt angles (max ~5-6 degrees)
    setTilt({
      x: -y * 10,
      y: x * 12,
    });

    // Dynamic glossy reflection glare overlay
    setGlare({
      x: (x + 0.5) * 100,
      y: (y + 0.5) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleClick = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Compute final combined 3D matrix transforms
  const hoverScale = isHovered ? 1.04 : 1;
  const hoverTranslateZ = isHovered ? 30 : 0;
  const activeExtraZ = isActive ? 35 : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative shrink-0 w-[72vw] max-w-[300px] md:max-w-[320px] transition-all duration-700 ease-out group"
      style={{
        transformStyle: "preserve-3d",
        transform: `
          perspective(1200px)
          translateZ(calc(var(--scroll-translate-z, 0px) + ${hoverTranslateZ + activeExtraZ}px))
          rotateY(calc(var(--scroll-rotate-y, 0deg) + ${tilt.y.toFixed(2)}deg))
          rotateX(${tilt.x.toFixed(2)}deg)
          scale(calc(var(--scroll-scale, 1) * ${hoverScale}))
        `,
        opacity: "var(--scroll-opacity, 1)",
        transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
      }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug || product.id }}
        onClick={handleClick}
        className={`relative block overflow-hidden bg-[#e5e2da] text-neutral-900 rounded-xs transition-all duration-500 border border-amber-900/25 ${
          isActive
            ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_35px_rgba(217,119,6,0.18)]"
            : "shadow-xl hover:shadow-2xl"
        }`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glossy Reflective Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`,
            opacity: glare.opacity,
          }}
          aria-hidden="true"
        />

        {/* Product Image Layer with Parallax */}
        <div
          className="aspect-[3/4] overflow-hidden bg-neutral-200 relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={product.image || product.images?.[0]?.src || "/placeholder.jpg"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              transform: `scale(1.06) translate3d(${(-tilt.y * 0.4).toFixed(1)}px, ${(tilt.x * 0.4).toFixed(1)}px, 0)`,
            }}
          />
          {/* Edge shadow inside card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Card Info Footer */}
        <div
          className="p-4 md:p-5 bg-[#e2ded5] border-t border-neutral-300/70 relative z-10 transition-colors duration-300 group-hover:bg-[#dad5cb]"
          style={{
            transform: "translateZ(10px)",
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-semibold transition-all duration-300 group-hover:tracking-[0.32em] group-hover:text-amber-900">
              {product.category || "Couture"}
            </p>
            {price > 0 && (
              <span className="text-[11px] font-medium text-amber-900/90 font-serif">
                {formatINR(price)}
              </span>
            )}
          </div>
          <p className="mt-1 font-serif text-base md:text-lg line-clamp-1 text-neutral-900 font-medium transition-transform duration-300 group-hover:-translate-y-0.5">
            {product.name}
          </p>
        </div>
      </Link>
    </div>
  );
}
