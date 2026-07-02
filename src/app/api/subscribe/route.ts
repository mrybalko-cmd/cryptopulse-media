import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, locale = 'ru', source = 'unknown' } = await req.json();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check if already subscribed
    const existing = await client.fetch(
      `*[_type == "emailSubscriber" && email == $email][0]._id`,
      { email: email.toLowerCase().trim() }
    );

    if (existing) {
      return NextResponse.json({ ok: true, already: true });
    }

    await client.create({
      _type: 'emailSubscriber',
      email: email.toLowerCase().trim(),
      locale,
      source,
      subscribedAt: new Date().toISOString(),
      active: true,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[subscribe]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
