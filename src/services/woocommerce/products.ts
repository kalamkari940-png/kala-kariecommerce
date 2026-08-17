import { isWooConfigured, wooFetch } from './config';
import { seedProducts } from '@/constants/seedCatalog';
import type { WooProduct } from '@/types/woocommerce';

let localCatalog: WooProduct[] = [];

export function normalizeWooProduct(p: any): WooProduct {
  const priceNum = parseFloat(p.price) || 0;
  const regPriceNum = parseFloat(p.regular_price || p.price) || priceNum;
  const salePriceNum = p.sale_price ? parseFloat(p.sale_price) : undefined;
  
  const mainImg = p.images?.[0]?.src || p.image || '';
  const galleryImgs = p.images?.map((img: any) => img.src) || (p.gallery || (mainImg ? [mainImg] : []));

  const rawDesc = p.description || p.short_description || '';
  const cleanDesc = typeof rawDesc === 'string' ? rawDesc.replace(/<[^>]*>?/gm, '').trim() : '';

  let sizes: string[] = p.sizes || [];
  let fabric: string | undefined = p.fabric;
  let craft: string | undefined = p.craft;
  let motive: string | undefined = p.motive;

  if (Array.isArray(p.attributes)) {
    const sizeAttr = p.attributes.find((a: any) => /size/i.test(a.name));
    if (sizeAttr && Array.isArray(sizeAttr.options) && sizeAttr.options.length > 0) {
      sizes = sizeAttr.options;
    }
    const fabricAttr = p.attributes.find((a: any) => /fabric/i.test(a.name));
    if (fabricAttr && fabricAttr.options?.[0]) fabric = fabricAttr.options[0];

    const craftAttr = p.attributes.find((a: any) => /craft/i.test(a.name));
    if (craftAttr && craftAttr.options?.[0]) craft = craftAttr.options[0];

    const motiveAttr = p.attributes.find((a: any) => /motive|pattern/i.test(a.name));
    if (motiveAttr && motiveAttr.options?.[0]) motive = motiveAttr.options[0];
  }

  const primaryCategory = p.categories?.[0]?.name || p.category || '';

  return {
    ...p,
    id: p.id,
    name: p.name || 'Untitled Product',
    slug: p.slug || (p.name ? p.name.toLowerCase().replace(/\s+/g, '-') : String(p.id)),
    price: priceNum,
    regular_price: regPriceNum,
    sale_price: salePriceNum,
    on_sale: p.on_sale || Boolean(salePriceNum && salePriceNum < regPriceNum),
    description: cleanDesc,
    category: primaryCategory,
    categories: p.categories || [],
    images: p.images || (mainImg ? [{ id: 1, src: mainImg }] : []),
    image: mainImg,
    gallery: galleryImgs,
    sizes: sizes,
    fabric: fabric,
    craft: craft,
    motive: motive,
    stock_quantity: p.stock_quantity ?? 0,
    stock_status: p.stock_status || 'instock',
    readyToShip: p.stock_status === 'instock',
    rating_count: p.rating_count || 0,
    average_rating: String(p.average_rating || '0.00'),
    bestSeller: p.featured || (p.total_sales && p.total_sales > 5) || false,
    newArrival: p.newArrival ?? true
  };
}

