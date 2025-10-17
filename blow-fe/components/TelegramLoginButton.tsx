"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTelegramAuthMutation } from "@/redux/services/authApi";
import { setToken } from "@/redux/features/authSlice";
import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@heroui/button";
import { InfoModal } from "./InfoModal";
import { useDisclosure } from "@heroui/react";

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

export default function TelegramLoginButton({
	login = false,
	registration = false,
	add = false,
	newUser,
}: {
	login?: boolean;
	registration?: boolean;
	add?: boolean;
	newUser?: any;
}) {
	const [authTelegram] = useTelegramAuthMutation();
	const router = useRouter();
	const dispatch = useDispatch();
	const scriptLoadedRef = useRef(false);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

	const [user, setUser] = useState();

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
					if (login) data.type = "login";
          if (registration) {
            data.type = "registration";
            data.newUser = newUser;
          }
					if (add) {
						data.type = "add"
						data.newUser = newUser;
					}
					try {
						const res = await authTelegram(data).unwrap();
						const token = (res as any).access_token ?? (res as any).accessToken;
						if (token) {
							localStorage.setItem("access-token", token);
							dispatch(setToken(token));
							window.location.reload();
						} else {
							onOpen();
						}
					} catch (e) {
						console.error("Telegram auth failed", e);
					}
				}
			);
		};

		tryAuth();
	}, [authTelegram, dispatch, router]);

	// Пример с твоей кнопкой: className="w-full" даёт ширину 100%
	return (
		<>
			<Button
				className="w-full"
				color="primary"
				radius="full"
				onPress={handleClick}
				startContent={<FaTelegramPlane size={20} />}
			>
				{add ? "Добавить Telegram" : "Войти через Telegram"}
			</Button>

			<InfoModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onOpenChange}
				title="Ошибка"
				text="Вы не зарегистрированы на сайте, либо телеграм не добавлен в вашем профиле"
			/>
		</>
	);
}
