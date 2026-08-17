export const isServer = typeof window === 'undefined';

export function getStorageItem(key: string): string | null {
  if (isServer) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStorageItem(key: string, value: string): void {
  if (isServer) return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function removeStorageItem(key: string): void {
  if (isServer) return;
  try {
    localStorage.removeItem(key);
  } catch {}
}