export const wooProductService = {
  async getProducts(params?: { 
    category?: string; 
    featured?: boolean; 
    on_sale?: boolean;
    search?: string; 
    per_page?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WooProduct[]> {
    if (isWooConfigured) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('per_page', String(params?.per_page || 100));
        if (params?.category) queryParams.set('category', params.category);
        if (params?.featured) queryParams.set('featured', 'true');
        if (params?.on_sale) queryParams.set('on_sale', 'true');
        if (params?.search) queryParams.set('search', params.search);
        if (params?.orderby) queryParams.set('orderby', params.orderby);
        if (params?.order) queryParams.set('order', params.order);

        const endpoint = `products?${queryParams.toString()}`;
        const wooProds = await wooFetch<any[]>(endpoint);
        if (wooProds && Array.isArray(wooProds) && wooProds.length > 0) {
          return wooProds.map(p => normalizeWooProduct(p));
        }
      } catch (err) {
        console.warn('Could not fetch products from WooCommerce REST API. Falling back to seed catalog:', err);
      }
    }

    // Local / seed fallback handling
    let filtered = [...localCatalog];
    if (params?.category) {
      const catLower = params.category.toLowerCase();
      filtered = filtered.filter(p => 
        (p.category && p.category.toLowerCase() === catLower) ||
        p.categories?.some(c => c.slug === catLower || c.name.toLowerCase() === catLower)
      );
    }
    if (params?.featured) {
      filtered = filtered.filter(p => p.featured || p.bestSeller);
    }
    if (params?.on_sale) {
      filtered = filtered.filter(p => p.on_sale || Boolean(p.sale_price && p.sale_price < p.regular_price));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return filtered.map(p => normalizeWooProduct(p));
  },

  async getOnSaleProducts(limit = 10): Promise<WooProduct[]> {
    return this.getProducts({ on_sale: true, per_page: limit });
  },

  async getBestSellers(limit = 10): Promise<WooProduct[]> {
    return this.getProducts({ orderby: 'popularity', order: 'desc', per_page: limit });
  },

  async getNewArrivals(limit = 10): Promise<WooProduct[]> {
    return this.getProducts({ orderby: 'date', order: 'desc', per_page: limit });
  },

  async getProductBySlug(slug: string): Promise<WooProduct | null> {
    if (isWooConfigured) {
      try {
        const prods = await wooFetch<any[]>(`products?slug=${encodeURIComponent(slug)}`);
        if (prods && prods.length > 0) {
          return normalizeWooProduct(prods[0]);
        }
      } catch (err) {
        console.warn(`WooCommerce fetch by slug '${slug}' failed:`, err);
      }
    }

    const found = localCatalog.find(p => p.slug === slug);
    return found ? normalizeWooProduct(found) : null;
  },

  async createProduct(productData: Partial<WooProduct>): Promise<WooProduct> {
    if (isWooConfigured) {
      try {
        const payload = {
          name: productData.name,
          slug: productData.slug,
          type: 'simple',
          regular_price: String(productData.regular_price || productData.price || 0),
          description: productData.description || '',
          images: productData.image ? [{ src: productData.image }] : []
        };
        const newProd = await wooFetch<any>('products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        return normalizeWooProduct(newProd);
      } catch (err) {
        console.warn('WooCommerce createProduct failed, updating local state:', err);
      }
    }

    const created: WooProduct = normalizeWooProduct({
      id: Date.now(),
      name: productData.name || 'New Product',
      slug: productData.slug || (productData.name || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      price: Number(productData.price) || 0,
      regular_price: Number(productData.regular_price || productData.price) || 0,
      description: productData.description || '',
      category: productData.category || 'Anarkali',
      categories: [{ id: 1, name: productData.category || 'Anarkali', slug: (productData.category || 'anarkali').toLowerCase() }],
      images: [{ id: 1, src: productData.image || '' }],
      image: productData.image,
      gallery: productData.gallery || [productData.image || ''],
      sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
      stock_quantity: 10,
      bestSeller: false,
      newArrival: true
    });
    localCatalog = [created, ...localCatalog];
    return created;
  },

  async updateProduct(id: number | string, patch: Partial<WooProduct>): Promise<WooProduct> {
    if (isWooConfigured) {
      try {
        const payload: Record<string, any> = {};
        if (patch.name) payload.name = patch.name;
        if (patch.price !== undefined) payload.regular_price = String(patch.price);
        if (patch.description) payload.description = patch.description;

        const updated = await wooFetch<any>(`products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        return normalizeWooProduct(updated);
      } catch (err) {
        console.warn(`WooCommerce updateProduct for ID ${id} failed:`, err);
      }
    }

    localCatalog = localCatalog.map(p => (String(p.id) === String(id) || p.slug === id) ? normalizeWooProduct({ ...p, ...patch }) : p);
    return localCatalog.find(p => String(p.id) === String(id) || p.slug === id) as WooProduct;
  },

  async deleteProduct(id: number | string): Promise<boolean> {
    if (isWooConfigured) {
      try {
        await wooFetch(`products/${id}?force=true`, { method: 'DELETE' });
        return true;
      } catch (err) {
        console.warn(`WooCommerce deleteProduct for ID ${id} failed:`, err);
      }
    }

    localCatalog = localCatalog.filter(p => String(p.id) !== String(id) && p.slug !== id);
    return true;
  }
};

