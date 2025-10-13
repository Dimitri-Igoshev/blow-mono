// app/sitemaps/route.ts
import { NextResponse } from "next/server";
import { profilesShardUrls, getPublicProfilesCount } from "@/lib/sitemap-api";

const SITE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kutumba.ru";

export const dynamic = "force-dynamic";     // <— ключ: НЕ пререндерим на билде
export const revalidate = 3600;             // кэш на уровне Next (опционально)

export async function GET() {
  try {
    // страхуемся от зависаний
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);

    // если внутри getPublicProfilesCount есть fetch — передай туда { cache: 'no-store', signal: ctrl.signal }
    const count = await getPublicProfilesCount();

    clearTimeout(t);

    const shards = profilesShardUrls(count); // https://kutumba.ru/sitemaps/profiles-0001.xml …
    const items = [
      `${SITE}/sitemaps/static.xml`,
      `${SITE}/sitemaps/cities.xml`,
      ...shards,
    ];

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...items.map((loc) => `<sitemap><loc>${loc}</loc></sitemap>`),
      `</sitemapindex>`,
    ].join("");

    return new NextResponse(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        // кэш CDN/Edge — сутки
        "cache-control": "s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch {
    // Никогда не валим билд/запрос: отдаём минимально валидный индекс
    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      `<sitemap><loc>${SITE}/sitemaps/static.xml</loc></sitemap>`,
      `<sitemap><loc>${SITE}/sitemaps/cities.xml</loc></sitemap>`,
      `</sitemapindex>`,
    ].join("");

    return new NextResponse(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "no-store",
      },
      status: 200,
    });
  }
}
