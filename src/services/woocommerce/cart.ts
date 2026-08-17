import { isWooConfigured, wooStoreFetch } from './config';
import type { WooCart, WooCartItem } from '@/types/woocommerce';
import { getStorageItem, setStorageItem } from '@/utils/storage';

const LOCAL_CART_KEY = 'kalamkari_woo_cart_v1';

export interface LocalCartItem {
  slug: string;
  size: string;
  qty: number;
}

export const wooCartService = {
  getLocalCart(): LocalCartItem[] {
    const raw = getStorageItem(LOCAL_CART_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveLocalCart(items: LocalCartItem[]) {
    setStorageItem(LOCAL_CART_KEY, JSON.stringify(items));
  },

  async getCart(): Promise<WooCart | null> {
    if (isWooConfigured) {
      try {
        return await wooStoreFetch<WooCart>('cart');
      } catch (err) {
        console.warn('WooCommerce Store API getCart failed, using local storage:', err);
      }
    }
    return null;
  },

  async addItem(productId: number, quantity: number = 1, size?: string): Promise<WooCart | null> {
    if (isWooConfigured) {
      try {
        return await wooStoreFetch<WooCart>('cart/add-item', {
          method: 'POST',
          body: JSON.stringify({
            id: productId,
            quantity,
            variation: size ? [{ attribute: 'Size', value: size }] : []
          })
        });
      } catch (err) {
        console.warn('WooCommerce Store API addItem failed:', err);
      }
    }
    return null;
  },

  async updateItem(itemKey: string, quantity: number): Promise<WooCart | null> {
    if (isWooConfigured) {
      try {
        return await wooStoreFetch<WooCart>(`cart/items/${itemKey}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity })
        });
      } catch (err) {
        console.warn('WooCommerce Store API updateItem failed:', err);
      }
    }
    return null;
  },

  async removeItem(itemKey: string): Promise<WooCart | null> {
    if (isWooConfigured) {
      try {
        return await wooStoreFetch<WooCart>(`cart/items/${itemKey}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('WooCommerce Store API removeItem failed:', err);
      }
    }
    return null;
  },

  async applyCoupon(couponCode: string): Promise<WooCart | null> {
    if (isWooConfigured) {
      try {
        return await wooStoreFetch<WooCart>('cart/apply-coupon', {
          method: 'POST',
          body: JSON.stringify({ code: couponCode })
        });
      } catch (err) {
        console.warn('WooCommerce Store API applyCoupon failed:', err);
      }
    }
    return null;
  }
};
