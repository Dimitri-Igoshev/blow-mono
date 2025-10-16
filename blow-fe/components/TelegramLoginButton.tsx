"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTelegramAuthMutation } from "@/redux/services/authApi";
import { setToken } from "@/redux/features/authSlice";

declare global {
	interface Window {
		onTelegramAuth?: (user: any) => void;
	}
}

export default function TelegramLoginButton() {
	const [authTelegram] = useTelegramAuthMutation();
	const router = useRouter();
	const dispatch = useDispatch();

	const callbackSetRef = useRef(false);
	const scriptRef = useRef<HTMLScriptElement | null>(null);

	useEffect(() => {
		// Один раз задаём callback
		if (!callbackSetRef.current) {
			window.onTelegramAuth = async (user: any) => {
				console.log("user", user);
				await authTelegram(user)
					.unwrap()
					.then((res) => {
						console.log(res);
						localStorage.setItem("access-token", res.accessToken);
						window.location.reload();
					})
					.catch((err) => console.log(err));
			};
			callbackSetRef.current = true;
		}

		// Подключаем виджет
		const script = document.createElement("script");
		script.async = true;
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.setAttribute("data-telegram-login", "blow_ru_bot"); // твой бот
		script.setAttribute("data-size", "large");
		script.setAttribute("data-userpic", "true");
		script.setAttribute("data-request-access", "write"); // опционально
		script.setAttribute("data-onauth", "onTelegramAuth(user)");
		script.setAttribute("data-domain", "kutumba.ru"); // ограничиваем домен
		scriptRef.current = script;

		const container = document.getElementById("tg-login-container");
		if (container) container.appendChild(script);

		return () => {
			// снимаем скрипт
			if (scriptRef.current && scriptRef.current.parentNode) {
				scriptRef.current.parentNode.removeChild(scriptRef.current);
				scriptRef.current = null;
			}
			// чистим контейнер
			const el = document.getElementById("tg-login-container");
			if (el) el.innerHTML = "";
		};
	}, [authTelegram, dispatch, router]);

	return <div id="tg-login-container" />;
}
