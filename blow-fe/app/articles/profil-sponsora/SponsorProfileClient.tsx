"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function SponsorProfileClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Профиль спонсора: структура анкеты и этикет
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал для совершеннолетних. Речь о добровольных отношениях формата win-win.
            Мы не описываем и не поощряем интим-услуги.
          </p>

          {/* Структура профиля */}
          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Структура анкеты</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li><strong>О себе:</strong> сфера деятельности, интересы, ритм (офис/командировки).</li>
              <li><strong>Ожидания:</strong> частота встреч, совместные активности, стиль общения.</li>
              <li><strong>Границы и ценности:</strong> уважение приватности, отсутствие давления, «нет» — это ответ.</li>
              <li><strong>Приватность:</strong> правила конфиденциальности, запрет публикации фото/переписок без согласия.</li>
            </ul>
          </section>

          {/* Пример описания */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Пример краткого описания</h2>
            <p className="text-sm sm:text-base">
              «Руководитель проектов в IT, люблю современное искусство и гастрономию, бываю в командировках.
              Ищу интересное общение и совместные активности. 2 встречи в месяц, уважаю личные границы, конфиденциальность
              и честные договорённости.»
            </p>
          </section>

          {/* Частые ошибки */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Частые ошибки</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Высокомерный или требовательный тон в анкете и сообщениях.</li>
              <li>Размытый формат («как получится») вместо конкретики по времени и встречам.</li>
              <li>Отсутствие блока про конфиденциальность и уважение границ.</li>
              <li>Попытка обсуждать финансы до очной встречи и взаимной симпатии.</li>
            </ul>
          </section>

          {/* Этикет и коммуникация */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Этикет переписки и первой встречи</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Пишите персонализированно: отталкивайтесь от интересов в анкете собеседницы.</li>
              <li>Предлагайте публичное место и тайм-бокс 60–90 минут для первой встречи.</li>
              <li>Без предоплат, «залогов» и перевода денег незнакомым людям.</li>
              <li>Фиксируйте ключевые договорённости письменно в чате платформы.</li>
            </ul>
          </section>

          {/* Мини-FAQ */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">FAQ</h2>
            <div className="text-sm sm:text-base space-y-3">
              <p><strong>Что включить в «О себе»?</strong> Коротко: сфера, увлечения, занятость, когда удобны встречи.</p>
              <p><strong>Где уместно обсуждать условия поддержки?</strong> После очной встречи и взаимной симпатии.</p>
              <p><strong>Как подчеркнуть уважение к приватности?</strong> Пропишите это в профиле и соблюдайте договорённости.</p>
            </div>
          </section>

          {/* Перелинковка (по желанию)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/perepiska-scenarii" className="underline hover:text-primary">Переписка: сценарии</NextLink>
              <span>·</span>
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">Первая встреча: чек-лист</NextLink>
              <span>·</span>
              <NextLink href="/poisk-i-filtry" className="underline hover:text-primary">Поиск и фильтры</NextLink>
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
            <NextLink href={ROUTES?.OFFER ?? ROUTES.OFFER} className="underline cursor-pointer hover:text-primary text-nowrap">
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
