import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import founderImage1 from "@/assets/IMG-20260818-WA0022.jpg";
import founderImage2 from "@/assets/IMG-20260818-WA0023.jpg";

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
  founderImage: founderImage1,
  founderImageSecondary: founderImage2,
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

export const seedProducts: any[] = [
  {
    id: 101,
    name: "Aaradhya Zardozi Silk Anarkali",
    slug: "aaradhya-zardozi-silk-anarkali",
    price: 8450,
    regular_price: 9950,
    sale_price: 8450,
    on_sale: true,
    description: "An ethereal emerald green pure raw silk Anarkali hand-embellished with intricate gold zardozi and katori sequins along the neckline and hemline. Paired with a delicate organza dupatta.",
    category: "Best Sellers",
    categories: [
      { id: 1, name: "Best Sellers", slug: "best-sellers" },
      { id: 10, name: "Anarkali", slug: "anarkali" }
    ],
    image: p1,
    images: [{ id: 1, src: p1 }, { id: 2, src: p2 }],
    gallery: [p1, p2],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    fabric: "Silk",
    craft: "Zardozi & Sequins",
    motive: "Floral Jaal",
    stock_quantity: 12,
    stock_status: "instock",
    rating_count: 24,
    average_rating: "4.95",
    bestSeller: true,
    newArrival: true,
    badge: "BESTSELLER"
  },
  {
    id: 102,
    name: "Meera Deep Velvet Heritage Lehenga",
    slug: "meera-deep-velvet-heritage-lehenga",
    price: 14200,
    regular_price: 16500,
    sale_price: 14200,
    on_sale: true,
    description: "Midnight velvet lehenga skirt handcrafted with antique gold tilla embroidery, paired with a matching structured blouse and an ornate tissue silk veil.",
    category: "Recreation Outfits",
    categories: [
      { id: 3, name: "Recreation Outfits", slug: "recreation-outfits" },
      { id: 11, name: "Lehenga", slug: "lehenga" }
    ],
    image: p2,
    images: [{ id: 1, src: p2 }, { id: 2, src: p3 }],
    gallery: [p2, p3],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Velvet",
    craft: "Antique Tilla & Dori",
    motive: "Peacock Medallion",
    stock_quantity: 8,
    stock_status: "instock",
    rating_count: 19,
    average_rating: "4.90",
    bestSeller: true,
    newArrival: false,
    badge: "HEIRLOOM"
  },
  {
    id: 103,
    name: "Kaveri Handblock Chanderi Kurti Set",
    slug: "kaveri-handblock-chanderi-kurti-set",
    price: 890,
    regular_price: 1190,
    sale_price: 890,
    on_sale: true,
    description: "Breathable pure Chanderi cotton daily wear straight suit set with authentic Bagru block printing, side pockets, and a featherlight mulmul dupatta.",
    category: "Under 990",
    categories: [
      { id: 4, name: "Under 990", slug: "under-990" },
      { id: 2, name: "Daily Wears", slug: "daily-wears" }
    ],
    image: p3,
    images: [{ id: 1, src: p3 }, { id: 2, src: p4 }],
    gallery: [p3, p4],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "Cotton",
    craft: "Handblock Print",
    motive: "Botanical Motif",
    stock_quantity: 25,
    stock_status: "instock",
    rating_count: 32,
    average_rating: "4.85",
    bestSeller: false,
    newArrival: true,
    badge: "UNDER ₹990"
  },
  {
    id: 104,
    name: "Samyuktha Rose Gold Recreation Drape",
    slug: "samyuktha-rose-gold-recreation-drape",
    price: 11800,
    regular_price: 13500,
    sale_price: 11800,
    on_sale: true,
    description: "Celebrity inspired recreation couture outfit woven with delicate rose gold metallic threads, draped cowl silhouette, and handcrafted waist belt.",
    category: "Recreation Outfits",
    categories: [
      { id: 3, name: "Recreation Outfits", slug: "recreation-outfits" }
    ],
    image: p4,
    images: [{ id: 1, src: p4 }, { id: 2, src: p5 }],
    gallery: [p4, p5],
    sizes: ["S", "M", "L"],
    fabric: "Organza",
    craft: "Cutdana & Crystal",
    motive: "Modern Geometric",
    stock_quantity: 6,
    stock_status: "instock",
    rating_count: 15,
    average_rating: "4.92",
    bestSeller: true,
    newArrival: true,
    badge: "RECREATION"
  },
  {
    id: 105,
    name: "Nandini Crimson Georgette Anarkali",
    slug: "nandini-crimson-georgette-anarkali",
    price: 7650,
    regular_price: 8900,
    sale_price: 7650,
    on_sale: true,
    description: "Flared 32-kali crimson georgette festive gown adorned with gotapatti borders and pearl thread work. Comes with matching churidar and scalloped dupatta.",
    category: "Best Sellers",
    categories: [
      { id: 1, name: "Best Sellers", slug: "best-sellers" },
      { id: 10, name: "Anarkali", slug: "anarkali" }
    ],
    image: p5,
    images: [{ id: 1, src: p5 }, { id: 2, src: p6 }],
    gallery: [p5, p6],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Georgette",
    craft: "Gota Patti & Moti",
    motive: "Royal Mughal",
    stock_quantity: 14,
    stock_status: "instock",
    rating_count: 28,
    average_rating: "4.88",
    bestSeller: true,
    newArrival: false,
    badge: "BESTSELLER"
  },
  {
    id: 106,
    name: "Vaishnavi Handloom Daily Wear Tunic",
    slug: "vaishnavi-handloom-daily-wear-tunic",
    price: 950,
    regular_price: 1250,
    sale_price: 950,
    on_sale: true,
    description: "Lightweight indigo pure cotton casual kurti with coconut shell button detailing, mandarin collar, and three-quarter roll-up sleeves.",
    category: "Daily Wears",
    categories: [
      { id: 2, name: "Daily Wears", slug: "daily-wears" },
      { id: 4, name: "Under 990", slug: "under-990" }
    ],
    image: p6,
    images: [{ id: 1, src: p6 }, { id: 1, src: p1 }],
    gallery: [p6, p1],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "Cotton",
    craft: "Handloom Weave",
    motive: "Ikat Lines",
    stock_quantity: 30,
    stock_status: "instock",
    rating_count: 41,
    average_rating: "4.94",
    bestSeller: false,
    newArrival: true,
    badge: "UNDER ₹990"
  }
];

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
