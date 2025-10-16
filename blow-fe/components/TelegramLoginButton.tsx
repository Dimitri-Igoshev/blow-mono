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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Один раз задаём callback
    if (!callbackSetRef.current) {
      window.onTelegramAuth = async (user: any) => {
        try {
          const res = await authTelegram(user).unwrap();
          // ⚠️ Убедись, что поле совпадает с ответом бэка: access_token ИЛИ accessToken
          const token = (res as any).access_token ?? (res as any).accessToken;
          if (token) {
            localStorage.setItem("access-token", token);
            dispatch(setToken(token));
          }
          router.replace("/");
        } catch (e) {
          console.error("Telegram auth failed", e);
          alert("Не удалось войти через Telegram");
        }
      };
      callbackSetRef.current = true;
    }

    // Подключаем виджет
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "blow_ru_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-domain", "kutumba.ru");
    scriptRef.current = script;

    const container = containerRef.current ?? document.getElementById("tg-login-container");
    if (container) container.appendChild(script);

    // Функция, делающая iframe на всю ширину
    const applyFullWidth = () => {
      const iframe = (container ?? document).querySelector<HTMLIFrameElement>("#tg-login-container iframe");
      if (iframe) {
        iframe.style.width = "100%";
        iframe.style.maxWidth = "100%";
        iframe.style.display = "block";
        // высоту можно настроить под дизайн
        iframe.style.height = "52px";
        return true;
      }
      return false;
    };

    // Пытаемся применить сразу
    if (!applyFullWidth()) {
      // Если iframe ещё не вставлен — ждём его появление
      const mo = new MutationObserver(() => {
        if (applyFullWidth()) mo.disconnect();
      });
      if (container) mo.observe(container, { childList: true, subtree: true });
    }

    return () => {
      // снимаем скрипт
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      // чистим контейнер
      const el = containerRef.current ?? document.getElementById("tg-login-container");
      if (el) el.innerHTML = "";
    };
  }, [authTelegram, dispatch, router]);

  // Контейнер сам растягиваем на всю ширину
  return (
    <div
      id="tg-login-container"
      ref={containerRef}
      style={{ width: "100%", display: "block" }}
    />
  );
}
