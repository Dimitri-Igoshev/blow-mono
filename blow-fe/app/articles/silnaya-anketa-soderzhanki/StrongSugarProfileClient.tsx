"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function StrongSugarProfileClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Сильная анкета содержанки: шаблоны и анти-ошибки
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал для совершеннолетних. Речь о добровольных отношениях формата win-win.
            Мы не описываем и не поощряем интим-услуги.
          </p>

          {/* Фото */}
          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Фото, которые работают</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>3–5 естественных кадров: портрет, в полный рост, lifestyle.</li>
              <li>Дневной свет, нейтральный фон, минимальная обработка.</li>
              <li>Без стоковых фильтров, водяных знаков и посторонних людей.</li>
              <li>Следите за метаданными: отключите геометки перед загрузкой.</li>
            </ul>
          </section>

          {/* Описание */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Описание в 3 блоках (шаблон)</h2>
            <ol className="list-decimal pl-5 text-sm sm:text-base space-y-2">
              <li>
                <strong>О себе (2–3 предложения):</strong> чем занимаетесь, ритм жизни, интересы.
              </li>
              <li>
                <strong>Формат общения:</strong> частота встреч, совместные активности, стиль общения.
              </li>
              <li>
                <strong>Границы и ценности:</strong> что комфортно/некомфортно, уважение приватности.
              </li>
            </ol>
            <p className="text-sm sm:text-base">
              Пример: «Студентка урбанистики, люблю музеи и книги про города. Ищу взрослого собеседника для выставок и
              прогулок. 2–3 встречи в месяц, ценю честность, такт и договорённости».
            </p>
          </section>

          {/* Анти-ошибки */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Анти-ошибки</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Клише («милая, нежная»), пустые общие фразы вместо фактов.</li>
              <li>Перегруз фильтрами и ретушью — падает доверие.</li>
              <li>Размытые ожидания, отсутствие границ и расписания.</li>
              <li>Агрессивный/требовательный тон в анкете или переписке.</li>
            </ul>
          </section>

          {/* Чек-лист */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Чек-лист перед публикацией</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>3–5 естественных фото (портрет, рост, lifestyle).</li>
              <li>Био из 2–3 предложений по фактам.</li>
              <li>Чёткие ожидания и границы (включая частоту встреч).</li>
              <li>Пройдена верификация профиля на платформе.</li>
            </ul>
          </section>

          {/* Перелинковка (по желанию)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/kak-najti-sponsora-dlya-devushek" className="underline hover:text-primary">
                Как найти спонсора
              </NextLink>
              <span>·</span>
              <NextLink href="/perepiska-scenarii" className="underline hover:text-primary">
                Переписка: сценарии
              </NextLink>
              <span>·</span>
              <NextLink href="/poisk-i-filtry" className="underline hover:text-primary">
                Поиск и фильтры
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
