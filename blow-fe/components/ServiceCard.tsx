"use client";

import { Button } from "@heroui/button";
import { cn, Input, Select, SelectItem } from "@heroui/react";
import { useState, type FC } from "react";
import { ru } from "date-fns/locale";
import { format } from "date-fns";
import { FaTelegramPlane } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useGetMeQuery } from "@/redux/services/userApi";

interface ServiceCardProps {
	title: string;
	subtile: string;
	text?: string;
	list?: string[];
	oneTime?: boolean;
	onWithdrawal?: () => void;
	onClick: (value: any) => void;
	buttonText: string;
	defaultVlue?: { price: string; period?: string; quantity?: string };
	transactions?: any[];
	options?: any[];
	type?: string;
}

export const ServiceCard: FC<ServiceCardProps> = ({
	title,
	subtile,
	text = "",
	list = [],
	oneTime = false,
	onWithdrawal,
	onClick,
	buttonText,
	defaultVlue,
	transactions = [],
	options = [],
	type = "",
}) => {
	// const [value, setValue] = useState({
	// 	label: "",
	// 	value: "",
	// 	price: defaultVlue?.price || "",
	// });

	const { data: me } = useGetMeQuery(null);

	const getPeriodLabel = (value: any) => {
		switch (value) {
			case "day":
				return "1 день";
			case "3days":
				return "3 дня";
			case "week":
				return "неделя";
			case "month":
				return "месяц";
			case "quarter":
				return "3 месяца";
			case "year":
				return "год";
			default:
				return "";
		}
	};

	const isQuantity = !options[0]?.period || options[0]?.period === "quantity";
	const selectOptions = isQuantity
		? options.map((i) => ({
				label: i.quantity.toString(),
				value: i.quantity,
				price: i.price,
			}))
		: options.map((i) => ({
				label: getPeriodLabel(i.period.toString()),
				value: i.period,
				price: i.price,
			}));

	const [value, setValue] = useState(
		isQuantity
			? {
					label: options[0]?.quantity?.toString(),
					value: "0",
					price: options[0]?.price,
				}
			: {
					label: getPeriodLabel(options[0]?.period.toString()),
					value: "0",
					price: options[0]?.price,
				}
	);

	const [isHistory, setIsHistory] = useState(false);

	return (
		<div className="bg-white dark:bg-foreground-100 rounded-[36px] p-[20px] sm:p-[30px] flex flex-col gap-6">
			<div className="flex flex-wrap justify-between items-center text-[24px] font-semibold">
				<p>{title}</p>
				<p
					className={cn("font-medium sm:font-semibold", {
						["text-[20px] sm:text-[24px] "]: oneTime,
						["text-[16px] sm:text-[20px] "]: !oneTime,
					})}
				>
					{subtile}
				</p>
			</div>

			{text ? <p>{text}</p> : null}

			{type === "mailing" ? (
				<p>Ваша рассылка будет доступна для всех в течении 24 часов.</p>
			) : null}

			{type === "premium" ? (
				<>
					<p>При покупке премиума на неделю, поднятие в топ на 24 часа</p>
					<p className="-mt-6">
						При покупке премиума на месяц, поднятие в топ на 3 дня
					</p>
					<p className="-mt-6">
						При покупке премиума на 3 месяца, поднятие в топ на 7 дней
					</p>
				</>
			) : null}

			{list.length ? (
				<>
					<ul className="ml-6 flex flex-col gap-2 list-disc">
						{list.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>

					<div className="flex flex-col gap-1">
						<p className="flex items-center flex-wrap gap-3">
							По вопросам оплаты обращаться в Telegram
							<a
								href="https://t.me/blowadmin"
								className="flex items-center gap-1.5 bg-foreground-100 p-2.5 rounded-full hover:bg-primary hover:text-white"
							>
								<FaTelegramPlane />
							</a>
							<a href="https://t.me/blowadmin" className="hover:text-primary">
								@blowadmin
							</a>
						</p>

						<p className="flex items-center gap-2">
							Почта
							<a
								href="mailto:admin@kutumba.ru"
								className="flex items-center gap-1.5 bg-foreground-100 p-2.5 rounded-full hover:bg-primary hover:text-white"
							>
								<MdEmail />
							</a>
							<a href="mailto:admin@kutumba.ru" className="hover:text-primary">
								admin@kutumba.ru
							</a>
						</p>
					</div>
				</>
			) : null}

			{isHistory ? (
				<div className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-4 rounded-[24px] bg-foreground-100">
					{transactions.map((item: any) => (
						<div
							key={item._id}
							className="bg-white dark:bg-black p-3 items-center px-4 rounded-[16px] grid gap-3 grid-cols-2 sm:grid-cols-5"
						>
							<div className="font-medium items-center">
								{item?.type === "credit" ? "Пополнение" : "Списание"}
							</div>
							<div className="flex justify-end sm:justify-center text-xs items-center">
								{format(new Date(item.updatedAt), "dd.MM.yyyy", {
									locale: ru,
								})}
							</div>
							<div className="felx text-xs items-center">
								{item?.description || "Без описания"}
							</div>
							<div className="flex sm:justify-end text-xs items-center">
								{item?.type === "debit"
									? item.status === "pending"
										? "Обрабатывается..."
										: item.status === "completed"
											? "Завершено"
											: "Списано со счета"
									: item.status === "failed"
										? "Ошибка оплаты"
										: item.status === "new"
											? "Ожидает оплаты"
											: "Оплачено"}
							</div>
							<div
								className={cn("flex justify-end", {
									["text-red-500"]: item?.type === "debit",
									["text-green-500"]:
										item?.type === "credit" && item.status === "paid",
								})}
							>
								{item.sum} ₽
							</div>
						</div>
					))}
				</div>
			) : null}

			<div
				className={cn("flex flex-wrap items-center gap-3", {
					["justify-between"]: transactions?.length,
					["justify-end"]: !transactions?.length,
				})}
			>
				{transactions?.length ? (
					<Button
						className="z-0 relative w-full sm:w-auto"
						radius="full"
						variant="solid"
						onPress={() => setIsHistory(!isHistory)}
					>
						{isHistory ? "Cкрыть историю" : "История операций"}
					</Button>
				) : null}

				<div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
					{!oneTime ? (
						<Select
							className="text-primary z-0 relative rounded-full w-full sm:w-[150px]"
							classNames={{ value: "font-semibold" }}
							placeholder="Выберите"
							radius="full"
							selectedKeys={[value.value]}
							onChange={(el) =>
								setValue({
									...value,
									value: el.target.value,
									price: options[+el.target.value || 0]?.price,
								})
							}
						>
							{selectOptions.map((i: any, idx: number) => (
								<SelectItem key={idx}>{i.label}</SelectItem>
							))}
						</Select>
					) : null}

					{!oneTime ? (
						<Input
							className="z-0 relative w-full sm:w-[150px]"
							classNames={{ input: "font-semibold" }}
							disabled={!oneTime}
							endContent={<span className="text-primary">₽</span>}
							placeholder=""
							radius="full"
							value={value.value || oneTime ? value.price : ""}
							onChange={(e) => setValue({ ...value, price: e.target.value })}
						/>
					) : null}

					{oneTime && me?.sex === "female" ? (
						<Button
							className="z-0 relative w-full sm:w-auto"
							color={
								value.price && (value.value || oneTime) ? "primary" : "default"
							}
							disabled={!value.price && !value.value}
							radius="full"
							variant="solid"
							onPress={onWithdrawal}
						>
							Вывод средств
						</Button>
					) : null}

					<Button
						className="z-0 relative w-full sm:w-auto"
						// color={
						// 	value.price && (value.value || oneTime) ? "primary" : "default"
						// }
						color="primary"
						size={buttonText === "Пополнить" ? "lg" : "md"}
						disabled={!value.price && !value.value}
						radius="full"
						variant="solid"
						onPress={() => {
							if (value.price || value.value) {
								onClick({
									period: isQuantity ? "" : options[+value?.value]?.period,
									price: value.price,
									quantity: isQuantity ? options[+value?.value]?.quantity : "",
								});
							}
						}}
					>
						{buttonText}
					</Button>
				</div>
			</div>
		</div>
	);
};
