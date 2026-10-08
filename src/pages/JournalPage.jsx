import { Reveal } from "@/components/common/Reveal";
import bridal from "@/assets/collection-bridal.jpg";
import festive from "@/assets/collection-festive.jpg";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function JournalPage() {
  const posts = [
    {
      title: "The Anatomy of a Zardozi Silk Anarkali",
      date: "July 12, 2026",
      category: "Artisanal Craft",
      image: bridal,
      excerpt: "Behind the 350 hours of hand needlework, micro-sequins, and antique tilla thread embroidery that bring each heirloom velvet & silk creation to life."
    },
    {
      title: "Choosing Your Sangeeth Palette: Jewel Tones vs Pastels",
      date: "June 28, 2026",
      category: "Styling Guide",
      image: festive,
      excerpt: "Why jewel tone emerald greens, ruby crimson, and deep sapphire velvets are ruling evening festivities and modern cocktail celebrations."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Reveal className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
          <Sparkles className="w-3 h-3" />
          <span>The Atelier Journal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-foreground">Craft & Couture Chronicles</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
          Stories of heritage weaves, master karigars, and modern South Indian styling guides.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post, idx) => (
          <Reveal key={idx} delay={idx * 100}>
            <div className="group glass-card p-4 sm:p-5 rounded-sm space-y-4 cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">{post.category} · {post.date}</p>
                <h2 className="text-2xl font-serif text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-400 transition font-medium">{post.title}</h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">{post.excerpt}</p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-[11px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Read Story</span> <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
