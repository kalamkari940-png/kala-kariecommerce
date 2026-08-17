import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Send } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export function SiteFooter() {
  const { settings } = useStore();

  return (
    <footer className="mt-24 border-t border-[#263e36] bg-[#162a24] text-[#f7f4ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="text-4xl font-serif italic text-white">{settings.brandName}</div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400 mt-1 font-semibold">{settings.tagline}</p>
          <p className="mt-6 max-w-sm text-sm text-neutral-300 leading-relaxed font-light">
            Handcrafted in Chennai. Rooted in heritage, cut for the modern woman.
            Every piece is made to order by our atelier of master karigars.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex items-center gap-2 border-b border-amber-800/40 pb-2">
            <input
              type="email"
              placeholder="Join the atelier list"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400 text-white"
            />
            <button aria-label="Subscribe" className="text-amber-400 hover:text-white transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <FooterCol title="Shop" links={[
          { label: "Best Sellers", to: "/shop", search: { category: "Best Sellers" } },
          { label: "Daily Wears", to: "/shop", search: { category: "Daily Wears" } },
          { label: "Recreation Outfits", to: "/shop", search: { category: "Recreation Outfits" } },
          { label: "Under ₹990", to: "/shop", search: { category: "Under 990" } }
        ]} />

        <FooterCol title="Atelier" links={[
          { label: "Our story", to: "/about" },
          { label: "Contact", to: "/contact" },
          { label: "Book appointment", to: "/contact" },
          { label: "Admin", to: "/admin" }
        ]} />

        <FooterCol title="Care" links={[
          { label: "Shipping", to: "/policies" },
          { label: "Returns", to: "/policies" },
          { label: "Size guide", to: "/policies" },
          { label: "Privacy", to: "/policies" },
          { label: "Terms", to: "/policies" }
        ]} />
      </div>

      <div className="border-t border-[#1f3730]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-xs tracking-widest uppercase text-neutral-400">
            © {new Date().getFullYear()} {settings.brandName} {settings.tagline}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-neutral-300">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-amber-400 transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-amber-400 transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube" className="hover:text-amber-400 transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-5">{title}</p>
      <ul className="space-y-3 text-sm text-neutral-300">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} search={l.search} className="hover:text-white transition-colors font-light">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
