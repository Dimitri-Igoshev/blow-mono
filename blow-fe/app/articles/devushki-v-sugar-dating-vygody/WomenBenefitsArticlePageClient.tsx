"use client";

import { ROUTES } from "@/app/routes"
import { Image } from "@heroui/image";
import NextLink from "next/link";

export default function WomenBenefitsArticlePageClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Девушки и формат win-win: в чём выгода и как всё работает
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал для совершеннолетних. Речь о
            добровольных отношениях взрослых людей формата <strong>win-win</strong>.
            Мы не описываем и не поощряем интим-услуги. Всегда учитывайте законы вашей
            страны и правила площадки.
          </p>

          {/* Что это за формат */}
          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Что такое sugar/«содержанка—спонсор» без романтизации
            </h2>
            <p className="text-sm sm:text-base">
              Это договорённые взрослые отношения с заранее оговорёнными
              ожиданиями и границами: совместный досуг, культурные события,
              наставничество, подарки-впечатления и поддержка развития (учёба,
              проекты, поездки). Базовые принципы: прозрачность, добровольность,
              уважение и безопасность.
            </p>
          </section>

          {/* Выгоды для девушек */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              8 ключевых выгод для девушек
            </h2>
            <ol className="list-decimal pl-5 text-sm sm:text-base space-y-2">
              <li>
                <strong>Прозрачные ожидания.</strong> Частота встреч, формат
                активностей и рамки обсуждаются заранее и фиксируются в чате.
              </li>
              <li>
                <strong>Безопасность и контроль.</strong> Общение в чате
                платформы, публичные места для встреч, защита от передачи
                контактов «в лоб».
              </li>
              <li>
                <strong>Менторство и развитие.</strong> Курсы, конференции,
                доступ к сообществам и нетворку — по договорённости.
              </li>
              <li>
                <strong>Подарки-впечатления вместо наличных.</strong> Театр,
                путешествия, SPA, образование — этично и понятнее.
              </li>
              <li>
                <strong>Экономия времени.</strong> Предметное общение и
                понятные ориентиры без игр и «догадок».
              </li>
              <li>
                <strong>Эмоциональная предсказуемость.</strong> Меньше драм —
                больше качественного времени и уважительного отношения.
              </li>
              <li>
                <strong>Конфиденциальность.</strong> Защита персональных
                данных, запрет публикаций без согласия, согласованные правила
                коммуникации.
              </li>
              <li>
                <strong>Право на «нет».</strong> Любой дискомфорт — повод
                остановиться; «нет» — окончательный ответ без объяснений.
              </li>
            </ol>
          </section>

          {/* Пошаговый сценарий */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Как это работает: пошаговый сценарий
            </h2>
            <ol className="list-decimal pl-5 text-sm sm:text-base space-y-2">
              <li>
                <strong>Знакомство в чате платформы.</strong> Без личных
                контактов на старте. Кратко обозначьте интересы и рамки.
              </li>
              <li>
                <strong>Синхронизация ожиданий.</strong> Частота встреч,
                активности (ужины, театры, конференции, поездки), безопасные
                форматы поддержки (обучение, билеты, travel).
              </li>
              <li>
                <strong>Первая встреча — публично, 60–90 минут.</strong>{" "}
                Проверка совместимости и «химии».
              </li>
              <li>
                <strong>Фиксация договорённостей в чате.</strong> Кратко по
                пунктам: график, активности, поддержка, границы,
                конфиденциальность.
              </li>
              <li>
                <strong>Регулярная сверка.</strong> Раз в 2–4 недели обсудите,
                что сохранить, что улучшить.
              </li>
            </ol>
          </section>

          {/* Безопасность */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Безопасность</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>
                Общайтесь в чате платформы, не делитесь адресом/документами и
                реквизитами.
              </li>
              <li>
                Всегда встречайтесь в публичных местах, сообщайте близкому
                человеку место и время.
              </li>
              <li>
                Отключайте геометки у фото, не публикуйте маршрут в реальном
                времени.
              </li>
              <li>
                Любые попытки давления — сигнал завершить общение и написать в
                модерацию.
              </li>
            </ul>
          </section>

          {/* Этичные форматы поддержки */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Этичные форматы поддержки
            </h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>
                <strong>Образование:</strong> курсы, мастер-классы,
                конференции.
              </li>
              <li>
                <strong>Культурные события:</strong> театр, выставки, концерты.
              </li>
              <li>
                <strong>Путешествия:</strong> совместные поездки с прозрачным
                бюджетом.
              </li>
              <li>
                <strong>Наставничество и проекты:</strong> карьерные советы,
                доступ к сообществам и нетворку.
              </li>
              <li>
                <strong>Подарки-впечатления:</strong> SPA-дни, гастрономические
                туры.
              </li>
            </ul>
          </section>

          {/* Мини-скрипты */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Мини-скрипты: как говорить без неловкости
            </h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>
                <strong>Старт:</strong> «Мне близок формат совместных культурных
                мероприятий и развития. Комфортно встречаться 1–2 раза в
                неделю».
              </li>
              <li>
                <strong>Про поддержку:</strong> «Предпочитаю обучение и
                впечатления. Наличные/переводы не рассматриваю».
              </li>
              <li>
                <strong>Про границы:</strong> «Для меня важны конфиденциальность
                и уважение «нет».»
              </li>
              <li>
                <strong>Про сверку:</strong> «Давайте раз в месяц коротко
                сверяться: что оставить, что изменить».
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">FAQ</h2>
            <details className="text-sm sm:text-base">
              <summary className="font-medium">Это законно и этично?</summary>
              <p className="mt-2">
                Отношения взрослых по взаимному согласию законны. Запрещены
                интим-услуги. Следуйте правилам площадки и законам вашей страны.
              </p>
            </details>
            <details className="text-sm sm:text-base">
              <summary className="font-medium">
                Как понять, что формат мне подходит?
              </summary>
              <p className="mt-2">
                Если вам комфортны прозрачные договорённости, культурные и
                образовательные активности и уважение границ — вероятно, да.
              </p>
            </details>
            <details className="text-sm sm:text-base">
              <summary className="font-medium">
                Что делать, если ожидания не совпали?
              </summary>
              <p className="mt-2">
                Обсудить и скорректировать или корректно завершить общение.
                Любое «нет» — окончательно.
              </p>
            </details>
          </section>

          {/* Перелинковка (если нужна) */}
          {/* <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">
                Правила первой встречи
              </NextLink>
              <span>·</span>
              <NextLink href="/perepiska-scenarii" className="underline hover:text-primary">
                Переписка: сценарии
              </NextLink>
              <span>·</span>
              <NextLink href="/antifrod" className="underline hover:text-primary">
                Антифрод-гайд
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
