import { isWooConfigured, wooFetch } from './config';
import { seedOrders } from '@/constants/seedCatalog';
import type { WooOrder } from '@/types/woocommerce';
import { getStorageItem, setStorageItem } from '@/utils/storage';

const ORDERS_STORAGE_KEY = 'kalamkari_woo_orders_v1';

function getStoredOrders(): any[] {
  const raw = getStorageItem(ORDERS_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return [...seedOrders];
}

let localOrders: any[] = getStoredOrders();

export const wooOrderService = {
  getLocalOrders(): any[] {
    return localOrders;
  },

  addLocalOrder(order: any) {
    localOrders = [order, ...localOrders];
    setStorageItem(ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
  },

  async getCustomerOrders(customerId?: number | string): Promise<any[]> {
    if (isWooConfigured && customerId) {
      try {
        const orders = await wooFetch<WooOrder[]>(`orders?customer=${customerId}`);
        if (orders && Array.isArray(orders) && orders.length > 0) {
          return orders;
        }
      } catch (err) {
        console.warn('WooCommerce getCustomerOrders failed, using local orders:', err);
      }
    }

    return localOrders;
  },

  async updateOrderStatus(id: string | number, status: string): Promise<boolean> {
    if (isWooConfigured) {
      try {
        await wooFetch(`orders/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: status.toLowerCase() })
        });
      } catch (err) {
        console.warn(`WooCommerce updateOrderStatus for ID ${id} failed:`, err);
      }
    }

    localOrders = localOrders.map(o => (String(o.id) === String(id) || o.number === id) ? { ...o, status } : o);
    setStorageItem(ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
    return true;
  }
};
