"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function SupportTalkClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Как обсуждать поддержку: деньги, подарки и менторство без неловкости
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Добровольные взрослые отношения формата win-win.
            Избегайте незаконных формулировок и двусмысленностей.
          </p>

          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Рамка «цели → формат → правила»</h2>
            <p className="text-sm sm:text-base">
              Начинайте с целей (обучение, культурные проекты), затем формат (частота встреч, активности),
              завершайте правилами (границы, конфиденциальность).
            </p>
          </section>

          <section className="space-y-3 mt-2">
            <h3 className="text-lg sm:text-xl font-semibold">Этичные формулировки</h3>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Обучение: «курс UX/английского», «конференция по маркетингу».</li>
              <li>Культура: «театр/выставки/концерты».</li>
              <li>Путешествия: «поездка с прозрачным бюджетом».</li>
              <li>Наставничество: «встречи 1–2 раза/нед, помощь в проектах».</li>
            </ul>
          </section>

          <section className="space-y-3 mt-2">
            <h3 className="text-lg sm:text-xl font-semibold">Шаблоны реплик</h3>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>«Мне важны развитие и культурные поездки. Комфортно встречаться 1–2 раза в неделю».</li>
              <li>«Поддержка в формате обучения и ивентов — идеальна. Наличные/переводы не рассматриваю».</li>
              <li>«Фиксируем договорённости в чате и раз в месяц сверяемся».</li>
            </ul>
          </section>

          <section className="space-y-3 mt-2">
            <h3 className="text-lg sm:text-xl font-semibold">Фиксация договорённостей</h3>
            <p className="text-sm sm:text-base">
              Кратко перечислите: частота встреч, тип активностей, форматы поддержки, границы, конфиденциальность.
              Сверка раз в 2–4 недели.
            </p>
          </section>

          {/* Перелинковка (по желанию)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">Первая встреча</NextLink>
              <span>·</span>
              <NextLink href="/antifrod" className="underline hover:text-primary">Красные флаги</NextLink>
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
