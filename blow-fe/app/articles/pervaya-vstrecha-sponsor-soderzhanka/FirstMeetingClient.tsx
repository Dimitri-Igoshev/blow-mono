"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function FirstMeetingClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Правила первой встречи: безопасность и сценарий
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал для совершеннолетних. Речь о добровольных отношениях формата win-win.
            Мы не описываем и не поощряем интим-услуги.
          </p>

          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Подготовка</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Подтвердите детали встречи в чате платформы (время, место, продолжительность).</li>
              <li>Сообщите близкому человеку, где вы будете, и договоритесь о «контрольном звонке».</li>
              <li>Приезжайте и уезжайте самостоятельно; не делитесь адресом проживания/работы.</li>
            </ul>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Локация и тайм-бокс</h2>
            <p className="text-sm sm:text-base">
              Выбирайте публичные и светлые места: кафе, лобби-бар отеля, галерея.
              Оптимальный тайм-бокс — <strong>60–90 минут</strong>, чтобы легко завершить встречу без неловкости.
            </p>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Темы для разговора</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Интересы, культурные предпочтения, расписание.</li>
              <li>Ожидания от формата: частота встреч, совместные активности.</li>
              <li>Границы и конфиденциальность: что комфортно, что — нет.</li>
            </ul>
          </section>

          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Финансовая часть</h2>
            <p className="text-sm sm:text-base">
              На первом этапе избегайте наличных и переводов. Уместнее говорить о <strong>подарках-впечатлениях</strong> и обучении
              как о легальных и этичных форматах поддержки.
            </p>
          </section>

          <section className="space-y-3 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Чек-лист безопасности</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Геометки в фото отключены, маршруты не публикуются.</li>
              <li>Документы/пропуска не показывать; личные контакты не передавать.</li>
              <li>Любое «нет» — окончательный ответ. Давление — повод завершить встречу.</li>
            </ul>
          </section>

          {/* Перелинковка (опционально)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya" className="underline hover:text-primary">
                Как обсуждать поддержку
              </NextLink>
              <span>·</span>
              <NextLink href="/krasnye-flagi-i-moshenniki-v-sugar-dating" className="underline hover:text-primary">
                Красные флаги и мошенники
              </NextLink>
              <span>·</span>
              <NextLink href="/etiket-i-dolgosrochnye-otnosheniya-win-win" className="underline hover:text-primary">
                Этикет долгосрочных отношений
              </NextLink>
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
