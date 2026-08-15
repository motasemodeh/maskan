import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const SESSION_COOKIE_NAME = 'admin_session_token';
const SECRET_TOKEN = 'elysian_secure_admin_token_2026';

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token === SECRET_TOKEN;
}

export function getSessionCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    value: SECRET_TOKEN,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}

export { SESSION_COOKIE_NAME, SECRET_TOKEN };
