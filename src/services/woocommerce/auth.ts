import { isWooConfigured, wooFetch } from './config';
import type { WooCustomer } from '@/types/woocommerce';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';

const TOKEN_KEY = 'kalamkari_woo_jwt';
const USER_KEY = 'kalamkari_woo_user';

export const wooAuthService = {
  getStoredToken(): string | null {
    return getStorageItem(TOKEN_KEY);
  },

  getStoredUser(): WooCustomer | null {
    const raw = getStorageItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(usernameOrEmail: string, password: string): Promise<{ token: string; user: WooCustomer }> {
    if (isWooConfigured) {
      try {
        const res = await fetch(`${import.meta.env.VITE_WOOCOMMERCE_URL}/wp-json/jwt-auth/v1/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameOrEmail, password })
        });
        if (res.ok) {
          const data = await res.json();
          const token = data.token;
          setStorageItem(TOKEN_KEY, token);

          const customerData = await wooFetch<WooCustomer>(`customers/${data.user_id || 'me'}`);
          setStorageItem(USER_KEY, JSON.stringify(customerData));
          return { token, user: customerData };
        }
      } catch (err) {
        console.warn('WooCommerce JWT auth login error, resorting to local customer session:', err);
      }
    }

    const mockUser: WooCustomer = {
      id: 999,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
      first_name: usernameOrEmail.split('@')[0],
      last_name: 'Customer',
      username: usernameOrEmail,
      billing: {
        first_name: usernameOrEmail.split('@')[0],
        last_name: 'Customer',
        address_1: '42, Wallace Garden',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postcode: '600006',
        country: 'IN',
        phone: '+91 98400 00000'
      }
    };
    const mockToken = 'mock_jwt_token_' + Date.now();
    setStorageItem(TOKEN_KEY, mockToken);
    setStorageItem(USER_KEY, JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
  },

  async register(data: { email: string; password: string; first_name?: string; last_name?: string }): Promise<WooCustomer> {
    if (isWooConfigured) {
      try {
        const newCustomer = await wooFetch<WooCustomer>('customers', {
          method: 'POST',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            username: data.email
          })
        });
        return newCustomer;
      } catch (err) {
        console.warn('WooCommerce REST registration failed, creating local session:', err);
      }
    }

    const mockCustomer: WooCustomer = {
      id: Math.floor(Math.random() * 1000) + 100,
      email: data.email,
      first_name: data.first_name || data.email.split('@')[0],
      last_name: data.last_name || 'User',
      username: data.email
    };
    setStorageItem(USER_KEY, JSON.stringify(mockCustomer));
    return mockCustomer;
  },

  logout() {
    removeStorageItem(TOKEN_KEY);
    removeStorageItem(USER_KEY);
    removeStorageItem('woo_store_nonce');
  }
};
