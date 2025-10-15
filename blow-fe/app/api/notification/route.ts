import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { config } from "@/common/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Безопасное маскирование секретов/токенов */
function maskSecret(v: string, left = 3, right = 2) {
  if (!v) return "(empty)";
  if (v.length <= left + right) return "*".repeat(v.length);
  return `${v.slice(0, left)}${"*".repeat(v.length - left - right)}${v.slice(-right)}`;
}

function sha1(s: string) {
  return crypto.createHash("sha1").update(s, "utf8").digest("hex");
}

/** Управление объёмом логов */
const ENABLE_RAW_LOGS = false; // осторожно: может попадать чувствительное

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";
  const now = new Date().toISOString();
  const reqId = crypto.randomUUID();

  const headers = req.headers;
  const minimalHeaders = {
    "content-type": headers.get("content-type") || "",
    "user-agent": headers.get("user-agent") || "",
    "x-real-ip": headers.get("x-real-ip") || "",
    "x-forwarded-for": headers.get("x-forwarded-for") || "",
  };

  console.log(`[YooMoney][${reqId}] GET healthcheck at ${now}`, minimalHeaders);

  if (debug) {
    return NextResponse.json({ ok: true, now, reqId, headers: Object.fromEntries(headers) });
  }
  return NextResponse.json({ ok: true, now, reqId });
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  const reqId = crypto.randomUUID();
  const now = new Date().toISOString();

  const headers = req.headers;
  const minimalHeaders = {
    "content-type": headers.get("content-type") || "",
    "user-agent": headers.get("user-agent") || "",
    "x-real-ip": headers.get("x-real-ip") || "",
    "x-forwarded-for": headers.get("x-forwarded-for") || "",
  };

  console.log(`💰 [YooMoney][${reqId}] Webhook POST ${now}`, minimalHeaders);

  let raw = "";
  try {
    raw = await req.text();
  } catch (e) {
    console.error(`[YooMoney][${reqId}] Failed to read body`, e);
    return new NextResponse("cannot read body", { status: 400 });
  }

  if (ENABLE_RAW_LOGS) {
    console.log(`[YooMoney][${reqId}] raw body:`, raw);
  } else {
    console.log(`[YooMoney][${reqId}] raw length:`, raw.length);
  }

  const p = new URLSearchParams(raw);

  const notificationType = p.get("notification_type") || "";
  const opId = p.get("operation_id") || "";
  const amountRaw = p.get("amount") || "0";
  const currency = p.get("currency") || "";
  const datetime = p.get("datetime") || "";
  const sender = p.get("sender") || "";
  const codepro = p.get("codepro") || "";
  const label = p.get("label") || "";
  const received = (p.get("sha1_hash") || "").toLowerCase();
  const isTest = (p.get("test_notification") || "").toLowerCase() === "true";

  console.log(`[YooMoney][${reqId}] parsed`, {
    notificationType, opId, amountRaw, currency, datetime, sender, codepro, label, isTest, hasHash: !!received,
  });

  // СЕКРЕТ из настроек уведомлений (НЕ OAuth secret!)
  const secret = config.YOOMONEY_NOTIFICATION_SECRET || "";

  // Формула из доков ЮMoney:
  // notification_type&operation_id&amount&currency&datetime&sender&codepro&notification_secret&label
  const base = [
    notificationType,
    opId,
    amountRaw,
    currency,
    datetime,
    sender,
    codepro,
    secret,
    label,
  ].join("&");

  const computed = sha1(base);
  const signatureOk = !!secret && received === computed;

  console.log(`[YooMoney][${reqId}] signature check`, {
    secret: maskSecret(secret),
    received,
    computed,
    ok: signatureOk,
  });

  if (!secret || !signatureOk) {
    // Плохая подпись — пусть ЮMoney ретраит (ожидаем 400)
    console.warn(`[YooMoney][${reqId}] bad signature -> 400`);
    return new NextResponse("bad signature", { status: 400 });
  }

  if (codepro === "true") {
    console.warn(`[YooMoney][${reqId}] codepro=true (protected) -> 202`);
    return new NextResponse("protected", { status: 202 });
  }

  if (isTest) {
    console.log(`[YooMoney][${reqId}] test_notification=true -> 200`);
    return NextResponse.json({ ok: true, test: true, reqId });
  }

  // Достаём userId из label (например, "uid:<userId>:<nonce>")
  const userId = (label.startsWith("uid:") ? label.slice(4) : label).split(":")[0] || "";
  // Нормализуем десятичный разделитель
  const amount = Number.parseFloat(amountRaw.replace(",", "."));

  if (!userId || !Number.isFinite(amount) || amount <= 0) {
    console.warn(`[YooMoney][${reqId}] skip: invalid userId/amount`, { userId, amount });
    return NextResponse.json({ ok: true, skipped: true, reqId });
  }

  // Пример конвертации: amount / 97 * 100 (как было у вас)
  const credited = (amount / 97) * 100;

  // Зовём ваш внутренний API (с таймаутом)
  const apiUrl = `${config.API_URL}/payment/top-up`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  let apiStatus = 0;
  let apiText = "";
  try {
    console.log(`[YooMoney][${reqId}] -> POST ${apiUrl}`, { userId, amount, credited, opId });

    const res = await fetch(apiUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Provider": "yoomoney",
        "X-Operation-Id": opId,
      },
      body: JSON.stringify({ userId, amount: credited }),
      cache: "no-store",
    });

    apiStatus = res.status;
    apiText = await res.text().catch(() => "");

    console.log(`[YooMoney][${reqId}] <- ${apiStatus} from backend`, apiText?.slice(0, 500));
  } catch (err: any) {
    console.error(`[YooMoney][${reqId}] backend call failed`, err?.name || err, err?.message || "");
  } finally {
    clearTimeout(timeout);
  }

  const ms = Date.now() - started;
  console.log(`[YooMoney][${reqId}] done in ${ms}ms -> 200`);

  // Даже при ошибке бэкенда отвечаем 200 — чтобы ЮMoney не ретраил.
  return NextResponse.json({
    ok: true,
    reqId,
    processed: true,
    userId,
    amount,
    credited,
    backend: { url: apiUrl, status: apiStatus, sample: apiText?.slice(0, 200) },
    timeMs: ms,
  });
}


// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import { config } from "@/common/env";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// function sha1(s: string) {
// 	return crypto.createHash("sha1").update(s, "utf8").digest("hex");
// }

// export async function POST(req: NextRequest) {
// 	console.log("💰 YooMoney webhook", req.url);

// 	// ЮMoney шлёт application/x-www-form-urlencoded
// 	const raw = await req.text();
// 	const p = new URLSearchParams(raw);

// 	const notificationType = p.get("notification_type") || "";
// 	const opId = p.get("operation_id") || "";
// 	const amountRaw = p.get("amount") || "0";
// 	const currency = p.get("currency") || "";
// 	const datetime = p.get("datetime") || "";
// 	const sender = p.get("sender") || "";
// 	const codepro = p.get("codepro") || "";
// 	const label = p.get("label") || "";
// 	const received = (p.get("sha1_hash") || "").toLowerCase();
// 	const isTest = (p.get("test_notification") || "").toLowerCase() === "true";

// 	// ВАЖНО: это СЕКРЕТНОЕ СЛОВО ИЗ НАСТРОЕК УВЕДОМЛЕНИЙ, не OAuth secret!
// 	const secret = config.YOOMONEY_NOTIFICATION_SECRET || "";

// 	// Формула из доков:
// 	// notification_type&operation_id&amount&currency&datetime&sender&codepro&notification_secret&label
// 	const base = [
// 		notificationType,
// 		opId,
// 		amountRaw,
// 		currency,
// 		datetime,
// 		sender,
// 		codepro,
// 		secret,
// 		label,
// 	].join("&");

// 	const computed = sha1(base);

// 	if (!secret || received !== computed) {
// 		// Подпись не сошлась — отвечаем 400, чтобы ЮMoney повторил попытку
// 		return new NextResponse("bad signature", { status: 400 });
// 	}

