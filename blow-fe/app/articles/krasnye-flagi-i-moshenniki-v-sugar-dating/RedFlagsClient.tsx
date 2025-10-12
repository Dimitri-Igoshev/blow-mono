"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "@/app/routes";

export default function RedFlagsClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Красные флаги и мошенники: как защититься
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал о безопасности. Отношения только
            добровольные, без нарушений закона и правил площадки.
          </p>

          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Поведенческие признаки риска</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Спешка и давление: «давай сразу вне платформы», «привези наличные».</li>
              <li>Скрытность и несостыковки в биографии, отсутствие соцследа.</li>
              <li>Отказ от публичных мест, попытки изоляции.</li>
            </ul>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Типичные схемы мошенничества</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>«Верификационный платёж» и возврат «после встречи».</li>
              <li>Фишинг-ссылки: «верификация аккаунта», «бонусы/кэшбек».</li>
              <li>Подделка чеков и «скриншоты перевода без зачисления».</li>
            </ul>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">План защиты</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Общайтесь только в чате платформы до доверия.</li>
              <li>Включите 2FA, проверяйте входящие письма/ссылки.</li>
              <li>Проверяйте фото через поиск, сравнивайте детали профиля.</li>
              <li>В спорных случаях — жалоба модерации, сохранение переписки.</li>
            </ul>
          </section>

          {/* Перелинковка (опционально)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">Первая встреча</NextLink>
              <span>·</span>
              <NextLink href="/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya" className="underline hover:text-primary">Как обсуждать поддержку</NextLink>
              <span>·</span>
              <NextLink href="/etiket-i-dolgosrochnye-otnosheniya-win-win" className="underline hover:text-primary">Этикет долгосрочных отношений</NextLink>
            </p>
          </nav> */}
        </div>
      </div>

      <footer className="bg-gray dark:bg-black w-full">
        <div className="bg-dark rounded-t-[50px] px-3 sm:px-12 py-[28px] grid grid-cols-1 sm:grid-cols-3 text-white items-center text-xs sm:text-base">
          <div className="sm:hidden flex justify-center">
            <Image alt="BLOW" height={40} radius="none" src="/logo.png" width={101} />
          </div>
          <p className="text-center sm:text-left mt-5 sm:mt-0 text-xs">{year} © BLOW</p>
          <div className="hidden sm:flex justify-center">
            <Image alt="BLOW" height={40} radius="none" src="/logo.png" width={101} />
          </div>
          <div className="text-xs mt-7 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-6">
            <NextLink className="underline cursor-pointer hover:text-primary text-nowrap" href={ROUTES.ARTICLES}>
              Статьи
            </NextLink>
            <NextLink href={ROUTES.CONTACTS} className="underline cursor-pointer hover:text-primary text-nowrap">
              Свяжись с нами
            </NextLink>
            <NextLink href={ROUTES.POLICY} className="underline cursor-pointer hover:text-primary text-nowrap">
              Политики
            </NextLink>
            <NextLink href={ROUTES.OFFER} className="underline cursor-pointer hover:text-primary text-nowrap">
              Договор оферта
            </NextLink>
            <NextLink href={ROUTES.RULES} className="underline cursor-pointer hover:text-primary text-nowrap -mt-2 sm:mt-0">
              Правила
            </NextLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
