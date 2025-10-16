// app/(auth)/login/TelegramLoginButton.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useTelegramAuthMutation } from '@/redux/services/authApi'
import { setToken } from '@/redux/features/authSlice'

declare global {
  interface Window {
    TelegramLoginWidget?: any;
    onTelegramAuth?: (user: any) => void;
  }
}

export default function TelegramLoginButton() {
  const [authTelegram] = useTelegramAuthMutation();
  const router = useRouter();
  const dispatched = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // создаём callback один раз
    if (!dispatched.current) {
      window.onTelegramAuth = async (user: any) => {
        try {
          const res = await authTelegram(user).unwrap();
          dispatch(setToken(res.access_token));
          router.replace('/'); // в корень сайта
        } catch (e) {
          console.error('Telegram auth failed', e);
          alert('Не удалось войти через Telegram');
        }
      };
      dispatched.current = true;
    }

    // подключаем виджет
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'blow_ru_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write'); // опционально
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    // Ограничим домены
    script.setAttribute('data-domain', 'kutumba.ru');
    document.getElementById('tg-login-container')?.appendChild(script);

    return () => {
      // @ts-ignore
      document.getElementById('tg-login-container')?.innerHTML = '';
    };
  }, [authTelegram, dispatch, router]);

  return <div id="tg-login-container" />;
}
