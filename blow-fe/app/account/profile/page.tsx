"use client";

import { Image } from "@heroui/image";
import { MdOutlineHeight, MdOutlineLogout } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { PiWaveform } from "react-icons/pi";
import dynamic from "next/dynamic";
import { FiEdit } from "react-icons/fi";
import { LuCrown, LuWallet } from "react-icons/lu";
import { IoArrowUp } from "react-icons/io5";
import { LuTrash } from "react-icons/lu";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/app/routes";
import { useCityLabel } from "@/helper/getCityString";
import {
	useGetMeQuery,
	useReiseProfileMutation,
	useUpdateUserMutation,
} from "@/redux/services/userApi";
import { resolveMediaUrl } from "@/common/env";
import { RAISE_ID } from "@/helper/checkIsActive";
import { InfoModal } from "@/components/InfoModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { BlowLoader } from "@/components/BlowLoader";
import TelegramLoginButton from "@/components/TelegramLoginButton";

const VoiceRecorder = dynamic(() => import("@/components/VoiceRecoder"), {
	ssr: false,
});

const AccountProfilePage = () => {
	const router = useRouter();

	const { data: me } = useGetMeQuery(null);

	const logout = () => {
		localStorage.setItem("access-token", "");
		window.open("/", "_self");
	};

	const [width, setWidth] = useState();
	const ref = useRef<any>(null);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new ResizeObserver(() => {
			if (ref.current) {
				setWidth(ref.current.offsetWidth);
			}
		});

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isOpenRemove,
		onOpen: onOpenRemove,
		onOpenChange: onOpenChangeRemove,
	} = useDisclosure();

	const [raise] = useReiseProfileMutation();

	const [info, setInfo] = useState({
		title: "",
		text: "",
		btn: "",
	});

	const raiseProfile = () => {
		if (!me) return;

		const can =
			me?.services?.find((s: any) => s._id === RAISE_ID)?.quantity > 0;

		if (!can) {
			setInfo({
				title: "Не доступно",
				text: "Вам необходмо приобрести услугу поднятия анкеты",
				btn: "Купить",
			});

			onOpen();

			return;
		}

		raise(me?._id)
			.unwrap()
			.then(() => {
				setInfo({
					title: "Успешно",
					text: "Мы подняли вашу анкету, теперь вы стали еще заметнее!",
					btn: "",
				});

				onOpen();
			})
			.catch((err) => console.log(err));
	};

	// const [removeProfile] = useRemoveUserMutation();
	const [updateProfile] = useUpdateUserMutation();

	const remove = () => {
		if (!me) return;

		updateProfile({ id: me?._id, body: { status: "archive" } })
			.unwrap()
			.then(() => {
				localStorage.setItem("access-token", "");
				window.open("/", "_self");
			})
			.catch((err) => console.log(err));
	};

	const handlePlay = () => {
		const audioUrl = resolveMediaUrl(me?.voice);

		if (!audioUrl) return;

		const audio = new Audio(audioUrl);
		audio.play().catch((err) => {
			console.error("Ошибка воспроизведения:", err);
		});
	};

	const { getCityLabel } = useCityLabel();

	return (
		<div className="min-h-screen">
			{me ? (
				<div className="grid grid-cols-1 sm:grid-cols-4 px-3 sm:px-9 pt-[94px] sm:gap-[50px]">
					<div className="sm:col-span-1 flex flex-col gap-[50px] w-full">
						<div ref={ref} className="relative">
							<Image
								alt=""
								className="aspect-[1/1] relative border-[7px] border-white dark:border-foreground-100 z-0"
								width={"100%"}
								height={width ? width : "100%"}
								radius="full"
								src={
									me?.photos[0]?.url
										? (resolveMediaUrl(me?.photos[0]?.url) ?? "")
										: me?.sex === "male"
											? "/men.jpg"
											: "/woman.jpg"
								}
								style={{ objectFit: "cover" }}
							/>
							{/* <div className="absolute rounded-full w-10 h-10 bg-primary cursor-pointer flex justify-center items-center right-[40px] bottom-[40px] border-[2px] border-white z-20">
					<IoCameraOutline className="text-white mb-px" />
					</div> */}
						</div>

						<div className="bg-white dark:bg-foreground-100 p-[30px] rounded-[32px] flex flex-col gap-5">
							{!me?.telegramId ? <TelegramLoginButton add newUser={me}/> : null}

							<Link href={ROUTES.ACCOUNT.PROFILE_EDIT}>
								<div className="flex gap-2.5 cursor-pointer group transition-all">
									<FiEdit className="text-primary min-w-4" size={16} />
									<p className="-mt-[3px] group-hover:text-primary">
										Редактировать профиль
									</p>
								</div>
							</Link>

							{me?.sex === "male" ? (
								<button
									className="flex gap-2.5 cursor-pointer group transition-all flex-star"
									onClick={() => router.push(ROUTES.ACCOUNT.SERVICES)}
								>
									<LuCrown className="text-primary min-w-4" size={16} />
									<p className="-mt-[3px] group-hover:text-primary">
										{me?.premium
											? "Продлить премиум"
											: "Купить/продлить премиум"}
									</p>
								</button>
							) : null}

							<button
								className="flex gap-2.5 cursor-pointer group transition-all"
								onClick={raiseProfile}
							>
								<IoArrowUp className="text-primary min-w-4" size={16} />
								<p className="-mt-[3px] group-hover:text-primary">
									Поднять анкету
								</p>
							</button>

							<button
								className="flex gap-2.5 cursor-pointer group transition-all"
								onClick={() => router.push(ROUTES.ACCOUNT.SERVICES)}
							>
								<LuWallet className="text-primary min-w-4" size={16} />
								<p className="-mt-[3px] group-hover:text-primary">
									Пополнить кошелек
								</p>
							</button>

							<button
								className="flex gap-2.5 cursor-pointer group transition-all"
								onClick={onOpenRemove}
							>
								<LuTrash className="text-primary min-w-4" size={16} />
								<p className="-mt-[3px] group-hover:text-primary">
									Удалить анкету
								</p>
							</button>

							<button
								className="flex gap-2.5 cursor-pointer group transition-all"
								onClick={logout}
							>
								<MdOutlineLogout className="text-primary" size={16} />
								<p className="-mt-[3px] group-hover:text-primary">Выйти</p>
							</button>
						</div>
					</div>

					<div className="mt-9 sm:mt-0 sm:col-span-3 flex flex-col">
						<div className="bg-white dark:bg-foreground-100 p-9 rounded-[32px] flex flex-col gap-5 h-full">
							<div className="flex flex-wrap items-center justify-between w-full">
								<div className="flex sm:hidden  items-center gap-2 w-full sm:w-auto">
									<div className="w-2.5 h-2.5 rounded-full bg-green-400" />
									<p>сейчас онлайн</p>
								</div>
								<div className="flex items-center gap-5">
									<p className="text-[24px] sm:text-[36px] line-clamp-1 font-semibold mt-3 sm:-mt-1.5 mr-3 sm:mr-0">
										{me?.firstName
											? me.firstName
											: me?.sex == "male"
												? "Мужчина"
												: "Девушка"}
									</p>
									<div className="hidden sm:flex items-center gap-2">
										<div className="w-2.5 h-2.5 rounded-full bg-green-400" />
										<p>сейчас онлайн</p>
									</div>
								</div>

								<p className="text-[18px] sm:text-[24px]">
									{me?.age ? me.age + ", " : ""}
									{getCityLabel(me?.city)}
								</p>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="flex items-center gap-10 -ml-2">
									<div className="flex items-center gap-1">
										<MdOutlineHeight
											className="w-[22px] text-primary"
											size={22}
										/>
										<p>рост - {me?.height ? me.height + " см" : ""}</p>
									</div>
									<div className="flex items-center gap-1">
										<GiWeight
											className="w-[22px] text-primary mr-1"
											size={18}
										/>
										<p>вес - {me?.weight ? me.weight + " кг" : ""}</p>
									</div>
								</div>

								{/* <div>
									{me?.voice ? (
										<button
											onClick={handlePlay}
											className="bg-primary text-white rounded-full h-[38px] mt-6 sm:mt-0 px-3.5 flex gap-1 items-center"
										>
											<PiWaveform className="w-5 h-5" />
											<p>Прослушать</p>
										</button>
									) : null}
								</div> */}
								<VoiceRecorder className="mt-3 sm:mt-0" />
							</div>

							<div className="text-[20px] font-semibold mt-3">
								Цели знакомства
							</div>

							<ul className="flex flex-wrap w-full gap-6 pl-4">
								{!me?.sponsor ? null : (
									<li className="list-disc mr-8">
										{me?.sex === "male" ? "Стану спонсором" : "Ищу спонсора"}
									</li>
								)}
								{!me?.relationships ? null : (
									<li className="list-disc mr-8">Серьезные отношения</li>
								)}
								{!me?.evening ? null : (
									<li className="list-disc mr-8">Провести вечер</li>
								)}
								{!me?.traveling ? null : (
									<li className="list-disc mr-8">Совместные путешествия</li>
								)}
								{/* {!me?.traveling ? null : (
									<li className="list-disc mr-8">Совместные путешествия</li>
								)}
								{!me?.relationships ? null : (
									<li className="list-disc mr-8">Постоянные отношения</li>
								)}
								{!me?.evening ? null : (
									<li className="list-disc mr-8">Провести вечер</li>
								)} */}
							</ul>

							<div className="text-[20px] font-semibold mt-6">О себе</div>

							<Textarea
								className="w-full sm:min-h-full"
								classNames={{ input: "p-3 min-h-full resize-none" }}
								placeholder="Пользователь предпочёл не указывать информацию о себе"
								radius="lg"
								isReadOnly
								maxRows={20}
								value={
									me?.about ||
									"Пользователь предпочёл не указывать информацию о себе"
								}
							/>
						</div>
					</div>

					<InfoModal
						actionBtn={info.btn ? info.btn : ""}
						isOpen={isOpen}
						text={info.text}
						title={info.title}
						onAction={() =>
							info.btn ? router.push(ROUTES.ACCOUNT.SERVICES) : null
						}
						onOpenChange={onOpenChange}
					/>

					<ConfirmModal
						actionBtn="Удалить"
						isOpen={isOpenRemove}
						text="Вы уверены что хотите удалить свою анкету?"
						title="Удаление анкеты"
						onAction={remove}
						onOpenChange={onOpenChangeRemove}
					/>
				</div>
			) : (
				<BlowLoader />
			)}
		</div>
	);
};

export default AccountProfilePage;
