"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { FaPhoneAlt, FaTelegramPlane } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { ROUTES } from "../routes";

export default function ContactsPage() {
	return (
		<div className="min-h-screen flex flex-col justify-between">
			<div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
				<h1 className="text-[36px] font-semibold mt-3 sm:mt-9">Контакты</h1>
				<div className="text-sm sm:text-base space-y-4">
					<p>
						Наименование организации:{" "}
						<span className="font-semibold">
							Freaks 4U Gaming GmbH
						</span>
					</p>
					<p>
						Юридический адрес: <span className="font-semibold">An der Spreeschanze 10 , 13599 , Berlin , Germany</span>
					</p>
					{/* <p>
						ИНН: <span className="font-semibold">290136806418</span>
					</p>
					<p>
						ОГРНИП: <span className="font-semibold">324508100613082</span>
					</p> */}
					{/* <p className="flex items-center gap-2">
						<a
							href="tel:+79031016945"
							className="flex items-center gap-1.5 bg-foreground-100 p-2.5 rounded-full hover:bg-primary hover:text-white"
						>
							<FaPhoneAlt />
						</a>
						Номер телефона:{" "}
						<a href="tel:+79031016945" className="hover:text-primary">
							+7 (903) 101-69-45
						</a>
					</p> */}
					<p className="flex items-center gap-2">
						<a
							href="mailto:admin@kutumba.ru"
							className="flex items-center gap-1.5 bg-foreground-100 p-2.5 rounded-full hover:bg-primary hover:text-white"
						>
							<MdEmail />
						</a>
						Почта:{" "}
						<a href="mailto:admin@kutumba.ru" className="hover:text-primary">
							admin@kutumba.ru
						</a>
					</p>

					<p className="flex items-center gap-2">
						<a
							href="https://t.me/blowadmin"
							className="flex items-center gap-1.5 bg-foreground-100 p-2.5 rounded-full hover:bg-primary hover:text-white"
						>
							<FaTelegramPlane />
						</a>
						Telegram:{" "}
						<a href="https://t.me/blowadmin" className="hover:text-primary">
							@blowadmin
						</a>
					</p>
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
					<p className="text-center sm:twxt-left mt-5 sm:mt-0">
						{new Date().getFullYear()} © BLOW
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
					<div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-6">
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
