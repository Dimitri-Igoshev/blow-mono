"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../../routes";

export default function MessagingScenariosClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
        <div className="w-full">
          <h1 className="text-[26px] sm:text-[36px] leading-tight font-semibold mt-3 sm:mt-9">
            Переписка, которая приводит к встрече: сценарии и анти-фразы
          </h1>

          <p className="text-sm sm:text-base mt-4">
            <strong>18+</strong> Материал для совершеннолетних. Речь о добровольных отношениях формата win-win.
            Мы не описываем и не поощряем интим-услуги.
          </p>

          {/* Сценарии сообщений */}
          <section className="space-y-4 mt-9">
            <h2 className="text-xl sm:text-2xl font-semibold">Сценарии первых сообщений</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>
                <strong>Содержанка → спонсору.</strong> Персонализируйте: оттолкнитесь от интереса в профиле.
                Коротко о себе + 1–2 вопроса + нейтральное предложение:
                <br />
                «Здравствуйте! Увидела у вас интерес к современным выставкам. Я учусь на дизайнера и часто бываю в галереях.
                Удобно ли встретиться в выходные на новой экспозиции?»
              </li>
              <li>
                <strong>Спонсор → содержанке.</strong> Уважительный тон, конкретика и безопасность:
                <br />
                «Здравствуйте! Обратил внимание, что вы любите пешие маршруты. Я тоже. Свободны ли в субботу днём на кофе
                в лобби-кафе? Предлагаю 60–90 минут.»
              </li>
              <li>
                <strong>Если мало времени у собеседника:</strong> «Могу предложить короткое знакомство на 45 минут
                в [публичное место] в будни вечером. Подойдёт?»
              </li>
            </ul>
          </section>

          {/* Структура диалога */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Структура короткого диалога</h2>
            <ol className="list-decimal pl-5 text-sm sm:text-base space-y-2">
              <li><strong>Приветствие + персонализация</strong> (интерес/деталь профиля).</li>
              <li><strong>Кто вы</strong> (1–2 факта) и что предлагаете.</li>
              <li><strong>1–2 вопроса</strong> для вовлечения.</li>
              <li><strong>Конкретное предложение</strong> места/даты/тайм-бокса.</li>
            </ol>
          </section>

          {/* Анти-фразы */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Анти-фразы (лучше избегать)</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>«Дай номер/адрес сразу» — переходите к обмену контактами после согласования встречи.</li>
              <li>Давление и ультиматумы, агрессивная настойчивость.</li>
              <li>Любые «предоплаты», «залог за встречу» и переводы третьим лицам.</li>
              <li>Сбор документов и персональных данных в переписке.</li>
            </ul>
          </section>

          {/* Переход к офлайн-встрече */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Как мягко перейти к офлайн-встрече</h2>
            <p className="text-sm sm:text-base">
              Предложите <strong>публичное место</strong> и <strong>тайм-бокс 60–90 минут</strong>. За 2–3 часа до встречи
              отправьте короткое подтверждение в чате. Если планы меняются — предупредите заранее и предложите альтернативу.
            </p>
            <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
              <li>Фиксируйте договорённости письменно в чате платформы.</li>
              <li>Не обсуждайте финансовые детали до очной взаимной симпатии.</li>
              <li>Всегда уважайте ответ «нет» и границы собеседника.</li>
            </ul>
          </section>

          {/* Мини-FAQ */}
          <section className="space-y-4 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold">FAQ</h2>
            <div className="text-sm sm:text-base space-y-3">
              <p>
                <strong>Через сколько сообщений предлагать встречу?</strong> Часто достаточно 5–10 реплик, если есть явный
                взаимный интерес и комфорт.
              </p>
              <p>
                <strong>Что делать, если нет ответа?</strong> Одно вежливое напоминание через 24–48 часов — и дальше без
                навязчивости.
              </p>
              <p>
                <strong>Можно ли сразу обменяться телефонами?</strong> Лучше после согласования публичной встречи и при
                взаимном согласии.
              </p>
            </div>
          </section>

          {/* Перелинковка (по желанию)
          <nav aria-label="Внутренние ссылки" className="text-sm sm:text-base mt-6">
            <p className="flex flex-wrap gap-3">
              <NextLink href="/poisk-i-filtry" className="underline hover:text-primary">Поиск и фильтры</NextLink>
              <span>·</span>
              <NextLink href="/pervaya-vstrecha-checklist" className="underline hover:text-primary">Первая встреча: чек-лист</NextLink>
              <span>·</span>
              <NextLink href="/silnaya-anketa-soderzhanki" className="underline hover:text-primary">Сильная анкета содержанки</NextLink>
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
