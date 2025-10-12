import { config } from "@/common/env";
import type { ForwardResponse, IncomingPayload } from "../types";
import crypto from "crypto";

import { NextRequest } from "next/server";

// https://securepay.tinkoff.ru/v2/Init
// https://rest-api-test.tinkoff.ru/v2/Init

// {
//   "TerminalKey": "TinkoffBankTest",
//   "Amount": 140000,
//   "OrderId": "21090",
//   "Description": "Подарочная карта на 1000 рублей",
//   "Token": "68711168852240a2f34b6a8b19d2cfbd296c7d2a6dff8b23eda6278985959346",
//   "DATA": {
//     "Phone": "+71234567890",
//     "Email": "a@test.com"
//   },
//   "Receipt": {
//     "Email": "a@test.ru",
//     "Phone": "+79031234567",
//     "Taxation": "osn",
//     "Items": [
//       {
//         "Name": "Наименование товара 1",
//         "Price": 10000,
//         "Quantity": 1,
//         "Amount": 10000,
//         "Tax": "vat10",
//         "Ean13": "303130323930303030630333435"
//       },
//       {
//         "Name": "Наименование товара 2",
//         "Price": 20000,
//         "Quantity": 2,
//         "Amount": 40000,
//         "Tax": "vat20"
//       },
//       {
//         "Name": "Наименование товара 3",
//         "Price": 30000,
//         "Quantity": 3,
//         "Amount": 90000,
//         "Tax": "vat10"
//       }
//     ]
//   }
// }

type PaymentData = {
	PayerId?: string;
	TerminalKey: string;
	Amount: number;
	OrderId?: string;
	Description: string;
	Password: string;
	Token?: string;
};

export async function POST(req: NextRequest) {
	try {
		const data: PaymentData = await req.json();

		const { PayerId, ...rest } = data;

		const res = await fetch("https://securepay.tinkoff.ru/v2/Init", {
			method: "POST",
			headers: {
				// Authorization: authHeader,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(rest),
		});

		const resTBank = await res.json()

		if (!res) throw new Error("Ошибка при отправке данных");

		const body = {
			payerId: data.PayerId,
			amount: +data.Amount / 100,
			order_id: data.OrderId,
		};

		const transaction = await fetch("https://blow.igoshev.de/api/payment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		// const html = await res.text(); // HTML-ответ вместо JSON
		// console.error("Ответ сервера (HTML):", html);

		// throw new Error(`Запрос не удался: ${res.status}`);

		return Response.json(resTBank);

		// const result = await res.json(); // теперь безопасно
		// console.log("Успешный ответ:", result);

		// console.log(444, res);

		// const result: ForwardResponse = await res.json();

		// console.log("[FORWARD RESPONSE]", result);

		// const transaction = fetch("https://blow.igoshev.de/api/payment", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(data),
		// });

		// console.log("[TRANSACTION RESPONSE]", transaction);

		// return Response.json(result);
	} catch (error) {
		console.error("[FORWARD ERROR]", error);

		return new Response(
			JSON.stringify({ message: "Ошибка при отправке данных" }),
			{ status: 500 }
		);
	}
}

// export async function POST(req: NextRequest) {
// 	try {
// 		const data: IncomingPayload = await req.json();

// 		const { payerId, ...rest } = data;

// 		const res = await fetch("https://lk.cactuspay.pro/api/?method=create", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(rest),
// 		});

// 		const result: ForwardResponse = await res.json();

// 		const transaction = fetch("https://blow.igoshev.de/api/payment", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(data),
// 		});

// 		console.log("[TRANSACTION RESPONSE]", transaction);

// 		return Response.json(result);
// 	} catch (error) {
// 		console.error("[FORWARD ERROR]", error);

// 		return new Response(
// 			JSON.stringify({ message: "Ошибка при отправке данных" }),
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function POST(req: NextRequest) {
//   try {
//     const data: IncomingPayload = await req.json();

//     const username = "29228";
//     const password =
//       "c2e08d259f7c5754c425c58ad89c97e3552fcb2407840aef23aa44379d2edc8e";
//     const authHeader =
//       "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

//     const res = await fetch("https://checkout.overpay.io/ctp/api/checkouts", {
//       method: "POST",
//       headers: {
//         Authorization: authHeader,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result: ForwardResponse = await res.json();

//     console.log("[FORWARD RESPONSE]", result);

//     const transaction = fetch("https://blow.igoshev.de/api/payment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     console.log("[TRANSACTION RESPONSE]", transaction);

//     return Response.json(result);
//   } catch (error) {
//     console.error("[FORWARD ERROR]", error);

//     return new Response(
//       JSON.stringify({ message: "Ошибка при отправке данных" }),
//       { status: 500 },
//     );
//   }
// }
