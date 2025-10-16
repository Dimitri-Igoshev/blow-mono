"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTelegramAuthMutation } from "@/redux/services/authApi";
import { setToken } from "@/redux/features/authSlice";
import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@heroui/button";

declare global {
	interface Window {
		Telegram?: {
			Login: {
				auth: (
					opts: { bot_id: number | string; request_access?: "write" | "read" },
					cb: (data: any | false) => void
				) => void;
			};
		};
	}
}

const BOT_ID = 8254626529; // число до двоеточия из твоего bot_token

export default function TelegramLoginButton() {
	const [authTelegram] = useTelegramAuthMutation();
	const router = useRouter();
	const dispatch = useDispatch();
	const scriptLoadedRef = useRef(false);

	// грузим telegram-widget.js ОДИН РАЗ, без data-* (чтобы он не вставлял свою кнопку)
	useEffect(() => {
		if (scriptLoadedRef.current) return;

		const script = document.createElement("script");
		script.async = true;
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.onload = () => {
			scriptLoadedRef.current = true;
		};
		document.body.appendChild(script);

		return () => {
			// не обязательно удалять, но можно
			// script.remove();
		};
	}, []);

  const [user, setUser] = useState()

	const handleClick = useCallback(() => {
		const tryAuth = () => {
			if (!window.Telegram?.Login?.auth) {
				// скрипт ещё не готов — небольшой ретрай
				setTimeout(tryAuth, 120);
				return;
			}
			window.Telegram.Login.auth(
				{ bot_id: BOT_ID, request_access: "write" },
				async (data) => {
					if (!data) return; // пользователь отменил
					try {
						const res = await authTelegram(data).unwrap();
						const token = (res as any).access_token ?? (res as any).accessToken;
						if (token) {
							localStorage.setItem("access-token", token);
							dispatch(setToken(token));
						}
						window.location.reload(); // в корень
					} catch (e) {
						console.error("Telegram auth failed", e);
						alert("Не удалось войти через Telegram");
					}
				}
			);
		};

		tryAuth();
	}, [authTelegram, dispatch, router]);

	// Пример с твоей кнопкой: className="w-full" даёт ширину 100%
	return (
		<Button
			className="w-full"
			color="primary"
			radius="full"
			onPress={handleClick}
			startContent={<FaTelegramPlane size={20} />}
		>
			Войти через Telegram
		</Button>
	);
}
