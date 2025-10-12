"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function EtiquetteLongtermClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Этикет долгосрочных отношений: как не «сгореть» и развиваться вместе
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Только добровольные отношения взрослых людей.
            Уважение границ и конфиденциальность — базовые правила.
          </p>

          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Роли и ожидания</h2>
            <p className="text-sm sm:text-base">
              Определите, кто планирует встречи, бронирует билеты/курсы, как согласуются расписания и бюджет.
              Пересматривайте роли раз в месяц.
            </p>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Обратная связь по методу SBI</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li><strong>Situation:</strong> какая ситуация.</li>
              <li><strong>Behavior:</strong> какое поведение.</li>
              <li><strong>Impact:</strong> как это повлияло. Далее — договориться, что меняем.</li>
            </ul>
            <p className="text-sm sm:text-base">Делайте короткие ретро-сессии раз в 2–4 недели.</p>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Баланс и границы</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Дни без контакта, «право на тишину».</li>
              <li>Лимиты времени и энергии, планирование отпуска/пауз.</li>
              <li>Чёткие сигналы дискомфорта и безопасное слово «стоп».</li>
            </ul>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Конфиденциальность</h2>
            <p className="text-sm sm:text-base">
              Не публикуйте совместные фото/истории без согласия; проверяйте метаданные изображений.
              Доступ к общим папкам/календарям — по согласию.
            </p>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Корректное завершение</h2>
            <p className="text-sm sm:text-base">
              Если формат перестал подходить — честно проговорите причины, поблагодарите за время и опыт,
              при желании оставьте дверь открытой для будущих проектов.
            </p>
          </section>

          {/* Перелинковка (по желанию) */}
          {/* <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">Первая встреча</NextLink>
              <span>·</span>
              <NextLink href="/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya" className="underline hover:text-primary">Как обсуждать поддержку</NextLink>
              <span>·</span>
              <NextLink href="/antifrod" className="underline hover:text-primary">Красные флаги и мошенники</NextLink>
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
