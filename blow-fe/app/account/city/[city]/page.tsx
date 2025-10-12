// app/account/city/[city]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";
import AccountSearch from "../../search/page";
import { config } from "@/common/env";

const SITE = "https://blow.ru";

// ---- helpers ----
async function getCities() {
  const res = await fetch(`${config.API_URL}/city?limit=1000`, {
    method: "GET",
    // города меняются редко — кэшируем
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error("Не удалось загрузить список городов");
  return res.json();
}

const capitalize = (s: string) =>
  s ? s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase() : s;

type SearchQ = { sex?: "male" | "female"; withPhoto?: string };

function pickFirst(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function cut(s: string, n = 160) {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

// ---- metadata ----
export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ city: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: rawCity } = await params;
  const sp = await searchParams;

  const cityValue = decodeURIComponent(rawCity || "").toLowerCase();
  const sexRaw = pickFirst(sp?.sex);
  const withPhotoRaw = pickFirst(sp?.withPhoto);
  const pageRaw = pickFirst(sp?.page);
  const page = Number(pageRaw || "1");

  // подтягиваем label города (если есть)
  let cityLabel = capitalize(cityValue);
  try {
    const cities = await getCities();
    const found = cities?.find((c: any) => c.value === cityValue);
    if (found?.label) cityLabel = found.label;
  } catch {
    // оставляем capitalized value
  }

  const sexTitle =
    sexRaw === "male"
      ? "Мужчины"
      : sexRaw === "female"
      ? "Содержанки"
      : "Содержанки и спонсоры";

  const baseTitle = `${sexTitle} — ${cityLabel}`;
  const title = page > 1 ? `${baseTitle} · страница ${page}` : baseTitle;

  const baseDesc = `Знакомства (${sexTitle.toLowerCase()}) в городе ${cityLabel}. Найдите пару для приятного вечера и общения${
    withPhotoRaw ? " — только анкеты с фото" : ""
  }.`;
  const description = cut(page > 1 ? `${baseDesc} Страница ${page}.` : baseDesc);

  // абсолютный canonical с фактическими query
  const q = new URLSearchParams();
  if (sexRaw) q.set("sex", sexRaw);
  if (withPhotoRaw) q.set("withPhoto", withPhotoRaw);
  if (page > 1) q.set("page", String(page));

  const canonicalAbs = `${SITE}/account/city/${rawCity}${
    q.toString() ? `?${q.toString()}` : ""
  }`;

  return {
    title,
    description,
    alternates: { canonical: canonicalAbs },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalAbs,
      images: [{ url: `${SITE}/og-default.jpg`, width: 1200, height: 630 }],
      locale: "ru_RU",
      siteName: "BLOW",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og-default.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

// JSON-LD (опционально, но полезно)
function CityJsonLd({
  cityLabel,
  canonicalAbs,
}: {
  cityLabel: string;
  canonicalAbs: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Анкеты — ${cityLabel}`,
    url: canonicalAbs,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: "https://blow.ru/" },
        { "@type": "ListItem", position: 2, name: `Анкеты — ${cityLabel}`, item: canonicalAbs },
      ],
    },
  };
  return (
    <Script
      id="city-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

// ---- page ----
export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { city: rawCity } = await params;
  const sp = await searchParams;

  const sex = pickFirst(sp?.sex) as SearchQ["sex"];
  const withPhoto = pickFirst(sp?.withPhoto);
  const page = pickFirst(sp?.page);

  const cityValue = decodeURIComponent(rawCity || "").toLowerCase();
  let cityLabel = capitalize(cityValue);
  try {
    const cities = await getCities();
    const found = cities?.find((c: any) => c.value === cityValue);
    if (found?.label) cityLabel = found.label;
  } catch {}

  const q = new URLSearchParams();
  if (sex) q.set("sex", sex);
  if (withPhoto) q.set("withPhoto", withPhoto);
  if (page && Number(page) > 1) q.set("page", String(page));
  const canonicalAbs = `${SITE}/account/city/${rawCity}${
    q.toString() ? `?${q.toString()}` : ""
  }`;

  return (
    <>
      <CityJsonLd cityLabel={cityLabel} canonicalAbs={canonicalAbs} />
      <AccountSearch city={rawCity} sex={sex} withPhoto={withPhoto} />
    </>
  );
}
