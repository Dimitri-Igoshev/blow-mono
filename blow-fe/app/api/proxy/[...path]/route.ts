import { NextRequest, NextResponse } from "next/server";

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

const filterRequestHeaders = (source: Headers) => {
  const result = new Headers();

  source.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (
      !hopByHopHeaders.has(lowerKey) &&
      !requestExcludedHeaders.has(lowerKey)
    ) {
      result.append(key, value);
    }
  });

  return result;
};

const filterResponseHeaders = (source: Headers) => {
  const result = new Headers();

  source.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (
      !hopByHopHeaders.has(lowerKey) &&
      !responseExcludedHeaders.has(lowerKey)
    ) {
      result.append(key, value);
    }
  });

  return result;
};

const appendSetCookieHeaders = (target: Headers, response: Response) => {
  // @ts-expect-error getSetCookie is available in the runtime used by Next.js
  const setCookies: string[] | undefined = response.headers.getSetCookie?.();

  if (setCookies && setCookies.length > 0) {
    setCookies.forEach((cookie) => target.append("set-cookie", cookie));

    return;
  }

  const fallbackCookie = response.headers.get("set-cookie");

  if (fallbackCookie) {
    target.append("set-cookie", fallbackCookie);
  }
};

const buildTargetUrl = (req: NextRequest, pathSegments: string[]) => {
  const joined = pathSegments.length > 0 ? pathSegments.join("/") : "";
  const target = new URL(joined, `${API_BASE}/`);

  target.search = req.nextUrl.search;

  return target;
};

const createRequestInit = async (req: NextRequest) => {
  const headers = filterRequestHeaders(req.headers);
  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.arrayBuffer();

    if (body.byteLength > 0) {
      init.body = body;
    }
  }

  return init;
};

const proxy = async (
  req: NextRequest,
  { params }: { params: { path?: string[] } },
) => {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "API proxy target is not configured" },
      { status: 500 },
    );
  }

  const pathSegments = params.path ?? [];
  const targetUrl = buildTargetUrl(req, pathSegments);

  try {
    const upstreamResponse = await fetch(
      targetUrl,
      await createRequestInit(req),
    );
    const responseHeaders = filterResponseHeaders(upstreamResponse.headers);

    appendSetCookieHeaders(responseHeaders, upstreamResponse);

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Upstream request failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
