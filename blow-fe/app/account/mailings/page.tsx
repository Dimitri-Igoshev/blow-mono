"use client";

import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
	Textarea,
	Avatar,
	AvatarGroup,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

import {
	useCreateMailingMutation,
	useDeleteMailingMutation,
	useGetMailingsQuery,
	useUpdateMailingMutation,
} from "@/redux/services/mailingApi";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/services/userApi";
import { InfoModal } from "@/components/InfoModal";
import { ROUTES } from "@/app/routes";
import { config } from "@/common/env";
import { CameraIcon } from "@/common/icons";

const MAILINGS_ID = "6831854519e3572edace86b7";

export default function AccountMailings() {
	const router = useRouter();

	const { data: me } = useGetMeQuery(null);
	const { data: mailings } = useGetMailingsQuery(null);

	const male = me?.sex === "male";
	const quantity =
		me?.services.find((item: any) => item?._id === MAILINGS_ID)?.quantity > 0;

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [text, setText] = useState("");

	const addMailing = () => {
		if (!quantity) {
			onPremiumRequired();
		} else {
			onOpen();
		}
	};

	const [createMailing] = useCreateMailingMutation();
	const [updateMailing] = useUpdateMailingMutation();
	const [updateUser] = useUpdateUserMutation();

	useEffect(() => {
		if (!mailings?.length || !me || me?.lastMailing === mailings?.[0]?._id)
			return;

		updateUser({ id: me?._id, body: { lastMailing: mailings?.[0]?._id } })
			.unwrap;
	}, [mailings, me]);

	const save = () => {
		createMailing({
			owner: me?._id,
			text,
		})
			.unwrap()
			.then(() => {
				onOpenChange();
				setText("");

				const services = me?.services?.map((service: any) => {
					if (service?._id == MAILINGS_ID) {
						return {
							...service,
							quantity: +service?.quantity - 1,
						};
					} else {
						return service;
					}
				});

				updateUser({
					id: me?._id,
					body: { services },
				})
					.unwrap()
					.then()
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	};

	const onLike = (mailing: any) => {
		if (isLikes(mailing)) return;

		updateMailing({
			id: mailing?._id,
			body: { interested: [me?._id, ...mailing.interested] },
		})
			.unwrap()
			.catch((err) => console.log(err));
	};

	const isLikes = (mailing: any) => {
		return !!mailing?.interested?.find((i: any) => i?._id == me?._id);
	};

	const [removeMailing] = useDeleteMailingMutation();

	const remove = (id: string) => {
		removeMailing(id)
			.unwrap()
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<div className="flex w-full flex-col px-9 min-h-screen pt-[84px] gap-[30px]">
			<div className="flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">Рассылки</h1>

				{male ? (
					<Button
						className=""
						color={quantity ? "primary" : "default"}
						radius="full"
						onPress={addMailing}
					>
						Создать
					</Button>
				) : null}
			</div>

			{mailings ? (
				<div className="flex flex-col gap-3">
					{mailings?.map((mailing: any) => (
						<div
							key={mailing._id}
							className="bg-white w-full flex-col sm:flex-row justify-between items-start dark:bg-foreground-100 flex gap-5 rounded-[24px] p-5"
						>
							<div className="flex flex-col gap-3">
								<div className="text-[18px]">{mailing.text}</div>
								{mailing?.owner?._id === me?._id ? (
									<div className="flex flex-row gap-6 items-center mt-3">
										<p className="text-[14px] font-semibold">Откликнулись:</p>
										<AvatarGroup isBordered>
											{mailing?.interested?.map((item: any) => (
												<Avatar
													key={item._id}
													fallback={
														<CameraIcon
															className="animate-pulse w-6 h-6 text-default-500"
															fill="currentColor"
															size={20}
														/>
													}
													src={
														item?.photos[0]?.url
															? `${config.MEDIA_URL}/${item?.photos[0]?.url}`
															: item?.sex === "male"
																? "/men.jpg"
																: "/woman.jpg"
													}
													onClick={() =>
														router.push(`${ROUTES.ACCOUNT.SEARCH}/${item?._id}`)
													}
												/>
											))}
										</AvatarGroup>
									</div>
								) : null}
							</div>

							<div className="flex items-center gap-3">
								{me?._id === mailing?.owner?._id ? (
									<Button isIconOnly className="hover:bg-primary" radius="full">
										<MdDeleteOutline
											className="text-[18px]"
											onClick={() => remove(mailing?._id)}
										/>
									</Button>
								) : (
									<Avatar
										showFallback
										// isBordered={isPremium(me)}
										fallback={
											<CameraIcon
												className="animate-pulse w-6 h-6 text-default-500"
												fill="currentColor"
												size={20}
											/>
										}
										src={
											mailing?.owner?.photos[0]?.url
												? `${config.MEDIA_URL}/${mailing?.owner?.photos[0]?.url}`
												: mailing?.owner?.sex === "male"
													? "/men.jpg"
													: "/woman.jpg"
										}
										onClick={() =>
											router.push(
												`${ROUTES.ACCOUNT.SEARCH}/${mailing?.owner?._id}`
											)
										}
									/>
								)}
								{me?.sex !== "male" &&
								mailing?.owner?._id !== me?._id &&
								!isLikes(mailing) ? (
									<Button
										isIconOnly
										onPress={() => onLike(mailing)}
										radius="full"
										// variant="bordered"
										className="hover:bg-primary transition-all group"
									>
										<FaHeart className="text-[18px]" />
									</Button>
								) : null}
							</div>
						</div>
					))}
				</div>
			) : (
				<p>Еще нет рассылок...</p>
			)}

			<InfoModal
				actionBtn="Купить"
				isOpen={isPremiumRequired}
				text={
					"Для того чтобы создавать рассылки, Вам нужно купить соответствующий пакет услуг"
				}
				title={"Вы не можете создать рассылку"}
				onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				onOpenChange={onPremiumRequiredChange}
			/>

			<Modal
				backdrop="blur"
				className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
				classNames={{
					closeButton: "m-3.5",
				}}
				isOpen={isOpen}
				placement="center"
				size="sm"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-[20px]">
								Создание рассылки
							</ModalHeader>
							<ModalBody>
								<Textarea
									label="Текст рассылки"
									placeholder="Опишите здесь суть своего предложения..."
									value={text}
									onChange={(e) => setText(e.target.value)}
								/>
							</ModalBody>
							<ModalFooter>
								<div className="flex flex-raw w-full gap-3">
									<Button className="w-full" radius="full" onPress={onClose}>
										Отменить
									</Button>
									<Button
										className="w-full"
										color="primary"
										radius="full"
										onPress={save}
									>
										Сохранить
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
