"use client";

import { InfoModal } from "@/components/InfoModal";
import {
	useBuyContactMutation,
	useGetMeQuery,
	useUpdateUserMutation,
} from "@/redux/services/userApi";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { FC, useState } from "react";

interface ConfirmPurchaseProps {
	isOpen: boolean;
	onOpenChange: () => void;
	user: any;
	contactType: string;
	amount: number;
}

const ConfirmPurchase: FC<ConfirmPurchaseProps> = ({
	isOpen,
	onOpenChange,
	user,
	contactType,
	amount,
}) => {
	const { data: me } = useGetMeQuery(null);

	const {
		isOpen: isOpenInfo,
		onOpen: onOpenInfo,
		onOpenChange: onOpenInfoChange,
	} = useDisclosure();

	const [info, setInfo] = useState({
		title: "",
		text: "",
		btn: "",
	});

	const [buyContact] = useBuyContactMutation();

	const buy = async () => {
		if (me?.balance < +amount) {
			setInfo({
				title: "Ошибка",
				text: "Недостаточно средств!",
				btn: "",
			});

			return onOpenInfo();
		} else {
			let contact = me?.purchasedContacts.find(
				(i: any) => i.user === user?._id
			);

			if (contact) {
				contact = {
					...contact,
					[contactType.toLowerCase()]:
						user.contacts[0][contactType.toLowerCase()],
				};
			} else {
				contact = {
					user: user?._id,
					telegram: contactType === "Telegram" ? user.contacts[0].telegram : "",
					whatsapp: contactType === "WhatsApp" ? user.contacts[0].whatsapp : "",
					phone: contactType === "Номер телефона" ? user.contacts[0].phone : "",
				};
			}

			const getContact = () => {
				if (contactType === "Telegram") {
					return user.contacts[0].telegram;
				} else if (contactType === "WhatsApp") {
					return user.contacts[0].whatsapp;
				} else if (contactType === "Номер телефона") {
					return user.contacts[0].phone;
				}
			};

			buyContact({
				seller: user._id,
				buyer: me._id,
				contactType: contactType,
				amount,
				contact,
			})
				.unwrap()
				.then(() => {
					setInfo({
						title: "Успешно",
						text: `Контакт (${contactType}) успешно преобретен и теперь он будет отображаться для вас в профиле пользователя! ${getContact()}`,
						btn: "",
					});
					onOpenChange();
					onOpenInfo();
				})
				.catch((err: any) => console.log(err));
		}
	};

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
						Купить контакт
					</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-5">
							<p className="mt-3 font-semibold">
								{`Вы можете купить контакт (${contactType}) пользователя ${user?.firstName} за ${amount} ₽`}
							</p>
							<p className="text-xs">
								Контакт сразу станет доступен для вас в профиле пользователя
							</p>
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
								onPress={buy}
							>
								Купить
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
		</>
	);
};

export default ConfirmPurchase;
