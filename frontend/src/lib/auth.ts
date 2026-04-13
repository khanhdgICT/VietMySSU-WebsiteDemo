import Cookies from 'js-cookie';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: { id: string; name: string; permissions: { name: string }[] };
  isTwoFaEnabled: boolean;
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setAuth(accessToken: string, refreshToken: string, user: AuthUser) {
  Cookies.set('accessToken', accessToken, { expires: 1 });
  Cookies.set('refreshToken', refreshToken, { expires: 7 });
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  return !!Cookies.get('accessToken');
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.role?.name === 'super_admin') return true;
  return user.role?.permissions?.some((p) => p.name === permission) ?? false;
}
