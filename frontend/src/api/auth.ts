const API = import.meta.env.VITE_API_URL
import { User } from '../types/user';

export async function fetchWithCredentials<T = any>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });

  const text = await res.text().catch(() => '');
  const content = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const errMsg = content?.message || content?.error || text || res.statusText;
    throw new Error(`Fetch error ${res.status}: ${errMsg}`);
  }

  return content as T;
}

// export type MeResponse = { user?: { id: string; email?: string; name?: string } };

export async function getMe(): Promise<User> {
  return fetchWithCredentials<User>(`${API}/auth/me`);
}