import { config } from "@/common/env";

const BASE = config.API_URL;               // API base
const SITE = "https://blow.ru";            // домен сайта для абсолютных URL
const PER_FILE = 45000;                    // запас < 50k на файл

export type PublicProfile = {
  slug?: string;
  shortId?: string;
  updatedAt?: string;
};

/** ---------------- Профили (как было) ---------------- **/

export async function getPublicProfilesCount(): Promise<number> {
  try {
    const res = await fetch(`${BASE}/user/public/count`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("count not ok");
    const data = await res.json();
    return Number(data?.count || 0);
  } catch {
    const list = await getPublicProfilesBatch(0, 1000);
    return list.length;
  }
}

export async function getPublicProfilesBatch(
  skip: number,
  limit: number
): Promise<PublicProfile[]> {
  try {
    const res = await fetch(
      `${BASE}/user/public?sitemap=1&skip=${skip}&limit=${limit}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("list not ok");
    const arr = await res.json();
    return Array.isArray(arr) ? arr : [];
  } catch {
    const res = await fetch(`${BASE}/user?limit=${limit}&withPhoto=1`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
      ? data
      : data?.data || [];
    return items.map((u: any) => ({
      slug: u.slug,
      shortId: u.shortId ?? u._id ?? u.id,
      updatedAt: u.updatedAt,
    }));
  }
}

export function profilesShardUrls(count: number): string[] {
  const files = Math.ceil(count / PER_FILE);
  return Array.from(
    { length: files || 1 },
    (_, i) => `${SITE}/sitemaps/profiles-${String(i + 1).padStart(4, "0")}.xml`
  );
}

export async function getProfilesForShard(name: string) {
  const m = name.match(/^profiles-(\d+)\.xml$/);
  if (!m) return [];
  const index = Number(m[1]) - 1;
  const skip = index * PER_FILE;
  const list = await getPublicProfilesBatch(skip, PER_FILE);
  return list.map((p) => ({
    loc: `${SITE}/u/${p.slug || p.shortId}`,
    lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
  }));
}

export function getStaticRoutes() {
  return [
    `${SITE}/`,
    `${SITE}/rules`,
    `${SITE}/privacy`,
    `${SITE}/contacts`,
    `${SITE}/offer`,
    `${SITE}/flyer`,
  ];
}

/** ---------------- Города (добавлено) ---------------- **/

export type CityPublic = {
  label: string;
  value: string;
  order?: number;
  updatedAt?: string; // если появится на бэке — подставим в lastModified
};

// Получаем все города. Если данных очень много, при необходимости разбейте на страницы.
export async function getCities(limit = 1000): Promise<CityPublic[]> {
  try {
    const res = await fetch(`${BASE}/city?limit=${limit}`, {
      // города меняются редко — кэшируем сутки
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as CityPublic[]) : [];
  } catch {
    return [];
  }
}

// Абсолютные URL страницы поиска по городу
export function citySearchUrls(cities: CityPublic[]): string[] {
  return cities
    .filter((c) => !!c?.value)
    .map((c) => `${SITE}/account/city/${encodeURIComponent(c.value)}`);
}
