// app/sitemaps/[shard]/route.ts
import { NextResponse } from "next/server";
import { getProfilesForShard } from "@/lib/sitemap-api";

export const dynamic = "force-static";

export async function GET(
  _req: Request,
  { params }: { params: any } // <-- валидная сигнатура
) {
  const shard = params.shard; // ожидаем вида "profiles-0001.xml"
  const items = await getProfilesForShard(shard);

  if (!items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...items.map(({ loc, lastmod }) =>
      `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`
    ),
    `</urlset>`,
  ].join("");

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}

