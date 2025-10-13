import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { config } from "@/common/env";

const API = config.SERVER_API_URL;

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/account/search/")) {
    const id = url.pathname.split("/").pop()!;

    try {
      const res = await fetch(`${API}/user/slug-by-id/${id}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const { slug, shortId } = await res.json();

        url.pathname = `/u/${slug || shortId || id}`;

        return NextResponse.redirect(url, 301);
      }
    } catch {}
    // Фолбэк: хотя бы редирект на короткий вид
    url.pathname = `/u/${id}`;

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/search/:path*"],
};