// 	// ЮMoney теперь не делает codepro/hold, но поле присылают — на всякий случай проверим
// 	if (codepro === "true") {
// 		return new NextResponse("protected", { status: 202 });
// 	}

// 	// Тестовые уведомления не проводим в биллинг
// 	if (isTest) {
// 		return NextResponse.json({ ok: true, test: true });
// 	}

// 	// Из label достаём userId (например "uid:<userId>:<nonce>")
// 	const userId =
// 		(label.startsWith("uid:") ? label.slice(4) : label).split(":")[0] || "";
// 	// На всякий случай нормализуем десятичный разделитель
// 	const amount = Number.parseFloat(amountRaw.replace(",", "."));

// 	// Если нечего проводить — просто 200, чтобы ЮMoney не ретраил
// 	if (!userId || !Number.isFinite(amount) || amount <= 0) {
// 		return NextResponse.json({ ok: true, skipped: true });
// 	}

// 	// Делаем короткий вызов API с таймаутом.
// 	try {
// 		const controller = new AbortController();
// 		const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s таймаут
// 		const res = await fetch(`${config.API_URL}/payment/top-up`, {
// 			method: "POST",
// 			signal: controller.signal,
// 			headers: {
// 				"Content-Type": "application/json",
// 				"X-Provider": "yoomoney",
// 				"X-Operation-Id": opId,
// 			},
// 			body: JSON.stringify({
// 				userId,
// 				amount: +amount / 97 * 100,
// 				// operationId: opId,
// 				// provider: "yoomoney",
// 			}),
// 		})
// 			.then((res) => console.log(res))
// 			.catch((err) => console.log(err))
// 			.finally(() => clearTimeout(timeout));
// 	} catch {
// 		// Сетевая ошибка/таймаут — всё равно отвечаем 200, чтобы не копить ретраи у ЮMoney.
// 	}

// 	return NextResponse.json({ ok: true });
// }

// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
// import { config } from '@/common/env'

// function sha1(s: string) {
//   return crypto.createHash('sha1').update(s).digest('hex');
// }

// export async function POST(req: NextRequest) {
//   const text = await req.text();                // важно: не req.json()
//   const p = new URLSearchParams(text);

//   const secret = config.NEXT_YOOMONEY_CLIENT_SECRET || '';
//   const received = (p.get('sha1_hash') || '').toLowerCase();

//   const base = [
//     secret,
//     p.get('operation_id') || '',
//     p.get('amount') || '',
//     p.get('currency') || '',
//     p.get('datetime') || '',
//     p.get('sender') || '',
//     p.get('codepro') || '',
//     p.get('label') || '',
//   ].join('&');

//   const computed = sha1(base);

//   if (!secret || received !== computed) {
//     return new NextResponse('bad signature', { status: 400 });
//   }

//   if (p.get('codepro') === 'true') {
//     // платёж с кодом протекции — не считаем оплаченным
//     return new NextResponse('protected', { status: 202 });
//   }

//   // TODO: отметить заказ p.get('label') как оплачен
//   // сумма: parseFloat(p.get('amount') || '0')

//   return NextResponse.json({ ok: true });
// }

// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { config } from '@/common/env'

// export const dynamic = 'force-dynamic'; // чтобы не кэшировал

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const code = url.searchParams.get('code');
//   const state = url.searchParams.get('state');

//   if (!code) {
//     return NextResponse.json({ error: 'missing_code' }, { status: 400 });
//   }

//   // проверяем state из cookie, которую ставили при старте OAuth
//   // @ts-ignore
//   const expected = cookies()?.get('ym_state')?.value;
//   if (expected && state && expected !== state) {
//     return NextResponse.redirect(new URL('/auth/error?reason=state_mismatch', url.origin));
//   }

//   const clientId = config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID;
//   const clientSecret = config.NEXT_YOOMONEY_CLIENT_SECRET;
//   const redirectUri =
//     config.YOOMONEY_REDIRECT_URI ?? `${url.origin}/api/yoomoney/callback`;

//   if (!clientId || !clientSecret) {
//     return NextResponse.json({ error: 'server_not_configured' }, { status: 500 });
//   }

