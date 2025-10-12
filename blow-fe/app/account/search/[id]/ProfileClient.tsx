"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { Image } from "@heroui/image";
import { MdOutlineHeight } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { Button } from "@heroui/button";
import { PiWaveform } from "react-icons/pi";
import { cn, useDisclosure } from "@heroui/react";

import { Note } from "./Note";

// import { getCityString } from "@/helper/getCityString";
import { config } from "@/common/env";
import {
	useCreateNoteMutation,
	useDeleteNoteMutation,
	useGetMeQuery,
	useNewVisitMutation,
	useUpdateNoteMutation,
	useUpdateUserMutation,
} from "@/redux/services/userApi";
import { getActivityString } from "@/helper/getActivityString";
import { NoteModal } from "@/components/NoteModal";
import { useStartChatMutation } from "@/redux/services/chatApi";
import { isPremium } from "@/helper/checkIsActive";
import { ROUTES } from "@/app/routes";
import { InfoModal } from "@/components/InfoModal";
import { useCreateClaimMutation } from "@/redux/services/claimApi";
import { useCityLabel } from "@/helper/getCityString";
import { maskContacts } from "@/helper/maskContacts";
import useIsBlocked from "@/hooks/useIsBlocked";

interface ProfileViewProps {
	user: any;
}

