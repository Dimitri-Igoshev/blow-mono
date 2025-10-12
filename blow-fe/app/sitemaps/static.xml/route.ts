import { NextResponse } from "next/server";
import { getStaticRoutes } from "@/lib/sitemap-api";

export const dynamic = "force-static";

export async function GET() {
  const urls = Array.from(new Set(
    getStaticRoutes()
      .filter(Boolean)
      .map(u => u.replace(/\/+$/, "")) // без завершающего слэша
  ));
  const now = new Date().toISOString();

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls.map(loc => `<url><loc>${loc}</loc><lastmod>${now}</lastmod></url>`),
    `</urlset>`,
  ].join("");

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
