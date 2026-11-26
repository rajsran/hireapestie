import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/** True only when an admin password has been configured. */
export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

export function getExpectedToken(): string {
  return createHash('sha256')
    .update((process.env.ADMIN_PASSWORD ?? '') + 'gm-salt-2024')
    .digest('hex');
}

// Never treat anyone as authenticated while ADMIN_PASSWORD is unset,
// otherwise the "empty password" token would be guessable.
export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  return store.get('admin_token')?.value === getExpectedToken();
}

export function checkAdminRequest(req: NextRequest): boolean {
  if (!isAdminConfigured()) return false;
  return req.cookies.get('admin_token')?.value === getExpectedToken();
}
