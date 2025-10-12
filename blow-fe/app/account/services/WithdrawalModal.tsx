"use client";

import { InfoModal } from "@/components/InfoModal";
import { useGetMeQuery, useWithdawalMutation } from "@/redux/services/userApi";
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
import { FC, use, useEffect, useState } from "react";

interface WithdrawalModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const WithdrawalModal: FC<WithdrawalModalProps> = ({
	isOpen,
	onOpenChange,
}) => {
	const withdrawalOptions = [
		{ label: "На номер телефона", value: "phone" },
		{ label: "Кошелек USDT TRC20", value: "usdt" },
	];

	const [withdrawalType, setWithdrawalType] = useState(withdrawalOptions[0]);
	const [value, setValue] = useState("");
	const [amount, setAmount] = useState("");

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

	const { data: me } = useGetMeQuery(null);

	const [create] = useWithdawalMutation();

	const onWithdrawal = () => {
		if (!me) return;

		if (!value || !amount) {
			setInfo({
				title: "Ошибка",
				text: "Укажите все данные для вывода средств.",
				btn: "",
			});
			onOpenInfo();
      return
		}

    if (+amount > +me.balance) {
			setInfo({
				title: "Ошибка",
				text: "Недостаточно средств",
				btn: "",
			});
			onOpenInfo();
      return
		}

		create({
				user: me?._id,
				type: withdrawalType.value,
				data: value,
				amount: Number(amount)
		})
			.unwrap()
			.then(() => {
				setInfo({
					title: "Успешно",
					text: "Запрос на вывод средств отправлен",
					btn: "",
				});
				setAmount(""), setValue("");
				onOpenChange();
				onOpenInfo();
			})
			.catch((err) => {
				setInfo({
					title: "Ошибка",
					text: "Запрос на вывод средств отклонен",
					btn: "",
				});
				setAmount(""), setValue("");
				onOpenChange();
				onOpenInfo();
			});
	};

	// const [update] = useUpdateUserMutation();
	// const [send] = useSystemMessageMutation();

	// const onShare = () => {
	//   if (!price || Number(price) < 1000) {
	//     return;
	//   }

	//   if (!me?.contacts?.[contactType.value]) {
	//     update({
	//       id: me?._id,
	//       body: {
	//         contacts: {
	//           [contactType.value]: contact,
	//         },
	//       },
	//     }).unwrap();
	//   }

	//   send({
	//     chat: chatId,
	//     recipient: recipientId,
	//     text: `Вы можете приобрести контакт (${contactType.label}) пользователя ${name} по цене ${price} ₽`,
	//   })
	//     .unwrap()
	//     .then((res) => onOpenChange())
	//     .catch((err) => console.log(err));
	// };

	// useEffect(() => {
	//   switch (contactType.value) {
	//     case "phone":
	//       if (me?.contacts?.phone) setContact(me.contacts.phone);
	//       break;
	//     case "telegram":
	//       if (me?.contacts?.telegram) setContact(me.contacts.telegram);
	//       break;
	//     case "whatsapp":
	//       if (me?.contacts?.whatsapp) setContact(me.contacts.whatsapp);
	//   }
	// }, [contactType]);

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
						Вывести средства
					</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-5">
							<Select
								className="w-full text-primary"
								classNames={{
									trigger: "bg-white dark:bg-foreground-300",
								}}
								placeholder=""
								radius="full"
								selectedKeys={[withdrawalType.value]}
								onChange={(el: any) =>
									setWithdrawalType(
										withdrawalOptions?.find(
											(i: any) => i.value === el.target.value
										) || withdrawalOptions[0]
									)
								}
							>
								{withdrawalOptions.map((i) => (
									<SelectItem key={i.value}>{i.label}</SelectItem>
								))}
							</Select>

							<Input
								classNames={{
									input: "bg-transparent dark:text-white",
									inputWrapper: "dark:bg-foreground-200",
								}}
								placeholder={
									withdrawalType.value === "usdt" ? "Кошелек" : "Номер"
								}
								radius="full"
								type="text"
								value={value}
								onValueChange={(value: string) => setValue(value)}
							/>

							<p className="text-center mt-3 font-semibold">Сумма вывода, ₽</p>

							<Input
								classNames={{
									input: "bg-transparent dark:text-white",
									inputWrapper: "dark:bg-foreground-200",
								}}
								placeholder="1000"
								radius="full"
								type="text"
								value={amount}
								onValueChange={(value: string) => {
									// удаляем все символы, кроме цифр
									const onlyNumbers = value.replace(/\D/g, "");

									// просто сохраняем промежуточное значение
									setAmount(onlyNumbers);
								}}
								onBlur={() => {
									// когда пользователь закончил ввод (ушёл с поля) — проверяем минимальное значение
									if (amount && Number(amount) < 1000) {
										setAmount("1000");
									}
								}}
							/>

							<p className="text-xs">
								*Минимальная сумма 1 000 ₽. Поступление средств в течении 48
								часов.
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
								onPress={onWithdrawal}
							>
								Вывести
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

export default WithdrawalModal;
