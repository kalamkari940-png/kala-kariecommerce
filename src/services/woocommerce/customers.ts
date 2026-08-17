import { isWooConfigured, wooFetch } from './config';
import type { WooAddress, WooCustomer } from '@/types/woocommerce';
import { getStorageItem, setStorageItem } from '@/utils/storage';

export const wooCustomerService = {
  async getCustomerProfile(id: number | string): Promise<WooCustomer | null> {
    if (isWooConfigured) {
      try {
        return await wooFetch<WooCustomer>(`customers/${id}`);
      } catch (err) {
        console.warn(`WooCommerce getCustomerProfile ID ${id} failed:`, err);
      }
    }
    const raw = getStorageItem('kalamkari_woo_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async updateCustomerAddress(id: number | string, address: { billing?: WooAddress; shipping?: WooAddress }): Promise<WooCustomer | null> {
    if (isWooConfigured) {
      try {
        return await wooFetch<WooCustomer>(`customers/${id}`, {
          method: 'PUT',
          body: JSON.stringify(address)
        });
      } catch (err) {
        console.warn(`WooCommerce updateCustomerAddress ID ${id} failed:`, err);
      }
    }
    const raw = getStorageItem('kalamkari_woo_user');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (address.billing) user.billing = address.billing;
        if (address.shipping) user.shipping = address.shipping;
        setStorageItem('kalamkari_woo_user', JSON.stringify(user));
        return user;
      } catch {}
    }
    return null;
  }
};
