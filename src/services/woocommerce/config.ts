import { getStorageItem, setStorageItem } from '@/utils/storage';

const getWooUrl = () => {
  const envUrl = import.meta.env.VITE_WOOCOMMERCE_URL || '';
  if (!envUrl) return '';
  // Ensure http/https protocol prefix
  if (!/^https?:\/\//i.test(envUrl)) {
    return `https://${envUrl}`.replace(/\/$/, '');
  }
  return envUrl.replace(/\/$/, '');
};

export const WOO_URL = getWooUrl();
export const WOO_CK = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || '';
export const WOO_CS = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || '';

export const isWooConfigured = Boolean(WOO_URL && WOO_CK && WOO_CS);

export function getWooAuthHeader(): Record<string, string> {
  if (!WOO_CK || !WOO_CS) return {};
  try {
    const auth = btoa(`${WOO_CK}:${WOO_CS}`);
    return {
      Authorization: `Basic ${auth}`
    };
  } catch {
    return {};
  }
}

export async function wooFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!WOO_URL) {
    throw new Error('WooCommerce API URL not configured.');
  }

  const cleanEndpoint = endpoint.replace(/^\//, '');
  const baseUrl = `${WOO_URL}/wp-json/wc/v3/${cleanEndpoint}`;
  const urlObj = new URL(baseUrl);

  // Append consumer keys as query parameters if not present (helps when web servers strip Authorization headers)
  if (WOO_CK && WOO_CS && !urlObj.searchParams.has('consumer_key')) {
    urlObj.searchParams.set('consumer_key', WOO_CK);
    urlObj.searchParams.set('consumer_secret', WOO_CS);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...getWooAuthHeader(),
    ...(options.headers || {})
  };

  const res = await fetch(urlObj.toString(), { ...options, headers });
  if (!res.ok) {
    const errText = await res.text();
    let parsedErr = errText;
    try {
      const errJson = JSON.parse(errText);
      if (errJson.message) parsedErr = errJson.message;
    } catch {}
    throw new Error(`WooCommerce API Error (${res.status}): ${parsedErr}`);
  }

  return res.json() as Promise<T>;
}

export async function wooStoreFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!WOO_URL) {
    throw new Error('WooCommerce Store API URL not configured.');
  }

  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${WOO_URL}/wp-json/wc/store/v1/${cleanEndpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const nonce = getStorageItem('woo_store_nonce');
  if (nonce) {
    (headers as Record<string, string>)['Nonce'] = nonce;
  }

  const res = await fetch(url, { credentials: 'omit', ...options, headers });
  const storeNonce = res.headers.get('Nonce');
  if (storeNonce) {
    setStorageItem('woo_store_nonce', storeNonce);
  }

  if (!res.ok) {
    const errText = await res.text();
    let parsedErr = errText;
    try {
      const errJson = JSON.parse(errText);
      if (errJson.message) parsedErr = errJson.message;
    } catch {}
    throw new Error(`WooCommerce Store API Error (${res.status}): ${parsedErr}`);
  }

  return res.json() as Promise<T>;
}

