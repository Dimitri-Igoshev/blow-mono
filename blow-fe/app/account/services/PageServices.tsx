"use client";

import { ru } from "date-fns/locale";
import { format } from "date-fns";
import { useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";

import { ServiceCard } from "@/components/ServiceCard";
import { useGetServicesQuery } from "@/redux/services/serviceApi";
import {
	useBuyServiceMutation,
	useBuyServicesKitMutation,
	useGetMeQuery,
	useReiseProfileMutation,
} from "@/redux/services/userApi";
import { InfoModal } from "@/components/InfoModal";
import { isPremium, MAILING_ID, RAISE_ID } from "@/helper/checkIsActive";
import {
	useCreatePaymentMutation,
	useTopUpMutation,
} from "@/redux/services/paymentApi";
import { useRouter } from "next/navigation";
import { config } from "@/common/env";
import crypto from "crypto";
import { TopUpModal } from "@/components/TopUpModal";
import { useVerifyTokenMutation } from "@/redux/services/topupApi";
import WithdrawalModal from "./WithdrawalModal";
import PaymentModal from "./PaymentModal";
import AmountModal from "./AmountModal";

type PaymentData = {
	PayerId?: string;
	TerminalKey: string;
	Amount: number;
	OrderId?: string;
	Description: string;
	Password: string;
	Token?: string;
};

export default function AccountServices() {
	const { data: me, refetch } = useGetMeQuery(null);
	const { data: services } = useGetServicesQuery(null);

	const searchParams = useSearchParams();
	const topup = searchParams.get("topup");

	const [verifyToken] = useVerifyTokenMutation();

	const [amount, setAmount] = useState(0);

	useEffect(() => {
		if (!topup) return;

		verifyToken(topup)
			.unwrap()
			.then((res: any) => {
				setAmount(+res?.amount || 0);
				onTopupOpen();
			})
			.catch((e: any) => {
				onTopupErrorOpen();
			});
	}, [topup]);

	const {
		isOpen: isTopupOpen,
		onOpen: onTopupOpen,
		onOpenChange: onTopupChange,
	} = useDisclosure();

	const {
		isOpen: isTopupErrorOpen,
		onOpen: onTopupErrorOpen,
		onOpenChange: onTopupErrorChange,
	} = useDisclosure();

	// const [addBalance] = useAddBalanceMutation();
	const [createPayment] = useCreatePaymentMutation();

	function generateSignature(data: PaymentData): string {
		const concatenated = `${data.Amount}${data.Description}${data.OrderId}${data.Password}${data.TerminalKey}`;

		const hash = crypto
			.createHash("sha256")
			.update(concatenated, "utf8")
			.digest("hex");

		return hash;
	}

	const addMoney = async (price: number) => {
		if (!me?._id) return;

		const win = window.open("", "_blank");

		// const body = {
		// 	payerId: me._id,
		// 	checkout: {
		// 		test: false,
		// 		transaction_type: "payment",
		// 		attempts: 3,
		// 		iframe: true,
		// 		order: {
		// 			currency: "RUB",
		// 			amount: price * 100,
		// 			description: "Пополнение счета на сайте blow.ru",
		// 			tracking_id: uuidv4().toString(), //идентификатор транзакции на стороне торговца
		// 			additional_data: {
		// 				contract: ["recurring", "card_on_flie"],
		// 			}, //заполнить при необходимости получить в ответе токен.
		// 		},
		// 		settings: {
		// 			return_url: "https://blow.ru/account/services", //URL, на который будет перенаправлен покупатель после завершения оплаты.
		// 			success_url: "https://blow.ru/account/services",
		// 			decline_url: "https://blow.ru/account/services",
		// 			fail_url: "https://blow.ru/account/services",
		// 			cancel_url: "https://blow.ru/account/services",
		// 			notification_url: "https://blow.ru/api/notification", //адрес сервера торговца, на который система отправит автоматическое уведомление с финальным статусом транзакции.
		// 			button_next_text: "Вернуться в магазин",
		// 			auto_pay: false,
		// 			language: "ru",
		// 			customer_fields: {
		// 				// visible: [
		// 				// 	me?.firstName || "",
		// 				// 	me?.lastName || "", //массив дополнительных полей на виджете
		// 				// ],
		// 			},
		// 			payment_method: {
		// 				types: ["credit_card"], //массив доступных платежных методов
		// 				/*"credit_card": {
		//                 "token": "13dded21-ed69-4590-8bcb-db522a89735c"
		//             }*/ //токен необходимо отправить при использовании auto_pay
		// 			},
		// 		},
		// 	},
		// };

		// const body = {
		// 	payerId: me._id,
		// 	token: "c35920a427827ce7643b5ba1",
		// 	amount: price,
		// 	description: "Пополнение счета на сайте blow.ru",
		// 	method: "card",
		// 	order_id: uuidv4().toString(),
		// };

		const paymentData = {
			PayerId: me._id,
			TerminalKey: config.TBANK_TERMINAL_KEY,
			Amount: price * 100,
			OrderId: uuidv4().toString(),
			Description: "Пополнение счета",
			DATA: {
				Email: me?.email || "",
			},
			Receipt: {
				Email: me?.email || "",
				Taxation: "usn_income",
				Items: [
					{
						Name: "Пополнение счета",
						Price: price * 100,
						Quantity: 1,
						Amount: price * 100,
						Tax: "none",
					},
				],
			},
		};

		const token = generateSignature({
			...paymentData,
			Password: config.TBANK_PASSWORD,
		});

		try {
			const response = await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...paymentData, Token: token }), // передаем данные в body
			});

			const result = await response.json();

			console.log("from t-bank", result.PaymentURL);

			if (win) {
				win.location.href = result.PaymentURL;
			}
		} catch (error) {
			if (win) {
				win.close(); // Закрываем вкладку, если не удалось получить URL
			}

			console.error("Ошибка при отправке данных:", error);
		}
	};

	const getSubtitle = (item: any): string => {
		const isExist = me?.services.find((i: any) => i._id === item._id);

		if (!isExist) return "";

		if (isExist?.quantity) {
			return `осталось ${isExist.quantity}`;
		} else if (isExist?.expiredAt) {
			return new Date(isExist.expiredAt) < new Date(Date.now())
				? ""
				: `до ${format(new Date(isExist.expiredAt), "dd.MM.yyyy, HH:mm", {
						locale: ru,
					})}`;
		} else {
			return "";
		}
	};

	const [getService] = useBuyServiceMutation();
	const [getServicesKit] = useBuyServicesKitMutation();
	const [info, setInfo] = useState({
		title: "",
		text: "",
		btn: "",
	});

	const [isUp, setIsUp] = useState(false);

	const buyService = (item: any, value: any) => {
		if (me?.balance < +value?.price) {
			setInfo({
				title: "Ошибка",
				text: "Недостаточно средств!",
				btn: "",
			});

			return onOpen();
		}

		if (
			item?._id === "6830b9a752bb4caefa0418a8" &&
			me?.sex === "male" &&
			!isPremium(me)
		) {
			onPremiumRequired();
			return;
		}

		if (!item?.services?.length) {
			getService({
				userId: me._id,
				serviceId: item._id,
				name: item?.name,
				period: value?.period,
				quantity: value?.quantity,
				price: value?.price,
			})
				.unwrap()
				.then((res) => {
					setInfo({
						title: "Поздравляем",
						text: "Услуга добавлена!",
						btn: "",
					});

					if (item?._id === "6830b4d752bb4caefa041497") {
						setIsUp(true);
					}

					return onOpen();
				})
				.catch((e) => console.log("ошибка покупки сервиса"));
		} else {
			const option = item.options.find((i: any) => i.price == value.price);

			getServicesKit({
				userId: me._id,
				serviceId: item._id,
				name: item?.name,
				period: value?.period,
				price: value?.price,
				services: item?.services,
				servicesOptions: option?.servicesOptions,
			})
				.unwrap()
				.then((res) => {
					setInfo({
						title: "Поздравляем",
						text: "Премиум добавлен!",
						btn: "",
					});

					return onOpen();
				})
				.catch((e) => console.log("ошибка покупки сервисного набора"));
		}
	};

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const womenServices = services?.filter(
		(item: any) => item?._id !== MAILING_ID
	);

	const genderServices = me?.sex === "male" ? services : womenServices;

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const router = useRouter();

	const [topUpLoading, setTopUpLoading] = useState(false);
	const [topUp] = useTopUpMutation();

	const topUpMoney = () => {
		if (!me?._id || !topUp || !amount) return;

		setTopUpLoading(true);

		topUp({
			token: topup,
			amount: Number(amount),
			userId: me._id,
		})
			.unwrap()
			.then((res) => {
				refetch();
				setTopUpLoading(false);
				onTopupChange();
			})
			.catch((e: any) => console.log(e));
	};

	const [raise] = useReiseProfileMutation();

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

				setIsUp(false);

				onOpen();
			})
			.catch((err: any) => console.log(err));
	};

	const {
		isOpen: isWithdrawal,
		onOpen: onWithdrawal,
		onOpenChange: onWithdrawalChange,
	} = useDisclosure();

	const {
		isOpen: isPayment,
		onOpen: onPayment,
		onOpenChange: onPaymentChange,
	} = useDisclosure();

	const servicesRender = useMemo(() => {
		if (!Array.isArray(genderServices)) return [];
		const arr = [...genderServices];
		if (arr.length > 2) {
			[arr[1], arr[2]] = [arr[2], arr[1]];
		}
		return arr;
	}, [genderServices]);

	return (
		<div className="flex w-full flex-col px-3 sm:px-9 pt-[84px] gap-[30px] min-h-screen">
			<div className="flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">Услуги</h1>
			</div>

			<ServiceCard
				oneTime
				buttonText="Пополнить"
				defaultVlue={{ period: "", price: "5000" }}
				list={[
					"При оплате картой в выписке и личном кабинете не будет указано, что платеж связан с сайтом знакомств.",
					"Ваши данные карты остаются конфиденциальными. Мы их не видим, и банк не передает эту информацию третьим лицам.",
					"Мы не подключаем автоподписки и не выполняем повторные списания.",
				]}
				subtile={`${me?.balance || 0} ₽`}
				title="Кошелек"
				transactions={me?.transactions || []}
				onClick={onPayment}
				onWithdrawal={onWithdrawal}
			/>

			{servicesRender.map((item: any) => (
				<ServiceCard
					key={item._id}
					buttonText={item?.btn || "Купить"}
					options={item.options}
					subtile={getSubtitle(item)}
					text={item.description}
					title={item.name}
					type={
						item._id === "6831854519e3572edace86b7"
							? "mailing"
							: item._id === "6831be446c59cd4bad808bb5"
								? "premium"
								: "service"
					}
					onClick={(value: any) => buyService(item, value)}
				/>
			))}

			{/* <ServiceCard
        buttonText="Продлить"
        defaultVlue={{ period: "month", price: "7900" }}
        subtile="осталось 3 дня"
        text="Чтобы продолжить знакомиться с новыми девушками после окончания пробного периода, необходимо активировать премиум-аккаунт. Пробный период длится 24 часа с момента начала общения, давая вам возможность оценить, насколько вам интересно знакомство и встречи на нашем сайте."
        title="Премиум аккаунт"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        oneTime
        buttonText="Поднять"
        defaultVlue={{ period: "", price: "200" }}
        subtile="Вы на 145 месте"
        text='Поднятие анкеты выведет ее в поиске на первое место после анкет из раздела "ТОП". Если у вас уже оплачено размещение в "ТОП", поднятие сделает вашу анкету первой в этой категории.'
        title="Поднятие анкеты"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        buttonText="В топ"
        defaultVlue={{ period: "month", price: "1000" }}
        subtile=""
        text='Для закрепления анкеты в "ТОП" требуется активный премиум-аккаунт. Это необходимо, потому что без премиум-аккаунта вы не сможете отвечать на сообщения девушек, и вложенные средства не принесут желаемого результата.'
        title="В топ"
        onClick={(value: any) => console.log(value)}
      /> */}

			<InfoModal
				isOpen={isOpen}
				text={info.text}
				title={info.title}
				onOpenChange={onOpenChange}
				actionBtn={isUp ? "Поднять" : info.btn ? info.btn : ""}
				onAction={raiseProfile}
			/>

			<InfoModal
				// actionBtn="Купить"
				isOpen={isPremiumRequired}
				text={`Для закрепления анкеты в "ТОП" требуется активный премиум-аккаунт. Это необходимо, потому что без премиум-аккаунта вы не сможете отвечать на сообщения девушек, и вложенные средства не принесут желаемого результата.`}
				title={"Нужен премиум"}
				// onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				onOpenChange={onPremiumRequiredChange}
			/>

			<TopUpModal
				isOpen={isTopupOpen}
				onOpenChange={onTopupChange}
				amount={amount}
				onAction={topUpMoney}
				loading={topUpLoading}
			/>

			<InfoModal
				isOpen={isTopupErrorOpen}
				onOpenChange={onTopupErrorChange}
				title="Ошибка"
				text="Карта пополнения неактивна или уже использована"
			/>

			<WithdrawalModal
				isOpen={isWithdrawal}
				onOpenChange={onWithdrawalChange}
			/>

			{/* <PaymentModal
				isOpen={isPayment}
				onOpenChange={onPaymentChange}
			/> */}

			<AmountModal isOpen={isPayment} onOpenChange={onPaymentChange} />
		</div>
	);
}
