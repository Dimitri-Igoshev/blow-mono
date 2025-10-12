"use client";

import NextLink from "next/link";
import {
	Button,
	Card,
	Checkbox,
	Chip,
	cn,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
	IoImageOutline,
	IoLockClosedOutline,
	IoShieldCheckmarkOutline,
	IoVolumeMediumOutline,
} from "react-icons/io5";
import { ROUTES } from "@/app/routes";
import { PreviewWidget } from "@/components/preview-widget";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRegisterMutation } from "@/redux/services/authApi";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useGetCitiesQuery } from "@/redux/services/cityApi";
import { profiles as mens } from "../data/mens";
import { profiles as girls } from "../data/girls";
import { WomenIcon, MenIcon } from "@/components/icons"

const randomArray = Array.from({ length: 6 }, () =>
	Math.floor(Math.random() * 100)
);

const headingVariants = {
	hidden: { y: -24, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const chipsContainer = {
	hidden: { opacity: 0, y: -16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { staggerChildren: 0.08, delayChildren: 0.2 },
	},
};

const chipItem = {
	hidden: { opacity: 0, y: -16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

const cardsContainer = {
	hidden: {},
	visible: {
		transition: {
			delay: 0.25, // общая задержка перед началом анимации контейнера (опционально)
			delayChildren: 0.3, // задержка перед ПЕРВЫМ ребёнком
			staggerChildren: 0.08, // интервал между детьми
			// staggerDirection: 1 // 1 — слева направо, -1 — справа налево
		},
	},
};

const cardItem = {
	hidden: { x: -60, opacity: 0 },
	visible: {
		x: 0,
		opacity: 1,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

const registerAppear = {
	hidden: { opacity: 0, scale: 0.85, filter: "blur(8px)" as any },
	visible: {
		opacity: 1,
		scale: 1,
		filter: "blur(0px)" as any,
		transition: { duration: 0.55, ease: "easeOut", delay: 0.2 },
	},
};

type Inputs = {
	email: string;
	firstName: string;
	password: string;
};

export const PromoHero = ({ sex = "male" }: any) => {
	const router = useRouter();

	const profiles = sex === "male" ? mens : girls;

	// const randomProfiles = profiles
	// .map((user: any) => ({ user, sort: Math.random() }))
	// .sort((a: any, b: any) => a.sort - b.sort)
	// .map(({ user }: any) => user)
	// .slice(0, 6);

	const pick6 = (list: any[]) =>
		[...list]
			.map((user) => ({ user, s: Math.random() }))
			.sort((a, b) => a.s - b.s)
			.map(({ user }) => user)
			.slice(0, 6);

	const [fixedProfiles, setFixedProfiles] = useState<any[]>([]);

	useEffect(() => {
		const src = sex === "male" ? girls : mens;
		setFixedProfiles(pick6(src));
	}, [sex]);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<Inputs>();
	const [isLoading, setIsLoading] = useState(false);
	const { data: cities } = useGetCitiesQuery(null);
	const [city, setCity] = useState("");
	const [localSex, setLocalSex] = useState<'female' | 'male'>(sex === 'male' ? 'male' : 'female');

	const [registaration] = useRegisterMutation();

	const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
		setIsLoading(true);

		// data
		const body: any = {
			email: data.email.toLowerCase(),
			password: data.password,
			sex: localSex,
			firstName: data.firstName,
			status: "active",
			city,
			fromLanding: true,
		};

		registaration(body)
			.unwrap()
			.then((res) => {
				localStorage.setItem("access-token", res.accessToken);
				setIsLoading(false);
				router.push(ROUTES.HOME);
			})
			.catch((error: any) => console.log(error))
			.finally(() => {
				setIsLoading(false);
				router.push(ROUTES.HOME);
			});
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="flex flex-col justify-between gap-6 mt-[84px] pb-6 px-3 sm:px-[34px] w-full min-h-[calc(100vh-84px)]">
					{/* ВЕРХ: заголовок + чипсы */}
					<div className="flex flex-col gap-6  ml-[22px] sm:ml-0">
						<motion.h1
							className="mt-6 text-3xl sm:text-5xl font-semibold z-10 relative leading-10 sm:leading-normal"
							initial="hidden"
							animate="visible"
							variants={headingVariants}
							viewport={{ once: true, amount: 0.4 }}
						>
							<span className="text-primary">
								{sex === "male" ? "Красивые девушки. " : "Успешные мужчины. "}
							</span>
							{sex === "male"
								? "Знакомства с продолжением."
								: "Отношения с поддержкой."}
						</motion.h1>

						<motion.div
							className="flex flex-wrap gap-3 sm:gap-6"
							initial="hidden"
							animate="visible"
							variants={chipsContainer}
							viewport={{ once: true, amount: 0.3 }}
						>
							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={<IoShieldCheckmarkOutline className="mx-1" />}
								>
									Реальные анкеты и модерация
								</Chip>
							</motion.div>

							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={<IoImageOutline className="mx-1" />}
								>
									Качественные фото без ботов
								</Chip>
							</motion.div>

							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={
										<IoVolumeMediumOutline className="mx-1 text-[18px]" />
									}
								>
									Голоса девушек
								</Chip>
							</motion.div>

							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={
										<IoLockClosedOutline className="mx-1 text-[14px]" />
									}
								>
									Приватность и защита данных
								</Chip>
							</motion.div>
						</motion.div>
					</div>

					{/* НИЗ: сетка карточек + регистрация */}
					<div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] h-full gap-12">
						{/* 6 карточек слева: каскад слева направо */}
						<motion.div
							className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mt-9 w-full"
							initial="hidden"
							animate="visible"
							variants={cardsContainer}
							viewport={{ once: true, amount: 0.2 }}
						>
							{fixedProfiles.map((item: any, idx: number) => (
								<motion.div key={item._id} variants={cardItem}>
									<PreviewWidget
										className={cn("w-200px sm:w-[250px]")}
										item={item}
									/>
								</motion.div>
							))}
						</motion.div>

						{/* Регистрация: появление из пустоты (scale + fade + blur) */}
						<div
							className="flex flex-col items-center justify-center w-full h-full"
							id="register"
						>
							<motion.div
								className="flex font-semibold text-3xl mb-6 z-10 relative"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
							>
								Регистрация
							</motion.div>

							<motion.div
								initial="hidden"
								animate="visible"
								variants={registerAppear}
								viewport={{ once: true, amount: 0.4 }}
							>
								<Card
									className="w-full sm:w-[400px] p-6 py-9 rounded-3xl bg-foreground-50/50"
									radius="none"
								>
									<form
										onSubmit={handleSubmit(onSubmit)}
										className=" flex flex-col gap-6"
									>
										<p className="pb-2">
											Начните общаться{" "}
											<span className="font-semibold">бесплатно</span>
										</p>

										<div className="flex items-center w-full gap-4">
											<Button
												className={cn(
													"text-xs font-regular bg-transparent w-full",
													{
														" dark:text-white border-primary border-2": localSex === "male",
													}
												)}
												radius="full"
												startContent={<MenIcon className="text-danger" />}
												onPress={() => {
													setLocalSex("male");
												}}
											>
												мужчина
											</Button>
											<Button
												className={cn(
													"text-xs  font-regular bg-transparent w-full",
													{
														"dark:text-white border-primary border-2": localSex === "female",
													}
												)}
												radius="full"
												startContent={<WomenIcon className="text-danger" />}
												onPress={() => {
													setLocalSex("female");
												}}
											>
												девушка
											</Button>
										</div>

										<Select
											className="text-primary"
											classNames={{
												trigger: "bg-white dark:bg-foreground-300",
											}}
											placeholder="Выберите город"
											radius="full"
											selectedKeys={[city]}
											onChange={(el: any) => setCity(el.target.value)}
										>
											{cities
												?.filter((item: any) => item.value)
												.map((city: any) => (
													<SelectItem key={city.value}>{city.label}</SelectItem>
												))}
										</Select>
										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Email"
											radius="full"
											type="email"
											autoCapitalize="none" // <-- Важно для iPhone
											autoCorrect="off" // <-- Чтобы не исправляло автоматически
											{...register("email", {
												required: { value: true, message: "Обязательное поле" },
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Невалидный emaill",
												},
												onChange: (e) => {
													e.target.value =
														e.target.value.charAt(0).toLowerCase() +
														e.target.value.slice(1);
												},
											})}
										/>
										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Ваше имя"
											radius="full"
											type="text"
											{...register("firstName", {
												required: { value: true, message: "Обязательное поле" },
												minLength: { value: 2, message: "Не менее 2 символов" },
											})}
										/>
										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Пароль"
											radius="full"
											type="password"
											{...register("password", {
												required: { value: true, message: "Обязательное поле" },
												minLength: { value: 6, message: "Не менее 6 символов" },
											})}
										/>

										{/* чекбокс можно вернуть позже */}
										<Button
											className="w-full mt-2 font-semibold"
											color="primary"
											// disabled={!accept}
											radius="full"
											size="lg"
											type="submit"
										>
											{sex === "male" ? "Найти содержанку" : "Найти спонсора"}
										</Button>

										<div className="text-center text-foreground-500">
											Без привязки карты. Можно скрыть профиль в любой момент.
										</div>
									</form>
								</Card>
							</motion.div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
