import { Reveal } from "@/components/common/Reveal";
import bridal from "@/assets/collection-bridal.jpg";
import festive from "@/assets/collection-festive.jpg";

export function JournalPage() {
  const posts = [
    {
      title: "The Anatomy of a Zardozi Lehenga",
      date: "July 12, 2026",
      category: "Craftsmanship",
      image: bridal,
      excerpt: "Behind the 400 hours of hand embroidery that go into each heirloom velvet piece."
    },
    {
      title: "Choosing Your Sangeeth Palette",
      date: "June 28, 2026",
      category: "Styling",
      image: festive,
      excerpt: "Why jewel tone emeralds and deep sapphires are ruling night festivities this season."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Reveal className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">The Atelier Editorial</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif">Kalamkari Journal</h1>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post, idx) => (
          <Reveal key={idx} delay={idx * 100}>
            <div className="group cursor-pointer space-y-4">
              <div className="aspect-[16/10] overflow-hidden rounded-sm bg-neutral-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-amber-800 font-medium">{post.category} · {post.date}</p>
              <h2 className="text-2xl font-serif group-hover:text-amber-800 transition">{post.title}</h2>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">{post.excerpt}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
