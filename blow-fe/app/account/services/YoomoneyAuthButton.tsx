"use client";
import { useGetMeQuery } from "@/redux/services/userApi"
import { Button, Image } from "@heroui/react";

type Props = {
	amount: number; // сумма
	label: string; // ваш ID заказа
	targets?: string; // назначение платежа
	receiver: string; // номер кошелька, например 4100...
	successURL: string; // страница успеха у вас
	paymentType?: "AC" | "PC"; // AC — карта, PC — кошелёк; если не укажете, юзер выберет сам
};

export default function YoomoneyP2PButton({
	amount,
	label,
	targets = "Оплата",
	receiver,
	successURL,
	paymentType,
}: Props) {
  const { data: me } = useGetMeQuery(null)
  
	const start = () => {
		const f = document.createElement("form");
		f.method = "POST";
		f.action = "https://yoomoney.ru/quickpay/confirm"; // POST-форма Quickpay
		f.acceptCharset = "utf-8";

		const add = (name: string, value: string) => {
			const i = document.createElement("input");
			i.type = "hidden";
			i.name = name;
			i.value = value;
			f.appendChild(i);
		};

		add("receiver", receiver);
		add("quickpay-form", "shop"); // или 'donate'
		add("targets", targets);
		add("sum", amount.toFixed(2));
    add('label', `uid:${me._id}:${crypto.getRandomValues(new Uint32Array(1))[0]}`);
		add("successURL", successURL);
		// запрашивать контакты у плательщика (по желанию):
		// add('need-email', 'true'); add('need-phone', 'true');

		if (paymentType) add("paymentType", paymentType); // AC или PC

		document.body.appendChild(f);
		f.submit();
	};

	return (
    <Button
			radius="full"
			size="lg"
			onPress={start}
		>
			{amount} ₽
		</Button>
		// <Button
		// 	radius="full"
		// 	size="lg"
		// 	startContent={
		// 		<Image src="/ym.png" width={20} height={20} radius="none" />
		// 	}
		// 	onPress={start}
		// >
		// 	YooMoney
		// </Button>
	);
}

// 'use client';
// import { Button, Image } from '@heroui/react';

// export default function YoomoneyAuthButtonSimple() {
//   return (
//     <Button
//       radius="full"
//       size="lg"
//       startContent={<Image src="/ym.png" width={20} height={20} radius="none" />}
//       onPress={() => { window.location.href = '/api/yoomoney/start'; }}
//     >
//       YooMoney
//     </Button>
//   );
// }

// 'use client';
// import { Button, Image } from '@heroui/react'
// import React from 'react';

// type Props = {
//   clientId: string;
//   redirectUri: string;     // тот же, что в настройках YooMoney
//   scope: string[] | string;
//   instanceName?: string;
// };

// export default function YoomoneyAuthButton(props: Props) {
//   const startAuth = () => {
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = 'https://yoomoney.ru/oauth/authorize';
//     form.acceptCharset = 'utf-8';

//     // генерим state
//     const bytes = new Uint8Array(16);
//     crypto.getRandomValues(bytes);
//     const state = Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join('');

//     // ставим cookie ym_state (10 минут)
//     const secure = location.protocol === 'https:' ? '; Secure' : '';
//     document.cookie = `ym_state=${encodeURIComponent(state)}; Max-Age=600; Path=/; SameSite=Lax${secure}`;

//     const add = (name: string, value: string) => {
//       const input = document.createElement('input');
//       input.type = 'hidden';
//       input.name = name;
//       input.value = value;
//       form.appendChild(input);
//     };

//     add('client_id', props.clientId);
//     add('response_type', 'code');
//     add('redirect_uri', props.redirectUri);
//     add('scope', Array.isArray(props.scope) ? props.scope.join(' ') : props.scope);
//     if (props.instanceName) add('instance_name', props.instanceName);
//     add('state', state);

//     document.body.appendChild(form);
//     form.submit();
//   };

//   return (
//     <Button
//       radius="full"
//       size="lg"
//       startContent={<Image src="/ym.png" width={20} height={20} radius="none" />}
//       onPress={startAuth}
//     >
//       YooMoney
//     </Button>
//   );
// }
