// app/u/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { config, resolveMediaUrl } from "@/common/env";
import ProfileClient from "./ProfileClient";
import {
	makeProfileTitle,
	makeProfileDescription,
	shouldIndexProfile,
} from "@/lib/seo-profile";

const API_BASE = config.API_URL;
const MEDIA_BASE = config.MEDIA_URL;
const SITE = "https://blow.ru";

// ---------- helpers ----------
function isObjectId(v: string) {
	return /^[a-f0-9]{24}$/i.test(v);
}

async function safeJson(res: Response) {
	if (!res?.ok) return null;
	const ct = res.headers.get("content-type") || "";
	if (res.status === 204) return null;
	if (!ct.includes("application/json")) {
		await res.text().catch(() => "");
		return null;
	}
	try {
		return await res.json();
	} catch {
		return null;
	}
}

async function getBySlug(slug: string) {
	try {
		const r = await fetch(
			`${API_BASE}/user/by-slug/${encodeURIComponent(slug)}`,
			{
				cache: "no-store",
			}
		);
		return await safeJson(r);
	} catch {
		return null;
	}
}

async function getById(id: string) {
	try {
		const r = await fetch(`${API_BASE}/user/${encodeURIComponent(id)}`, {
			cache: "no-store",
		});
		return await safeJson(r);
	} catch {
		return null;
	}
}

function photoUrl(src?: string) {
        if (!src) return "";
        return resolveMediaUrl(src) ?? src;
}

function cut(s?: string, n = 160) {
	if (!s) return "";
	const t = s.replace(/\s+/g, " ").trim();
	return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

function titleFromProfile(p: any) {
	const name = p?.firstName ?? p?.name ?? "Профиль";
	const age = p?.age ? `, ${p.age}` : "";
	const city = p?.city ? ` — ${p.city}` : "";
	return `${name}${age}${city}`;
}

function descriptionFromProfile(p: any) {
	if (typeof p?.about === "string" && p?.about?.trim()) {
		return cut(p.about.trim(), 180);
	}
	return titleFromProfile(p);
}

// ---------- JSON-LD ----------
function buildPersonJsonLd(profile: any, url: string, imageUrl?: string) {
	const name = profile?.firstName ?? profile?.name ?? "Профиль";
	const gender =
		profile?.sex === "male"
			? "Male"
			: profile?.sex === "female"
				? "Female"
				: undefined;

	const data: Record<string, any> = {
		"@context": "https://schema.org",
		"@type": "Person",
		name,
		url,
	};

	if (gender) data.gender = gender;
	if (profile?.age) data.age = Number(profile.age);
	if (profile?.city) {
		data.homeLocation = {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				addressLocality: profile.city,
				addressCountry: "RU",
			},
		};
	}
	if (imageUrl) data.image = imageUrl;

	const desc = descriptionFromProfile(profile);
	if (desc) data.description = desc;

	return data;
}

function JsonLd({ data }: { data: Record<string, any> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

// ---------- metadata ----------
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug: param } = await params;

	// 1) как slug
	let profile = await getBySlug(param);

	// 2) fallback: ObjectId
	if (!profile && isObjectId(param)) {
		const byId = await getById(param);
		if (byId?.slug) profile = byId;
	}

	if (!profile) {
		return {
			robots: { index: false, follow: false },
			title: "Профиль не найден",
		};
	}

	const slug = profile.slug ?? param;
	const url = `${SITE}/u/${slug}`;
	const title = makeProfileTitle(profile);
	const description = makeProfileDescription(profile);
	const firstPhoto =
		photoUrl(profile?.photos?.[0]?.url ?? profile?.photos?.[0]) ||
		`${SITE}/logo.png`;

	const robots =
		profile?.status === "active" && shouldIndexProfile(profile)
			? { index: true, follow: true }
			: { index: false, follow: false };

	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: "profile",
			url,
			title,
			description,
			images: [{ url: firstPhoto, width: 1200, height: 630 }],
			siteName: "BLOW",
			locale: "ru_RU",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [firstPhoto],
		},
		robots,
		keywords: [
			"знакомства",
			"анкета",
			"содержанки",
			"спонсоры",
			profile?.city || "",
			profile?.firstName || "",
		].filter(Boolean),
	};
}

// ---------- page ----------
export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug: param } = await params;

	// 1) как slug
	let profile = await getBySlug(param);

	// 2) fallback по ObjectId
	if (!profile && isObjectId(param)) {
		const byId = await getById(param);
		if (!byId) notFound();

		if (byId.slug && byId.slug !== param) {
			redirect(`/u/${byId.slug}`);
		}

		profile = byId;
	}

	if (!profile) notFound();

	const slug = profile.slug ?? param;
	const url = `${SITE}/u/${slug}`;
	const firstPhoto =
		photoUrl(profile?.photos?.[0]?.url ?? profile?.photos?.[0]) || undefined;

	const jsonLd = buildPersonJsonLd(profile, url, firstPhoto);

	return (
		<>
			<JsonLd data={jsonLd} />
			<ProfileClient profile={profile} mediaBase={MEDIA_BASE} />
		</>
	);
}
