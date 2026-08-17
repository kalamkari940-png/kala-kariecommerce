import { isWooConfigured, wooFetch } from './config';
import { seedOrders } from '@/constants/seedCatalog';
import type { WooOrder } from '@/types/woocommerce';

let localOrders = [...seedOrders];

export const wooOrderService = {
  async getCustomerOrders(customerId?: number | string): Promise<any[]> {
    if (isWooConfigured && customerId) {
      try {
        const orders = await wooFetch<WooOrder[]>(`orders?customer=${customerId}`);
        if (orders && Array.isArray(orders)) {
          return orders;
        }
      } catch (err) {
        console.warn('WooCommerce getCustomerOrders failed:', err);
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
        return true;
      } catch (err) {
        console.warn(`WooCommerce updateOrderStatus for ID ${id} failed:`, err);
      }
    }

    localOrders = localOrders.map(o => o.id === id ? { ...o, status } : o);
    return true;
  }
};