const ProfileClient: FC<ProfileViewProps> = ({ user }) => {
	const router = useRouter();

	const { data: me } = useGetMeQuery(null);

	const [newVisit] = useNewVisitMutation();

	const { getCityLabel } = useCityLabel();

	useEffect(() => {
		if (!me?._id || !user?._id) return;

		newVisit({ id: user?._id, body: { timestamp: new Date(), guest: me._id } })
			.unwrap()
			.catch((err) => console.log(err));

		setNote(me?.notes.find((el: any) => el?._id === user?._id)?.text || "");
	}, [user?._id]);

	const [currentImage, setCurrentImage] = useState(user?.photos[0]?.url);

	const [note, setNote] = useState(
		me?.notes.find((el: any) => el?._id === user?._id)?.text || ""
	);

	const {
		isOpen: isNote,
		onOpen: onNote,
		onOpenChange: onNoteChange,
	} = useDisclosure();

	const [createNote] = useCreateNoteMutation();
	const [editNote] = useUpdateNoteMutation();
	const [deleteNote] = useDeleteNoteMutation();

	const addNote = async (text: string) => {
		if (!text) return;

		if (note) {
			editNote({ id: me?._id, body: { text, userId: user?._id } }).unwrap();
		} else {
			createNote({ id: me?._id, body: { text, userId: user?._id } }).unwrap();
		}
	};

	const [claim, setClaim] = useState(false);

	const [createClaim] = useCreateClaimMutation();

	const addClaim = async (text: string) => {
		if (!text) return;

		createClaim({ from: me?._id, text, about: user?._id })
			.unwrap()
			.then(() => {
				setClaim(true);
				onComplainOpenChange();
				onComplainInfoOpen();
			});
	};

	const removeNote = async () => {
		console.log("hi");
		// if (note) {
		deleteNote({ id: me?._id, body: { userId: user?._id } })
			.unwrap()
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
		setNote("");
		// }
	};

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const {
		isOpen: isRegisterRequired,
		onOpen: onRegisterRequired,
		onOpenChange: onRegisterRequiredChange,
	} = useDisclosure();

	const [startChat] = useStartChatMutation();

	const onSendMessage = async () => {
		if (!me) {
			onRegisterRequired();

			return;
		} else if (me?.sex === "male" && !isPremium(me)) {
			onPremiumRequired();

			return;
		}

		await startChat({ sender: me?._id, recipient: user?._id })
			.unwrap()
			.then((chat: any) => {
				router.push(`${ROUTES.ACCOUNT.DIALOGUES}/${chat._id}`);
			})
			.catch((err) => console.log(err));
	};

	const onOpenNote = () => {
		if (isNote) return;

		onNote();
	};

	const premium = isPremium(me);

	const audioRef = useRef<any>(null);

	const {
		isOpen: isRegistrationRequired,
		onOpen: onRegistrationRequired,
		onOpenChange: onRegistrationRequiredChange,
	} = useDisclosure();

	const handlePlay = () => {
		if (!me || me?.status !== "active") {
			onRegistrationRequired();
			return;
		}

		if (!premium && me?.sex === "male") {
			onPremiumRequiredVoiceChange();
			return;
		}

		const audio = new Audio(`${config.MEDIA_URL}/${user?.voice}`);
		audio.play().catch((err) => {
			console.error("Ошибка воспроизведения:", err);
		});
	};

	const {
		isOpen: isPremiumRequiredVoice,
		onOpen: onPremiumRequiredVoice,
		onOpenChange: onPremiumRequiredVoiceChange,
	} = useDisclosure();

	const {
		isOpen: isComplainOpen,
		onOpen: onComplainOpen,
		onOpenChange: onComplainOpenChange,
	} = useDisclosure();

	const {
		isOpen: isComplainInfoOpen,
		onOpen: onComplainInfoOpen,
		onOpenChange: onComplainInfoOpenChange,
	} = useDisclosure();

	const isBlocked = useIsBlocked(me, user?._id);
	const [updateBlockList] = useUpdateUserMutation();

	const onBlock = () => {
		let newBlockList = [];

		if (me?.blockList?.includes(user?._id)) {
			newBlockList = me?.blockList.filter((item: any) => item !== user?._id);
		} else {
			newBlockList = [...me?.blockList, user?._id]; // ✅ создаем новый массив вместо push
		}

		updateBlockList({ id: me._id, body: { blockList: newBlockList } }).unwrap();
	};

	return (
		<div
			className={cn(
				"flex w-full flex-col px-3 sm:px-9 gap-[30px] min-h-screen",
				{
					"pt-[70px]": me,
					"sm:pt-[80px]": !me,
				}
			)}
		>
			{user && user?.status === "active" ? (
				<>
					<div className="flex w-full items-center justify-between">
						<div>
							<Button
								className="w-full z-0 relative"
								radius="full"
								onPress={() => router.push(ROUTES.ACCOUNT.SEARCH)}
							>
								Назад к результатам
							</Button>
						</div>

						{/* <button
							className="cursor-pointer hover:text-primary"
							onClick={() => router.back()}
						>
							Назад к результатам
						</button> */}
					</div>

					<div className="w-full grid grid-cols-12 sm:gap-9">
						<div className="col-span-12 sm:col-span-6 flex flex-col">
							<div className="overflow-hidden relative rounded-[36px]">
								<Image
									alt=""
									className="z-0 relative"
									radius="none"
									src={
										currentImage || user?.photos[0]?.url
											? `${config.MEDIA_URL}/${currentImage || user?.photos[0]?.url}`
											: user?.sex === "male"
												? "/men2.png"
												: "/woman2.png"
									}
									width={"100%"}
									height={"100%"}
								/>
							</div>

							<div className="grid grid-cols-3 sm:grid-cols-4 mb-6 sm:mb-0 gap-4 w-full mt-4">
								{user?.photos.map((item: any, idx: number) => (
									<button
										key={item.url}
										className="overflow-hidden relative rounded-[24px]"
										onClick={() => setCurrentImage(item.url)}
									>
										<Image
											alt=""
											className="z-0 relative object-cover min-w-full object-center"
											height={"100%"}
											radius="none"
											src={
												item?.url
													? `${config.MEDIA_URL}/${item.url}`
													: user?.sex === "male"
														? "/men2.png"
														: "/woman2.png"
											}
											width={"100%"}
										/>
										{/* <Image
											alt=""
											src={
												item?.photos?.[0]?.url
													? `${config.MEDIA_URL}/${item.url}`
													: item?.sex === "male"
														? "/men2.png"
														: "/woman2.png"
											}
											className="w-full h-full object-cover min-w-full object-center" // 🔥 фикс высоты
											radius="none" // убираем скругление от HeroUI (контейнер уже скруглен)
										/> */}
									</button>
								))}
							</div>
						</div>

						<div className="col-span-12 sm:col-span-6 bg-white dark:bg-foreground-100 rounded-[36px] p-6 py-9 sm:p-[36px] flex flex-col justify-between">
							<div className="flex flex-col gap-6">
								<div className="flex justify-between items-start gap-6 owerflow-hidden w-full">
									<div className="flex flex-col -mt-3">
										<div className="flex lg:hidden gap-1.5 items-center">
											{getActivityString(user?.activity) === "онлайн" ? (
												<>
													<div className="w-2 h-2 rounded-full bg-green-400" />
													<p className="-mt-[2px] text-[12px] hidden sm:flex">
														сейчас онлайн
													</p>
												</>
											) : (
												<p className="-mt-[2px] text-[12px]">
													{getActivityString(user?.activity)}
												</p>
											)}
										</div>
										<p className="font-semibold line-clamp-1 text-[24px] xl:text-[36px]">
											{user?.firstName
												? user.firstName
												: user.sex === "male"
													? "Мужчина"
													: "Девушка"}
										</p>
										<p className="text-[18px] xl:text-[24px]">
											{user?.age ? user.age + ", " : ""}
											{getCityLabel(user?.city)}
										</p>
									</div>

									<div className="hidden lg:flex gap-1.5 items-center flex-nowrap min-w-[110px]">
										{getActivityString(user?.activity) === "онлайн" ? (
											<>
												<div className="w-2 h-2 rounded-full bg-green-400" />
												<p className="-mt-[2px] text-[12px] hidden sm:flex">
													сейчас онлайн
												</p>
											</>
										) : (
											<p className="-mt-[2px] text-[12px]">
												{getActivityString(user?.activity)}
											</p>
										)}
									</div>
								</div>
								<div className="flex gap-6 -ml-1.5">
									<div className="flex items-center gap-1">
										<MdOutlineHeight
											className="w-[20px] text-primary"
											size={20}
										/>
										<p>рост - {user?.height} см </p>
									</div>

									<div className="flex items-center gap-1">
										<GiWeight className="w-[18px] text-primary" size={18} />
										<p>вес - {user?.weight} кг</p>
									</div>
								</div>
								{user?.voice ? (
									<div>
										<button
											onClick={handlePlay}
											className="bg-primary text-white rounded-full h-[38px] px-3.5 flex gap-1 items-center"
										>
											<PiWaveform className="w-5 h-5" />
											<p>Голос</p>
										</button>
									</div>
								) : null}

								<div className="flex flex-col gap-1 pt-6">
									<p className="font-semibold text-[20px]">Цели знакомства</p>
									<ul className="list-disc leading-9 mt-1 ml-5 text-[16px]">
										{user.sponsor ? (
											<li>
												{user?.sex === "male"
													? "стану спонсором"
													: "ищу спонсора"}
											</li>
										) : null}
										{user.traveling ? <li>совместные путешествия</li> : null}
										{/* {user.relationships ? <li>постоянные отношения</li> : null} */}
										{user.evening ? <li>провести вечер</li> : null}
										{user.relationships ? <li>серьезные отношения</li> : null}
										{/* {user.evening ? <li>общение</li> : null} */}
										{/* {user.traveling ? <li>свободное общение</li> : null} */}
									</ul>
								</div>

								<div className="flex flex-col gap-1 pt-6">
									<p className="font-semibold text-[20px]">О себе</p>

									<p className="mt-1">
										{user?.about && user?.about !== undefined
											? maskContacts(user?.about, false) ||
												"Пользователь предпочел не указывать информацию о себе."
											: "Пользователь предпочел не указывать информацию о себе."}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
								{note ? (
									<div className="grid col-span-1 sm:col-span-2 gap-6 mt-6 w-full">
										<Note text={note} onDelete={removeNote} />
									</div>
								) : null}
								{me ? (
									<>
										<Button
											className="z-0 relative"
											color="secondary"
											radius="full"
											variant="solid"
											onPress={onNote}
										>
											{note ? "Редактировать заметку" : "Создать заметку"}
										</Button>

										<Button
											className="z-0 relative"
											color="secondary"
											radius="full"
											variant="solid"
											onPress={onBlock}
										>
											{isBlocked ? "Разблокировать" : "Заблокировать"}
										</Button>
									</>
								) : null}
								<Button
									className="z-0 relative"
									color="primary"
									radius="full"
									variant="solid"
									onPress={onSendMessage}
								>
									Написать сообщение
								</Button>

								{!claim && me && me?._id !== user?._id ? (
									<Button
										className="z-0 relative"
										color="secondary"
										radius="full"
										variant="solid"
										onPress={onComplainOpen}
									>
										Пожаловаться
									</Button>
								) : null}
							</div>
						</div>
					</div>
				</>
			) : (
				<div>
					<div className="flex w-full items-center justify-between">
						<div>
							<Button
								className="w-full z-0 relative"
								radius="full"
								onPress={() => router.push(ROUTES.ACCOUNT.SEARCH)}
							>
								Назад к результатам
							</Button>
						</div>
					</div>

					{!user || user?.status !== "active" ? (
						<div className="w-full h-full mt-20 flex justify-center px-6 sm:px-20">
							<p className="sm:text-[20px] text-center">
								Анкета была удалена пользователем или администрацией за
								нарушение правил платформы.
							</p>
						</div>
					) : null}
				</div>
			)}

			<NoteModal
				isOpen={isNote}
				note={note}
				onOpenChange={onNoteChange}
				onSave={(text: string) => addNote(text)}
			/>

			<NoteModal
				isOpen={isComplainOpen}
				onOpenChange={onComplainOpenChange}
				isClaim
				note=""
				onSave={(text: string) => addClaim(text)}
			/>

			<InfoModal
				actionBtn="Купить"
				isOpen={isPremiumRequired}
				text={
					"Для того чтобы общаться с девушками, Вам нужно купить премиум подписку"
				}
				title={"Нужен премиум"}
				onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				onOpenChange={onPremiumRequiredChange}
			/>

			<InfoModal
				isOpen={isRegisterRequired}
				text={
					"Для того чтобы начать общаться, Вам нужно зарегистрироваться на сайте"
				}
				title={"Нужна регистрация"}
				onAction={() => null}
				onOpenChange={onRegisterRequiredChange}
			/>

			<InfoModal
				actionBtn="Купить"
				isOpen={isPremiumRequiredVoice}
				text={
					"Для того чтобы получить доступ к прослушиванию голоса, Вам нужно купить премиум подписку"
				}
				title={"Нужен премиум"}
				onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				onOpenChange={onPremiumRequiredVoiceChange}
			/>

			<InfoModal
				isOpen={isRegistrationRequired}
				text={
					"Для того чтобы получить доступ к прослушиванию голоса, Вам нужна регистрация и премиум подписка"
				}
				title={"Нужны регистрация и премиум"}
				onOpenChange={onRegistrationRequiredChange}
			/>

			<InfoModal
				isOpen={isComplainInfoOpen}
				text={"Ваша жалоба принята и будет рассмотрена в ближайшее время"}
				title={"Жалоба"}
				onOpenChange={onComplainInfoOpenChange}
			/>
		</div>
	);
};

export default ProfileClient;
