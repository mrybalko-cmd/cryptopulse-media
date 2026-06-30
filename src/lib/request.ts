import { createHash } from 'crypto';
import { NextRequest } from 'next/server';

export function getIpHash(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}
