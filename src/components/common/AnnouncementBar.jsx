import { useStore } from "@/hooks/useStore";

export function AnnouncementBar() {
  const { settings } = useStore();
  const items = settings.announcements?.length
    ? settings.announcements
    : [
        "Complimentary shipping across India on orders above ₹4,999",
        "New Launch — Recreation outfits",
        "Handcrafted with love in Chennai",
        "Flat 5% off on first order — code KALAM5"
      ];
  const doubled = [...items, ...items, ...items];

  return (
    <div className="border-b border-amber-900/30 bg-gradient-to-r from-[#12231d] via-[#1a332a] to-[#12231d] text-[#f7f4ee] overflow-hidden select-none py-2 shadow-xs">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-12 whitespace-nowrap pr-12 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase font-medium">
          {doubled.map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className="text-[#f5eedc] font-normal">{t}</span>
              <span aria-hidden className="text-amber-400 font-semibold text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
