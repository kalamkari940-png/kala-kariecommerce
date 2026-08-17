import { isWooConfigured, wooFetch } from './config';
import { seedCategories } from '@/constants/seedCatalog';
import type { WooCategory } from '@/types/woocommerce';

export const wooCategoryService = {
  async getCategories(): Promise<WooCategory[]> {
    if (isWooConfigured) {
      try {
        const cats = await wooFetch<WooCategory[]>('products/categories');
        if (cats && Array.isArray(cats) && cats.length > 0) {
          return cats;
        }
      } catch (err) {
        console.warn('WooCommerce getCategories failed, utilizing seed categories:', err);
      }
    }

    return seedCategories as unknown as WooCategory[];
  }
};
