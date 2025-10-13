import { config, resolveMediaUrl } from "@/common/env";
import type { Metadata, ResolvingMetadata } from "next";
import ProfileClient from "./ProfileClient";

type Profile = {
	_id: string;
	firstName: string;
	age?: number;
	city?: string;
	height?: number;
	weight?: number;
	about?: string;
	photos?: any[]; // абсолютный или относительный урл
	status?: string;
};

async function getProfile(id: string): Promise<Profile | null> {
	const res = await fetch(`${config.API_URL}/user/${id}`, {
		cache: "no-store", // или next: { revalidate: 60 } для ISR
	});
	if (!res.ok) return null;
	return res.json();
}

async function getCities(): Promise<any[] | null> {
	const res = await fetch(`${config.API_URL}/city?limit=1000`, {
		cache: "no-store", // или next: { revalidate: 60 } для ISR
	});
	if (!res.ok) return null;
	return res.json();
}

const getCityLabel = (
	cityValue: string | null | undefined,
	cities: any[]
): string => {
	if (!cityValue) return "не указан";
	return cities?.find((c: any) => c.value === cityValue)?.label || "не указан";
};

export async function generateMetadata(
	props: any,
	_parent: ResolvingMetadata
): Promise<Metadata> {
	// @ts-nocheck
	const { id } = (props.params as { id: string });

	const profile = await getProfile(id);
	const cities = await getCities();

	if (!profile) {
		return {
			title: "Анкета не найдена",
			robots: { index: false, follow: false },
		};
	}

	if (cities) profile.city = getCityLabel(profile.city, cities);

	const titleParts = [
		profile.firstName,
		profile.age ? `${profile.age}` : undefined,
		profile.city ? `— ${profile.city}` : undefined,
	].filter(Boolean);

        const title = `${titleParts.join(", ")} | Анкета`;
        const description =
                profile.about ??
                `Профиль ${profile.firstName}${
                        profile.city ? `, ${profile.city}` : ""
                } — знакомства для содержанок и спонсоров.`;

        const canonical = `/search/${profile._id}`;
        const firstPhotoRaw = profile?.photos?.[0];
        const firstPhotoPath =
                typeof firstPhotoRaw === "string" ? firstPhotoRaw : firstPhotoRaw?.url;
        const firstPhotoUrl = resolveMediaUrl(firstPhotoPath);

        return {
                title,
                description,
                alternates: { canonical },
                openGraph: {
                        type: "profile",
                        title,
                        description,
                        url: canonical,
                        images: firstPhotoUrl
                                ? [
                                                {
                                                        url: firstPhotoUrl,
                                                        width: 1200,
                                                        height: 630,
                                                },
                                        ]
                                : undefined,
                },
                twitter: {
                        card: "summary_large_image",
                        title,
                        description,
                        images: firstPhotoUrl ? [firstPhotoUrl] : undefined,
                },
		robots: { index: true, follow: true },
	};
}

async function ProfilePage({ params }: { params: { id: string } }) {
	const profile = await getProfile(params.id);
	if (!profile)
		return (
			<div className="flex w-full items-center justify-between">
				<h1 className="mt-20">Анкета не найдена</h1>
			</div>
		);

	return (
		<div className="flex w-full items-center justify-between">
			{!profile || profile?.status !== "active" ? (
				<div className="w-full h-full mt-20 flex justify-center px-6 sm:px-20">
					<p className="sm:text-[20px] text-center">
						Анкета была удалена пользователем или администрацией за нарушение
						правил платформы.
					</p>
				</div>
			) : (
				<ProfileClient user={profile} />
			)}
		</div>
	);
}

export default ProfilePage as any;
