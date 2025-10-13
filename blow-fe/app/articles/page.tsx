"use client";

import Head from "next/head";
import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "@/app/routes";
import { TiInfoLarge } from "react-icons/ti";

export default function ArticlesPage() {
	const year = new Date().getFullYear();

	return (
		<div className="min-h-screen flex flex-col justify-between">
			<Head>
				<title>Статьи</title>
				<meta
					name="description"
					content="Полезные статьи для пользователей BLOW"
				/>
				<link rel="canonical" href="https://kutumba.ru/articles" />
				<meta property="og:type" content="article" />
				<meta property="og:title" content="Статьи" />
				<meta
					property="og:description"
					content="Полезные статьи для пользователей BLOW"
				/>
			</Head>

			<div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
				<div className="w-full">
					<h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
						Статьи
					</h1>

					<p className="text-sm sm:text-base mt-4">
						<strong>18+</strong> Полезные статьи для пользователей нашей
						платформы.
					</p>

					<section className="mt-9 flex flex-wrap gap-9">
						<NextLink href={"/articles/soderzhanki-dlya-muzhchin"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> В чём выгода для мужчин
							</h2>
						</NextLink>
						<NextLink href={"/articles/devushki-v-sugar-dating-vygody"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Девушки и
								формат-содержанки
							</h2>
						</NextLink>
						<NextLink
							href={"/articles/etiket-i-dolgosrochnye-otnosheniya-win-win"}
						>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Этикет долгосрочных
								отношений
							</h2>
						</NextLink>
						<NextLink
							href={"/articles/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya"}
						>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Как обсуждать поддержку
							</h2>
						</NextLink>
						<NextLink
							href={"/articles/krasnye-flagi-i-moshenniki-v-sugar-dating"}
						>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Красные флаги и
								мошенники
							</h2>
						</NextLink>

						<NextLink href={"/articles/pervaya-vstrecha-sponsor-soderzhanka"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Первая встреча
							</h2>
						</NextLink>

            

            <NextLink href={"/articles/silnaya-anketa-soderzhanki"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Сильная анкета содержанки
							</h2>
						</NextLink>

            <NextLink href={"/articles/profil-sponsora"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Профиль спонсора
							</h2>
						</NextLink>

            <NextLink href={"/articles/profil-sponsora"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Переписка
							</h2>
						</NextLink>

            <NextLink href={"/articles/pravila-bezopasnost-moskva-rf"}>
							<h2 className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-primary flex items-center">
								<TiInfoLarge className="text-primary" /> Москва и РФ: правила, безопасность и различия формата
							</h2>
						</NextLink>
					</section>
				</div>
			</div>

			<footer className="bg-gray dark:bg-black w-full">
				<div className="bg-dark rounded-t-[50px] px-3 sm:px-12 py-[28px] grid grid-cols-1 sm:grid-cols-3 text-white items-center text-xs sm:text-base">
					<div className="sm:hidden flex justify-center">
						<Image
							alt="BLOW"
							height={40}
							radius="none"
							src="/logo.png"
							width={101}
						/>
					</div>
					<p className="text-center sm:text-left mt-5 sm:mt-0 text-xs">
						{year} © BLOW
					</p>
					<div className="hidden sm:flex justify-center">
						<Image
							alt="BLOW"
							height={40}
							radius="none"
							src="/logo.png"
							width={101}
						/>
					</div>
					<div className="text-xs mt-7 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-6">
						<NextLink
							className="underline cursor-pointer hover:text-primary text-nowrap"
							href={ROUTES.ARTICLES}
						>
							Статьи
						</NextLink>
						<NextLink
							href={ROUTES.CONTACTS}
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Свяжись с нами
						</NextLink>
						<NextLink
							href={ROUTES.POLICY}
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Политики
						</NextLink>
						<NextLink
							href={ROUTES.OFFER}
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Договор оферта
						</NextLink>
						<NextLink
							href={ROUTES.RULES}
							className="underline cursor-pointer hover:text-primary text-nowrap -mt-2 sm:mt-0"
						>
							Правила
						</NextLink>
					</div>
				</div>
			</footer>
		</div>
	);
}
