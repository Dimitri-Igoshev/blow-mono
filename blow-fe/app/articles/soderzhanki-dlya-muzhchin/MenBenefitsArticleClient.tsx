"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function MenBenefitsArticleClient() {
  const year = new Date().getFullYear();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "В чём выгода формата для мужчин?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Главные плюсы — прозрачность ожиданий, экономия времени, эмоциональный комфорт, имидж и возможность наставничества. Формат строится на добровольности, уважении границ и конфиденциальности.",
        },
      },
      {
        "@type": "Question",
        name: "Как обсуждать поддержку этично?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Ставьте цели и форматы: обучение, культурные мероприятия, путешествия, наставничество. Фиксируйте договорённости в чате платформы, избегайте двусмысленностей и незаконных условий.",
        },
      },
      {
        "@type": "Question",
        name: "Как снизить риски?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Используйте верифицированную платформу, встречайтесь в публичных местах, не делитесь личными контактами и финансовыми данными, сообщайте о нарушениях модерации. Любое «нет» — окончательный ответ.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* JSON-LD (вне <Head>, чтобы layout не перезаписывал) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <h1 className="text-[28px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
          Содержанки: в чём выгода для мужчин и как работает этот подход
        </h1>

        <p className="text-sm sm:text-base mt-4">
          <strong>18+</strong> Материал для совершеннолетних. Речь о
          добровольных отношениях взрослых людей формата <strong>win-win</strong>{" "}
          (взаимная выгода). Мы не описываем и не поощряем интим-услуги. Всегда
          учитывайте законы вашей страны и правила площадки.
        </p>

        {/* Что это за формат */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Что это за формат простыми словами</h2>
          <p className="text-sm sm:text-base">
            <strong>«Содержанка — спонсор»</strong> — это договорённые взрослые
            отношения, где роли и ожидания обсуждаются заранее: совместный
            досуг, наставничество, участие в культурных и деловых активностях,
            подарки-впечатления, помощь в обучении/развитии.
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
            <li><strong>Прозрачность:</strong> ожидания, границы, периодичность встреч зафиксированы в чате платформы.</li>
            <li><strong>Взаимная выгода:</strong> обе стороны получают ценность — внимание, опыт, эмоции, поддержку.</li>
            <li><strong>Добровольность и уважение:</strong> никаких скрытых условий и давления.</li>
            <li><strong>Безопасность:</strong> защита персональных данных и конфиденциальность.</li>
          </ul>
        </section>

        {/* Выгоды */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">7 ключевых выгод для мужчин</h2>
          <ol className="list-decimal pl-5 text-sm sm:text-base space-y-2">
            <li><strong>Прозрачность без «игр».</strong> Меньше недопониманий.</li>
            <li><strong>Экономия времени.</strong> Быстрый переход к совместным активностям.</li>
            <li><strong>Партнёрство для впечатлений и статуса.</strong> Ивенты, travel, светский формат.</li>
            <li><strong>Эмоциональный комфорт.</strong> Понятные рамки и предсказуемость.</li>
            <li><strong>Наставничество.</strong> Делитесь опытом и нетворком по договорённости.</li>
            <li><strong>Контроль рисков.</strong> Верификация, модерация, чёрные списки.</li>
            <li><strong>Фокус на развитии, а не «деньгах в руки».</strong> Подарки-впечатления, образование, поездки.</li>
          </ol>
        </section>

        {/* Пошаговый сценарий */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Как это работает: пошаговый сценарий win-win</h2>
          <ol className="list-decimal pl-5 text-sm sm:text-base space-y-2">
            <li><strong>Знакомство в чате платформы.</strong> Без личных контактов на старте.</li>
            <li><strong>Синхронизация ожиданий.</strong> Частота, активности, комфортные форматы поддержки.</li>
            <li><strong>Первая встреча в публичном месте.</strong> 60–90 минут для проверки совместимости.</li>
            <li><strong>Фиксация договорённостей в чате.</strong> График, ивенты, подарки-впечатления, границы.</li>
            <li><strong>Регулярная обратная связь.</strong> Раз в 2–4 недели.</li>
          </ol>
        </section>

        {/* Сравнение */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Чем формат отличается от обычных свиданий</h2>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2 pr-4">Критерий</th>
                  <th className="border-b py-2 pr-4">Обычные свидания</th>
                  <th className="border-b py-2">Win-win</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b py-2 pr-4">Формулировка ожиданий</td>
                  <td className="border-b py-2 pr-4">Часто неявная</td>
                  <td className="border-b py-2"><strong>Явная и в чате</strong></td>
                </tr>
                <tr>
                  <td className="border-b py-2 pr-4">Частота встреч</td>
                  <td className="border-b py-2 pr-4">Стихийно</td>
                  <td className="border-b py-2"><strong>Оговорена (1–2 раза/нед)</strong></td>
                </tr>
                <tr>
                  <td className="border-b py-2 pr-4">Поддержка</td>
                  <td className="border-b py-2 pr-4">Не обсуждается</td>
                  <td className="border-b py-2"><strong>Обсуждается: курсы, ивенты, поездки</strong></td>
                </tr>
                <tr>
                  <td className="border-b py-2 pr-4">Границы</td>
                  <td className="border-b py-2 pr-4">Постепенно</td>
                  <td className="border-b py-2"><strong>Фиксируются заранее</strong></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Риски</td>
                  <td className="py-2 pr-4">Непредсказуемость</td>
                  <td className="py-2"><strong>Прозрачность и предсказуемость</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Риски */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Риски и как их снижать</h2>
          <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
            <li><strong>Манипуляции и давление.</strong> Спешка, ультиматумы — повод завершить общение и жаловаться модерации.</li>
            <li><strong>Утечка данных.</strong> Не делитесь адресами, документами, реквизитами.</li>
            <li><strong>Юридические риски.</strong> Избегайте формулировок, похожих на интим-услуги.</li>
            <li><strong>Финансовые схемы.</strong> «Верификационный платёж», «переведи и верну» — сразу в бан.</li>
          </ul>
        </section>

        {/* Этичные форматы поддержки */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Этичные форматы поддержки (примеры)</h2>
          <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
            <li><strong>Образование:</strong> курсы, мастер-классы, конференции.</li>
            <li><strong>Культура:</strong> билеты в театр, выставки, концерты.</li>
            <li><strong>Путешествия:</strong> совместные трипы с прозрачным бюджетом.</li>
            <li><strong>Проекты:</strong> наставничество, нетворк, сообщества.</li>
            <li><strong>Подарки-впечатления:</strong> SPA-дни, гастрономические туры.</li>
          </ul>
        </section>

        {/* Скрипты */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Мини-скрипты для разговора</h2>
          <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
            <li><strong>Старт:</strong> «Мне важны совместные культурные мероприятия и развитие. Комфортно 1–2 раза в неделю».</li>
            <li><strong>Поддержка:</strong> «Готов рассмотреть обучение/ивенты/путешествия. Без наличных и переводов».</li>
            <li><strong>Границы:</strong> «Уважение границ и конфиденциальность обязательны. Любое “нет” — ок».</li>
            <li><strong>Пересмотр:</strong> «Давайте раз в месяц сверяться: что оставить, что поменять».</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">FAQ</h2>
          <details className="text-sm sm:text-base">
            <summary className="font-medium">Это законно?</summary>
            <p className="mt-2">
              Отношения взрослых по взаимному согласию законны. Запрещены интим-услуги. Учитывайте местные законы и правила платформы.
            </p>
          </details>
          <details className="text-sm sm:text-base">
            <summary className="font-medium">Главная выгода для мужчины?</summary>
            <p className="mt-2">Прозрачные ожидания и экономия времени: больше качественного времени и впечатлений.</p>
          </details>
          <details className="text-sm sm:text-base">
            <summary className="font-medium">Деньги или подарки?</summary>
            <p className="mt-2">Этичнее — подарки-впечатления и образование. Прямые переводы несут риски.</p>
          </details>
          <details className="text-sm sm:text-base">
            <summary className="font-medium">Как защитить конфиденциальность?</summary>
            <p className="mt-2">Общайтесь в чате платформы, не делитесь личными контактами до доверия, не публикуйте фото без согласия.</p>
          </details>
        </section>
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
