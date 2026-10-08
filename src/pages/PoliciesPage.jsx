import { Reveal } from "@/components/common/Reveal";
import { Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

export function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Reveal className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Atelier Guidelines</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-foreground">Policies & Client Care</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-md mx-auto">
          Clear, transparent commitments regarding tailoring, dispatch times, exchanges, and fabric longevity.
        </p>
      </Reveal>

      <div className="space-y-6">
        <section className="glass-panel p-6 sm:p-8 rounded-sm space-y-3 shadow-sm">
          <h2 className="text-xl font-serif text-foreground font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-800 dark:text-amber-400" /> 1. Shipping & Dispatch Timeline
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            Every Kalamkari piece is crafted to order in our Chennai atelier. Standard unstitched and ready-to-wear orders dispatch within 7 to 10 business days. Custom stitched or heavily embroidered pieces require 12 to 16 business days for artisan detailing. Complimentary tracked shipping is provided on all domestic orders across India above ₹4,999.
          </p>
        </section>

        <section className="glass-panel p-6 sm:p-8 rounded-sm space-y-3 shadow-sm">
          <h2 className="text-xl font-serif text-foreground font-semibold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-800 dark:text-amber-400" /> 2. Returns & Exchange Policy
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            We accept size exchanges and returns on unstitched and standard sizing pieces within 7 days of verified delivery. Items must be returned in their original condition with security tags and cloth bags intact. Custom-tailored bespoke garments stitched to personal measurement sheets are final sale.
          </p>
        </section>

        <section className="glass-panel p-6 sm:p-8 rounded-sm space-y-3 shadow-sm">
          <h2 className="text-xl font-serif text-foreground font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-800 dark:text-amber-400" /> 3. Heirloom Garment Care
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            Handwoven raw silk, Chanderi, pure georgette, and zardozi embellished drapes must be professionally dry cleaned only. Avoid spraying perfumes or deodorants directly onto metallic zari threads. Store garments wrapped in unbleached muslin bags away from direct sunlight.
          </p>
        </section>
      </div>
    </div>
  );
}
