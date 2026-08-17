import { useStore } from "@/hooks/useStore";
import { Reveal } from "@/components/common/Reveal";

export function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <Reveal className="text-center max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">Our Heritage</p>
        <h1 className="mt-3 text-4xl sm:text-6xl font-serif">The Atelier Story</h1>
        <p className="mt-6 text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
          {settings.brandName} was born out of reverence for South Indian textile traditions and modern, high-fashion drapes.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <img
            src={settings.founderImage}
            alt={settings.founderName}
            className="w-full aspect-[4/5] object-cover rounded-sm shadow-xl"
          />
        </Reveal>

        <Reveal delay={100} className="space-y-6">
          <p className="text-xs uppercase tracking-widest text-amber-800 font-medium">{settings.founderRole}</p>
          <h2 className="text-3xl font-serif">{settings.founderName}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            {settings.founderBio}
          </p>
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Atelier Studio</p>
            <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-1">{settings.contact?.studio}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
