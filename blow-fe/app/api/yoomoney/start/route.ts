import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config } from '@/common/env'

export const dynamic = 'force-dynamic';

function randomState(len = 16) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function GET(_req: Request) {
  const state = randomState();
  const scope = 'payment-p2p';
  const clientId = config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID;
  const redirectBase = config.API_PROXY_TARGET || config.SERVER_API_URL || 'https://api.blow.ru/api';
  const normalizedBase = redirectBase.endsWith('/') ? redirectBase : `${redirectBase}/`;
  const fallbackRedirect = new URL('yoomoney/callback', normalizedBase).toString();
  const redirectUri = config.YOOMONEY_REDIRECT_URI ?? fallbackRedirect;

  // httpOnly cookie с 10-мин TTL
  const res = new NextResponse(
    `<!doctype html>
<html><body>
<form id="f" method="POST" action="https://yoomoney.ru/oauth/authorize" accept-charset="utf-8">
  <input type="hidden" name="client_id" value="${clientId}"/>
  <input type="hidden" name="response_type" value="code"/>
  <input type="hidden" name="redirect_uri" value="${redirectUri}"/>
  <input type="hidden" name="scope" value="${scope}"/>
  <input type="hidden" name="state" value="${state}"/>
</form>
<script>document.getElementById('f').submit()</script>
</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );

  res.cookies.set({
    name: 'ym_state',
    value: state,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  return res;
}
