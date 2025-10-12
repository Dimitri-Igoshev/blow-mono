import NextLink from "next/link";
import { Button, Card, Chip } from "@heroui/react";
import {
	IoAirplaneOutline,
	IoCheckmarkSharp,
	IoHeartOutline,
	IoShieldCheckmarkOutline,
	IoStarOutline,
} from "react-icons/io5";
import { PiGenderIntersex } from "react-icons/pi";
import { ROUTES } from "@/app/routes";

export const PromoNext = ({ sex = "male" }: any) => {
	return (
		<div className="flex flex-col gap-6 w-full px-[34px] mt-9 relative z-10">
			<div className="flex flex-col gap-3">
				<p className="text-3xl font-semibold">Цели знакомств</p>
				<div className="flex flex-wrap gap-6 mt-3">
					<Chip
						size="lg"
						className="bg-transparent border"
						startContent={<IoStarOutline className="mx-1" />}
					>
						Спонсор / содержанка
					</Chip>
					<Chip
						size="lg"
						className="bg-transparent border"
						startContent={
							<IoAirplaneOutline className="mx-1 -rotate-[45deg]" />
						}
					>
						Совместные путешествия
					</Chip>
					<Chip
						size="lg"
						className="bg-transparent border"
						startContent={<PiGenderIntersex className="mx-1 text-[17px]" />}
					>
						Провести вечер
					</Chip>
					<Chip
						size="lg"
						className="bg-transparent border"
						startContent={<IoHeartOutline className="mx-1" />}
					>
						Серьезные отношения
					</Chip>
				</div>
			</div>

			<div className="flex flex-col gap-3 mt-9">
				<p className="text-3xl font-semibold">Истории знакомств</p>

				{sex === "male" ? (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mt-3">
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Познакомились, слетали в Дубай на выходные. Всё прозрачно и
								честно.”
							</p>
							<p className="text-foreground-500 font-semibold">- Игорь, 36</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Договорились о встречах 2 раза в неделю. Комфортно и без
								лишнего внимания.”
							</p>
							<p className="text-foreground-500 font-semibold">- Михаил, 41</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Нашёл спутницу для деловых поездок. Приватность решает.”
							</p>
							<p className="text-foreground-500 font-semibold">- Денис, 33</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Всё чётко по договорённости. Без драмы и недопонимания.”
							</p>
							<p className="text-foreground-500 font-semibold">- Роман, 35</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Нашёл идеальный формат отношений — легко, приятно и без
								давления.”
							</p>
							<p className="text-foreground-500 font-semibold">- Сергей, 42</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Удобно, что можно обсудить всё заранее и без лишних ожиданий.”
							</p>
							<p className="text-foreground-500 font-semibold">- Павел, 40</p>
						</Card>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mt-3">
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Быстро согласовали правила и бюджет подарков. Ноль стресса,
								максимум уважения.”
							</p>
							<p className="text-foreground-500 font-semibold">
								- Маргарита, 30
							</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Путешествуем на уикенды. Он щедрый и тактичный — идеальный
								формат для меня.”
							</p>
							<p className="text-foreground-500 font-semibold">- Диана, 26</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Первая встреча — ресторан и чёткие договорённости. Дальше всё
								легко и приятно.”
							</p>
							<p className="text-foreground-500 font-semibold">- Алёна, 24</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Договорились о гибком графике из-за моей учёбы. Удобно и без
								давления.”
							</p>
							<p className="text-foreground-500 font-semibold">- Лиза, 22</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“Полетели на выходные в Европу. Всё по договорённости, без
								сюрпризов.”
							</p>
							<p className="text-foreground-500 font-semibold">- Ирина, 30</p>
						</Card>
						<Card
							className="p-6 sm:p-9 rounded-3xl flex flex-col gap-6"
							radius="none"
						>
							<div className="flex gap-3 items-center">
								<IoCheckmarkSharp className="text-success" />
								<p className="text-sm">Проверено модерацией</p>
							</div>
							<p className="text-xl">
								“С первого дня — уважение к границам и прозрачность. Чувствую
								себя в безопасности.”
							</p>
							<p className="text-foreground-500 font-semibold">- Полина, 25</p>
						</Card>
					</div>
				)}
			</div>

			<Card
				className="p-6 sm:p-9 px-6 sm:px-12 rounded-3xl flex flex-col sm:flex-row gap-4 mt-3 items-center justify-between"
				radius="none"
			>
				<div className="flex flex-col gap-6">
					<p className="text-3xl font-semibold text-primary">
						Заходи и общайся бесплатно — чтобы выбрать лучших
					</p>
					<p className="text-[20px]">
						Без карты. Приватно. 18+ и строгая модерация.
					</p>
				</div>
				<div>
					<Button
						className="w-full font-semibold"
						color="primary"
						radius="full"
						size="lg"
						onPress={() => (document.location.href = "#register")}
					>
						Присоединиться бесплатно
					</Button>
				</div>
			</Card>

			<div className="flex flex-wrap sm:justify-between sm:items-center py-6 px-1 relative z-10">
				<p>{new Date().getFullYear()} © BLOW.</p>
				<div className="mt-6 sm:mt-0 text-xs flex flex-wrap items-center justify-start sm:justify-end gap-6">
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
		</div>
	);
};
