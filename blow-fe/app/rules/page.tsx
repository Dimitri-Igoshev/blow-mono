"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../routes";

const rulesText = `
KUTUMBA.RU — сайт для изысканных знакомств.

Важные принципы
- Честность и подлинность — основа нашего сообщества. Ваша фотография должна быть настоящей и отражать вашу индивидуальность.
- Возрастное ограничение — доступ только для совершеннолетних пользователей (от 18 лет).
- Открытость — делитесь своими желаниями и ожиданиями искренне, чтобы каждое знакомство было основано на доверии.

Правила сайта

Общие положения:
- Пользователи могут подавать жалобы на нарушителей.
- Администрация вправе удалять сообщения и блокировать аккаунты без предупреждения.
- При блокировке создание новых аккаунтов запрещено.
- Правила и тарифы могут быть изменены.
- Администрация сайта имеет право ограничивать передачу персональных данных пользователей. Доступ к расширенным функциям, включая передачу данных, предоставляется только пользователям с премиум-аккаунтом.

Запрещённые действия:
- Профессиональные услуги и поиск клиентов.
- Неуважительное общение (мат, угрозы, агрессия).
- Предложения работы в Skype, за рубежом, эскорт-услуги.
- Попрошайничество и сбор денег.
- Использование чужих фотографий.
- Некорректное поведение при встречах.
- Предложения массажа и других услуг.
- Мошенничество и обман.
- Спам и навязчивое поведение.
- Порнографический контент.
- Политические споры и провокации.
- Продажа фотографий и видеоматериалов.
- Использование VPN и анонимайзеров.
- Особые замечания:
- Типажные фотографии допустимы, если они похожи на оригинал.
- При нарушении правил применяются следующие санкции:
- Первое нарушение — предупреждение или временная блокировка.
- Повторное нарушение — удаление аккаунта.
- Грубые нарушения — пожизненная блокировка.

Начиная общение на сайте, вы автоматически соглашаетесь с данными правилами.
`;

export default function RulesPage() {
	return (
		<div className="min-h-screen flex flex-col justify-between">
			<div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
				<h1 className="text-[36px] font-semibold mt-3 sm:mt-9">
					Правила сайта
				</h1>
				<div className="whitespace-pre-wrap text-sm sm:text-base space-y-4">
					{rulesText}
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
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Правила
						</NextLink>
					</div>
				</div>
			</footer>
		</div>
	);
}
