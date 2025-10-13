// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Алиасим, чтобы не конфликтовало с export const config (matcher)
import { config as appConfig } from "@/common/env";

const API = appConfig.SERVER_API_URL;

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/account/search/")) {
    // последний сегмент после /account/search/
    const id = url.pathname.split("/").filter(Boolean).pop()!;

    try {
      const res = await fetch(`${API}/user/slug-by-id/${id}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const { slug, shortId } = await res.json();
        url.pathname = `/u/${slug || shortId || id}`;
        return NextResponse.redirect(url, 301);
      }
    } catch {
      // игнорируем и падаем в фолбэк ниже
    }

    // Фолбэк: редиректим на короткий вид
    url.pathname = `/u/${id}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Это конфиг middleware (Next.js требует именно это имя экспортируемой константы)
export const config = {
  matcher: ["/account/search/:path*"],
};
