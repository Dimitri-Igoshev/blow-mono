// app/api/proxy/[[...path]]/route.ts
import { config } from "@/common/env";

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const requestExcludedHeaders = new Set(["content-length", "host"]);
const responseExcludedHeaders = new Set([
  "content-length",
  "content-encoding",
  "set-cookie",
]);

const normalizeBaseUrl = (url?: string) => (url ? url.replace(/\/$/, "") : "");
const API_BASE = normalizeBaseUrl(config.API_PROXY_TARGET);

function filterRequestHeaders(source: Headers) {
  const result = new Headers();
  source.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!hopByHopHeaders.has(lower) && !requestExcludedHeaders.has(lower)) {
      result.append(key, value);
    }
  });
  return result;
}

function filterResponseHeaders(source: Headers) {
  const result = new Headers();
  source.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!hopByHopHeaders.has(lower) && !responseExcludedHeaders.has(lower)) {
      result.append(key, value);
    }
  });
  return result;
}

function appendSetCookieHeaders(target: Headers, upstream: Response) {
  // @ts-ignore
  const setCookies: string[] | undefined = upstream.headers.getSetCookie?.();
  if (setCookies?.length) {
    for (const c of setCookies) target.append("set-cookie", c);
    return;
  }
  const one = upstream.headers.get("set-cookie");
  if (one) target.append("set-cookie", one);
}

function buildTargetUrl(req: Request, path: string[]) {
  const joined = path.length ? path.join("/") : "";
  const target = new URL(joined, `${API_BASE}/`);
  const src = new URL(req.url);
  target.search = src.search;
  return target;
}

async function createRequestInit(req: Request): Promise<RequestInit> {
  const headers = filterRequestHeaders(req.headers);
  const init: RequestInit = { method: req.method, headers, redirect: "manual" };
  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.arrayBuffer();
    if (body.byteLength > 0) init.body = body;
  }
  return init;
}

async function handle(request: Request, ctx: any) {
  if (!API_BASE) {
    return Response.json(
      { message: "API proxy target is not configured" },
      { status: 500 }
    );
  }

  const raw = ctx?.params?.path;
  const path = Array.isArray(raw) ? raw : raw ? [raw] : []; // [[...path]]: может не быть

  try {
    const upstream = await fetch(buildTargetUrl(request, path), await createRequestInit(request));
    const headers = filterResponseHeaders(upstream.headers);
    appendSetCookieHeaders(headers, upstream);

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err) {
    return Response.json(
      {
        message: "Upstream request failed",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function GET(req: Request, ctx: any) { return handle(req, ctx); }
export async function HEAD(req: Request, ctx: any) { return handle(req, ctx); }
export async function POST(req: Request, ctx: any) { return handle(req, ctx); }
export async function PUT(req: Request, ctx: any) { return handle(req, ctx); }
export async function PATCH(req: Request, ctx: any) { return handle(req, ctx); }
export async function DELETE(req: Request, ctx: any) { return handle(req, ctx); }
export async function OPTIONS(req: Request, ctx: any) { return handle(req, ctx); }
