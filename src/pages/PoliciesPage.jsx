export function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10 text-sm font-light leading-relaxed">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">Care & Guidelines</p>
        <h1 className="text-4xl font-serif mt-2">Atelier Policies</h1>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-serif">1. Shipping & Dispatch</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Each Kalamkari couture piece is crafted to order in our Chennai atelier. Standard dispatch takes 10 to 14 business days. Complimentary shipping across India is provided on orders above ₹4,999.
          </p>
        </section>

        <section className="space-y-2 border-t pt-6">
          <h2 className="text-xl font-serif">2. Returns & Exchanges</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Unstitched standard size garments can be returned or exchanged within 7 days of delivery in original condition with intact security tags. Made-to-measure custom stitched pieces are final sale.
          </p>
        </section>

        <section className="space-y-2 border-t pt-6">
          <h2 className="text-xl font-serif">3. Garment Care</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            All handloom silk, velvet, and zardozi embroidered garments must be dry cleaned only. Store in breathable muslin garment bags away from direct light.
          </p>
        </section>
      </div>
    </div>
  );
}
