"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function MoscowRfRulesClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Москва и РФ: правила, безопасность и различия формата
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал для совершеннолетних. Речь о добровольных отношениях формата win-win. Мы не
            описываем и не поощряем интим-услуги.
          </p>

          {/* Контекст */}
          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Контекст городов</h2>
            <p className="text-sm sm:text-base">
              В мегаполисах (Москва, СПб) выше плотность анкет и конкуренция, больше культурных активностей и гибких
              расписаний. В регионах чаще важна гибкость формата: реже, но дольше встречи; больше онлайн-общения и
              предварительных договорённостей в чате.
            </p>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Используйте фильтры по городу и интересам, сохраняйте поиски.</li>
              <li>Подстраивайте частоту встреч под реальный график и транспортную доступность.</li>
              <li>Учитывайте локальные особенности: время суток, популярные публичные пространства.</li>
            </ul>
          </section>

          {/* Этикет */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Этикет и коммуникация</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Честно озвучивайте ожидания и уважайте «нет» как окончательный ответ.</li>
              <li>Не раскрывайте чужих персональных данных и не публикуйте фото без явного согласия.</li>
              <li>Согласовывайте место, дату, длительность и формат общения заранее в чате платформы.</li>
            </ul>
          </section>

          {/* Финансовые договорённости корректно */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Финансовые разговоры корректно</h2>
            <p className="text-sm sm:text-base">
              Обсуждайте рамки поддержки после взаимной симпатии и первой очной встречи. Избегайте любых предоплат,
              «залогов» и переводов третьим лицам. Уместнее говорить о подарках-впечатлениях, образовании и совместном
              досуге как о легальных и этичных форматах поддержки.
            </p>
          </section>

          {/* Безопасность на практике */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Практическая безопасность</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Первая встреча — в людном месте; сообщите близким маршрут и время.</li>
              <li>Добирайтесь самостоятельно; не передавайте адрес проживания и документы.</li>
              <li>Не отправляйте интим-контент и не делитесь финансовыми данными.</li>
              <li>При давлении или нарушениях — используйте жалобы и чёрный список.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">FAQ</h2>
            <div className="text-sm sm:text-base space-y-3">
              <p>
                <strong>Чем отличается подход в Москве и регионах?</strong> В Москве и СПб отклик выше и быстрее, но и
                конкуренция больше. В регионах важнее гибкий график и подробные договорённости заранее.
              </p>
              <p>
                <strong>Когда обсуждать рамки поддержки?</strong> После очного знакомства и взаимной симпатии, без
                предоплат и «залогов».
              </p>
              <p>
                <strong>Как сохранить приватность?</strong> Настройте видимость фото, не делитесь адресом/документами,
                ведите ключевые договорённости в чате платформы.
              </p>
            </div>
          </section>

          {/* Перелинковка (по желанию)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">
                Первая встреча: чек-лист
              </NextLink>
              <span>·</span>
              <NextLink href="/yuridicheskie-eticheskie-aspekty" className="underline hover:text-primary">
                Юридические и этические нюансы
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
