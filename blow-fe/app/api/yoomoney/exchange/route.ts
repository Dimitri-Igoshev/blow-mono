import { config } from '@/common/env'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { code, redirect_uri } = await req.json();

  const body = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID,
    client_secret: config.NEXT_YOOMONEY_CLIENT_SECRET,
    redirect_uri,
  });

  const res = await fetch('https://yoomoney.ru/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : 400 });
}
