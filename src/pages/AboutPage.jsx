import { useStore } from "@/hooks/useStore";
import { Reveal } from "@/components/common/Reveal";
import { Sparkles, Heart, Award, MapPin } from "lucide-react";
import founderPhoto1 from "@/assets/IMG-20260818-WA0022.jpg";
import founderPhoto2 from "@/assets/IMG-20260818-WA0023.jpg";

export function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <Reveal className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Our Atelier Story</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-foreground">Rooted in Heritage. Crafted for Pride.</h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
          {settings.brandName} was born out of reverence for South Indian textile traditions and modern, high-fashion drapes.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Primary Portrait */}
            <div className="col-span-7 relative aspect-[3/4] overflow-hidden rounded-xs shadow-2xl glass-panel p-1.5 border border-amber-800/30 dark:border-amber-400/30">
              <img
                src={founderPhoto1}
                alt={settings.founderName}
                className="w-full h-full object-cover rounded-xs hover:scale-103 transition duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-neutral-950/95 p-2.5 backdrop-blur-md rounded-xs shadow-md">
                <p className="font-serif font-bold text-xs text-foreground">{settings.founderName}</p>
                <p className="text-[9px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">{settings.founderRole}</p>
              </div>
            </div>

            {/* Complementary Portrait */}
            <div className="col-span-5 relative aspect-[3/4] overflow-hidden rounded-xs shadow-xl glass-panel p-1.5 border border-neutral-200/80 dark:border-neutral-800">
              <img
                src={founderPhoto2}
                alt={`${settings.founderName} in Nature`}
                className="w-full h-full object-cover rounded-xs hover:scale-103 transition duration-500"
              />
              <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-amber-800 text-white rounded-full text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 shadow-sm">
                <Award className="w-2.5 h-2.5" />
                <span>10k+ Orders</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-amber-800 dark:fill-amber-400" />
            Founder's Note
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{settings.founderName}</h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            {settings.founderBio}
          </p>
          <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-800 dark:text-amber-400" /> Atelier Studio
            </p>
            <p className="text-sm text-foreground font-medium">{settings.contact?.studio}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
