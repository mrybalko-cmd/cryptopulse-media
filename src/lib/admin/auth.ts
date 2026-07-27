import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { hasPermission, type AdminSession, type Permission } from './permissions';

const COOKIE_NAME = 'cp_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionCookie(session: AdminSession) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

// Edge-safe variant for middleware — same verification, no `next/headers`.
export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export { COOKIE_NAME as ADMIN_SESSION_COOKIE };

// For use at the top of a server component/action — redirects home if the
// signed-in user isn't allowed to touch this section (middleware already
// guarantees *someone* is signed in, just not that they have this permission).
export async function requireAdminPermission(permission: Permission): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, permission)) redirect('/admin');
  return session;
}

export async function requireOwner(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || !session.isOwner) redirect('/admin');
  return session;
}
