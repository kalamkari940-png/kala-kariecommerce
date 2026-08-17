import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import founderAsset from "@/assets/founder.jpg";

export const DEFAULT_SETTINGS = {
  brandName: "Kalamkari",
  tagline: "Delivering Your Pride",
  announcements: [
    "Complimentary shipping across India on orders above ₹4,999",
    "New Launch — Recreation outfits",
    "Handcrafted with love in Chennai",
    "Flat 5% off on first order — code KALAM5"
  ],
  heroEyebrow: "The Wardrobe Edit · 2026",
  heroTitle: "Grand styles",
  heroTitleEm: "grand",
  heroTitleTail: "moments.",
  heroSubtitle: "From everyday comfort to your favourite moments.",
  founderName: "Kirubavani",
  founderRole: "Founder & Creative Director",
  founderBio: "Hi, I’m Kirubavani, the founder of Kalamkari. What began in 2023 as a small dream slowly grew into something much bigger than I had ever imagined. One order became another, one happy customer became many, and along the way, Kalamkari became more than just a brand — it became a journey built on trust, love and the beautiful people who chose to be a part of it. Today, with 10,000+ orders, every message, every review and every returning customer reminds me of how far we’ve come. A dream may begin with one person, but it grows because people believe in it. And for every person who trusted Kalamkari, chose us, came back to us or simply supported this journey — thank you. You helped turn a little dream into something real. 🤍",
  founderImage: founderAsset,
  instagramHandle: "@kalamkari.couture",
  contact: {
    studio: "42, Wallace Garden, Nungambakkam, Chennai 600006",
    phone: "+91 98400 00000",
    whatsapp: "+91 98400 00000",
    email: "hello@kalamkari.in",
    instagram: "@kalamkari.couture"
  }
};

export const ADMIN_PASSWORD = "kalamkari2026";

export const seedProducts: any[] = [];

export const seedCategories = [
  { id: 1, name: "Best Sellers", slug: "best-sellers", image: { id: 1, src: p1 } },
  { id: 2, name: "Daily Wears", slug: "daily-wears", image: { id: 2, src: p6 } },
  { id: 3, name: "Recreation Outfits", slug: "recreation-outfits", image: { id: 3, src: p4 } },
  { id: 4, name: "Under 990", slug: "under-990", image: { id: 4, src: p3 } }
];

export const seedOccasions = [
  { name: "Festival", image: p1 },
  { name: "Bridesmaid", image: p2 },
  { name: "Haldi", image: p3 },
  { name: "Sangeeth", image: p5 },
  { name: "Premium Velvets", image: p2 },
  { name: "Temple", image: p6 }
];

export const seedOrders = [
  { id: "KLM-2041", customer: "Ananya R.", email: "ananya@example.com", items: 2, total: 18450, status: "Processing", placedAt: "2026-07-08" },
  { id: "KLM-2040", customer: "Priya S.", email: "priya@example.com", items: 1, total: 6650, status: "Shipped", placedAt: "2026-07-06" },
  { id: "KLM-2039", customer: "Meera K.", email: "meera@example.com", items: 3, total: 24600, status: "Delivered", placedAt: "2026-07-01" },
  { id: "KLM-2038", customer: "Sana V.", email: "sana@example.com", items: 1, total: 5450, status: "Pending", placedAt: "2026-06-28" }
];