//   try {
//     // обмен кода на токен
//     const form = new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: redirectUri,
//       client_id: clientId, // оставим и в body, и в Basic — так надёжнее
//     });

//     const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

//     const res = await fetch('https://yoomoney.ru/oauth/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: `Basic ${basic}`,
//       },
//       body: form.toString(),
//       cache: 'no-store',
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       return NextResponse.redirect(
//         new URL(`/auth/error?reason=token_error&msg=${encodeURIComponent(text)}`, url.origin)
//       );
//     }

//     const token = await res.json(); // { access_token, expires_in, ... }

//     // кладём токен в httpOnly-cookie и редиректим на дашборд
//     const resp = NextResponse.redirect(new URL('https://blow.ru/account/services', url.origin));
//     resp.cookies.set({
//       name: 'ym_token',
//       value: token.access_token,
//       httpOnly: true,
//       secure: true,
//       sameSite: 'lax',
//       path: '/',
//       maxAge: typeof token.expires_in === 'number' ? token.expires_in : 60 * 60 * 24,
//     });
//     // очищаем state
//     resp.cookies.set('ym_state', '', { path: '/', maxAge: 0 });

//     return resp;
//   } catch (e) {
//     return NextResponse.redirect(new URL('/auth/error?reason=exception', url.origin));
//   }
// }

// 'use client';
// import { useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useExchangeCodeMutation } from '@/redux/services/yoomoneyApi'

// export default function YoomoneyCallbackPage() {
//   const sp = useSearchParams();
//   const router = useRouter();
//   const code = sp.get('code');
//   const state = sp.get('state');
//   const [exchangeCode, { isLoading, data, error }] = useExchangeCodeMutation();

//   useEffect(() => {
//     const expected = sessionStorage.getItem('ym_state');
//     if (state && expected && state !== expected) {
//       console.error('State mismatch');
//       return;
//     }
//     if (code) {
//       exchangeCode({ code }); // см. RTK Query ниже
//     }
//   }, [code, state, exchangeCode]);

//   if (isLoading) return <p>Завершаем вход…</p>;
//   if (error) return <p>Ошибка обмена кода на токен</p>;
//   if (data) {
//     // здесь можешь сохранить токен в сторадж/куки или вызвать бекенд для связки с аккаунтом
//     router.replace('/dashboard');
//   }
//   return null;
// }

// import { config } from '@/common/env'
// import { NextRequest, NextResponse } from 'next/server';

// const APP_URL = config.NEXT_PUBLIC_APP_URL!;
// const API = config.NEXT_PUBLIC_API_URL!;

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const code = url.searchParams.get('code');
//   const state = url.searchParams.get('state') ?? undefined;

//   if (!code) return NextResponse.redirect(`${APP_URL}/billing?error=missing_code`);

//   // Прокидываем code на ваш бэкенд для обмена на access_token и привязки к текущему пользователю
//   const r = await fetch(`${API}/yoomoney/oauth/token`, {
//     method: 'POST',
//     headers: { 'content-type': 'application/json' },
//     body: JSON.stringify({ code, state }),
//     cache: 'no-store',
//   });

//   if (!r.ok) {
//     return NextResponse.redirect(`${APP_URL}/billing?error=token_exchange_failed`);
//   }

//   return NextResponse.redirect(`${APP_URL}/billing?connected=yoomoney`);
// }

//=====================

// import { NextRequest } from "next/server";

// import { IncomingPayload } from "../types";

// export async function POST(req: NextRequest): Promise<Response> {
//   try {
//     const data: IncomingPayload = await req.json();

//     console.log('Получены данные от внешнего API:', data);

//     // Отправляем внутреннее уведомление
//     const result = await fetch('https://blow.igoshev.de/api/payment/notification', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ orderId: data.OrderId, status: data.Status }),
//     });

//     if (result.ok) {
//       return new Response('OK', {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/plain',
//         },
//       });
//     }

//     // В случае ошибки от внутреннего API
//     return new Response(JSON.stringify({ message: 'Ошибка сервера при зачислении средств' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('[WEBHOOK ERROR]', error);

//     return new Response(JSON.stringify({ message: 'Ошибка сервера' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
