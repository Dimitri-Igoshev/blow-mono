import type { MetadataRoute } from "next";
import {
	getPublicProfilesCount,
	profilesShardUrls,
	getStaticRoutes,
	getCities,
	citySearchUrls,
} from "@/lib/sitemap-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Статические страницы
	const staticRoutes: MetadataRoute.Sitemap = getStaticRoutes().map((url) => ({
		url,
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	// Шардированные карты профилей
	const count = await getPublicProfilesCount();
	const shardUrls: MetadataRoute.Sitemap = profilesShardUrls(count).map(
		(url) => ({
			url,
			changeFrequency: "daily",
			priority: 0.6,
		})
	);

	// Динамика: страницы поиска по городам
	const cities = await getCities(1000);
	const cityRoutes: MetadataRoute.Sitemap = citySearchUrls(cities).map(
		(url) => ({
			url,
			changeFrequency: "weekly",
			priority: 0.7,
			// Если на бэке у City появится updatedAt — можно подставить lastModified тут
		})
	);

	// Доп. карта только для статики (как у вас)
	const staticMapUrl: MetadataRoute.Sitemap[number] = {
		url: "https://blow.ru/sitemaps/static.xml",
		changeFrequency: "weekly",
		priority: 0.8,
	};

	return [staticMapUrl, ...staticRoutes, ...shardUrls, ...cityRoutes];
}
