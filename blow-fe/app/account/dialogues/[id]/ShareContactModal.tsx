"use client";

import { InfoModal } from "@/components/InfoModal";
import { useSystemMessageMutation } from "@/redux/services/chatApi";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/services/userApi";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { PromotionModal } from "./PromotionModal";

interface ShareContactProps {
	chatId: string;
	recipientId: string;
	isOpen: boolean;
	onOpenChange: () => void;
}

const ShareContact: FC<ShareContactProps> = ({
	chatId,
	recipientId,
	isOpen,
	onOpenChange,
}) => {
	const contactOptions = [
		{ label: "Telegram", value: "telegram" },
		{ label: "WhatsApp", value: "whatsapp" },
		{ label: "Номер телефона", value: "phone" },
	];

	const [contactType, setContactType] = useState(contactOptions[0]);
	const [contact, setContact] = useState("");
	const [price, setPrice] = useState("");

	const { data: me } = useGetMeQuery(null);

	const [update] = useUpdateUserMutation();
	const [send] = useSystemMessageMutation();

	const {
		isOpen: isOpenInfo,
		onOpen: onOpenInfo,
		onOpenChange: onOpenInfoChange,
	} = useDisclosure();

	const {
		isOpen: isPromo,
		onOpen: onPromo,
		onOpenChange: onPromoChange,
	} = useDisclosure();

	const [info, setInfo] = useState({
		title: "",
		text: "",
		btn: "",
	});

	const onShare = () => {
		if (!price || Number(price) < 1000) {
			return;
		}

		if (contact?.length < 5) {
			setInfo({
				title: "Ошибка",
				text: "Контакт должен быть не менее 5 символов",
				btn: "",
			});

			return onOpenInfo();
		}

		if (!me?.contacts?.[contactType.value]) {
			update({
				id: me?._id,
				body: {
					contacts: {
						[contactType.value]: contact,
					},
				},
			})
				.unwrap()
				.then((res) => {
					setInfo({
						title: "Продажа контакта",
						text: "Мы предложили ваш  контакт пользователю. Если он его купит, вы получите 50% от стоимости. Отобразится во вкладке Услуги > Кошелек > История операций, там же можно вывести средства.",
						btn: "",
					});
					onOpenChange();
					onOpenInfo();
				});
		}

		send({
			chat: chatId,
			recipient: recipientId,
			text: `Вы можете приобрести контакт (${contactType.label}) пользователя ${name} по цене ${price} ₽`,
			unreadBy: [recipientId],
		})
			.unwrap()
			.then(() => onOpenChange())
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		switch (contactType.value) {
			case "phone":
				if (me?.contacts?.phone) setContact(me.contacts.phone);
				break;
			case "telegram":
				if (me?.contacts?.telegram) setContact(me.contacts.telegram);
				break;
			case "whatsapp":
				if (me?.contacts?.whatsapp) setContact(me.contacts.whatsapp);
		}
	}, [contactType]);

	return (
		<>
			<Modal
				backdrop="blur"
				className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
				classNames={{
					closeButton: "hidden",
				}}
				isOpen={isOpen}
				placement="center"
				size="sm"
				onOpenChange={onOpenChange}
				isDismissable={false}
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1 text-[20px] text-center">
						<div className="flex items-center justify-between gap-3">
							<p>Продать контакт</p>
							<IoInformationCircleOutline
								className="cursor-pointer hover:text-primary text-[24px]"
								onClick={onPromo}
							/>
						</div>
					</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-5">
							<Select
								className="w-full text-primary"
								classNames={{
									trigger: "bg-white dark:bg-foreground-300",
								}}
								placeholder="возраст (лет)"
								radius="full"
								selectedKeys={[contactType.value]}
								onChange={(el: any) =>
									setContactType(
										contactOptions?.find(
											(i: any) => i.value === el.target.value
										) || contactOptions[0]
									)
								}
							>
								{contactOptions.map((i) => (
									<SelectItem key={i.value}>{i.label}</SelectItem>
								))}
							</Select>

							<Input
								classNames={{
									input: "bg-transparent dark:text-white",
									inputWrapper: "dark:bg-foreground-200",
								}}
								placeholder={`Укажите ${contactType.label}`}
								radius="full"
								type="text"
								value={contact}
								onValueChange={(value: string) => setContact(value)}
							/>

							<p className="text-center mt-3 font-semibold">
								Стоимость контакта, ₽
							</p>
							<p className="text-center text-xs -mt-5">
								минимум 1 000 ₽, вы получите 50% на счет.
							</p>

							<Input
								classNames={{
									input: "bg-transparent dark:text-white",
									inputWrapper: "dark:bg-foreground-200",
								}}
								placeholder="1000"
								radius="full"
								type="text"
								value={price}
								onValueChange={(value: string) => {
									// удаляем все символы, кроме цифр
									const onlyNumbers = value.replace(/\D/g, "");

									// просто сохраняем промежуточное значение
									setPrice(onlyNumbers);
								}}
								onBlur={() => {
									// когда пользователь закончил ввод (ушёл с поля) — проверяем минимальное значение
									if (price && Number(price) < 1000) {
										setPrice("1000");
									}
								}}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<div className="flex flex-raw w-full gap-3">
							<Button className="w-full" radius="full" onPress={onOpenChange}>
								Закрыть
							</Button>
							<Button
								className="w-full"
								radius="full"
								color="primary"
								onPress={onShare}
							>
								Продать
							</Button>
						</div>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<InfoModal
				isOpen={isOpenInfo}
				text={info.text}
				title={info.title}
				onOpenChange={onOpenInfoChange}
				actionBtn={info.btn || ""}
			/>

			{me?.sex === "female" ? (
				<PromotionModal
					isOpen={isPromo}
					onOpenChange={onPromoChange}
					onClose={() => null}
				/>
			) : null}
		</>
	);
};

export default ShareContact;
