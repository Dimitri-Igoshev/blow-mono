// LayoutPageList.tsx
// Это лейаут страницы отображения сущностей, с фильтром, поиском, крошками, кнопкой и пр.
// В него должны передаваться тип отображения: таблица, карточки плиткой или списком и пр.
// Он должен на основе данных отрисовывать тот или иной фильтр и ту или иную таблицу

import { useEffect, useRef, useState, type FC } from "react";
import type { ViewType } from "@/type/layout.types";
import type { EntityType } from "@/type/entity.types";

import { WidgetListTop } from "@/widgets/WidgetListTop";
import { WidgetListListCard } from "@/widgets/WidgetListListCard";
import { getMappedItem } from "@/helper/getMappedItem";
import { ModalWithInput } from "@/modals/ModalWidthInput";
import { WidgetUserCard } from "@/widgets/WidgetUserCard";
import { formatRubleWithThousands } from "@/helper/formatedRubleWithThousands";
import { useEntityData } from "@/hooks/useEntityData";
import { useEntityActions } from "@/hooks/useEntityActions";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ModalPricing } from "@/modals/ModalPricing";

interface LayoutPageListProps {
  entity: EntityType;
  viewType: ViewType;
  sessionData?: any[];
  userData?: any[];       // <- приходящая «первая N» от сервера
  cityData?: any[];
  claimData?: any[];
  mailingData?: any[];
  messageData?: any[];
  serviceData?: any[];
  transactionData?: any[];
  topupData?: any[];
  withdrawalData?: any[];
  saleData?: any[];
  isFetching?: boolean;
  setSearch?: (search: string) => void;
  setFilters?: (filters: any) => void; // ожидается, что тут есть/будет limit
}

export const LayoutPageList: FC<LayoutPageListProps> = ({
  entity,
  viewType,
  sessionData = [],
  userData = [],
  cityData = [],
  claimData = [],
  mailingData = [],
  messageData = [],
  serviceData = [],
  transactionData = [],
  topupData = [],
  withdrawalData = [],
  saleData = [],
  isFetching = false,
  setSearch = () => null,
  setFilters = () => null,
}) => {
  // Получение данных исходя из entity так же поиск и фильтры внутри
  const { data, setSearchOld, setFiltersOld } = useEntityData(entity);

  // Действия
  const {
    onAction,
    currentItem,
    isReply,
    isMoney,
    isPricing,
    isCity,
    changeReply,
    changeMoney,
    changePricing,
    changeCity,
  } = useEntityActions();

  // =========================
  // СТАБИЛЬНЫЙ СПИСОК ДЛЯ КАРТОЧЕК ПОЛЬЗОВАТЕЛЕЙ (без скачков)
  // =========================
  const [stableUsers, setStableUsers] = useState<any[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Приходят новые userData (это «первые N» от сервера) — добавляем ТОЛЬКО хвост сверх уже отрисованного
  useEffect(() => {
    // если server вернул меньше, чем уже отрисовано — это смена фильтров/поиска: сбрасываем
    if (userData.length < stableUsers.length) {
      seenIdsRef.current.clear();
      const dedup = userData.filter((u) => {
        if (seenIdsRef.current.has(u._id)) return false;
        seenIdsRef.current.add(u._id);
        return true;
      });
      setStableUsers(dedup);
      return;
    }

    // нормальная подгрузка: limit вырос → сервер вернул N элементов; берём хвост
    const tail = userData.slice(stableUsers.length);
    if (tail.length === 0) return;

    const toAppend = tail.filter((u) => {
      if (seenIdsRef.current.has(u._id)) return false;
      seenIdsRef.current.add(u._id);
      return true;
    });

    if (toAppend.length) setStableUsers((prev) => [...prev, ...toAppend]);
  }, [userData]); // зависит только от входных userData

  // =========================
  // ИНФИНИТИ-СКРОЛЛ: добавляем по 10
  // =========================
  // @ts-ignore
  const { ref } = useInfiniteScroll({
    isFetching,
    setFilters: (updater: any) => {
      // увеличиваем limit на +10, не трогая остальные фильтры
      setFilters((prev: any) => {
        const next = typeof updater === "function" ? updater(prev) : updater ?? prev;
        const currentLimit = Number(prev?.limit ?? 10);
        return { ...(next ?? prev), limit: currentLimit + 10 };
      });
      // синхронно поддержим и внутренний стор, если нужен
      setFiltersOld((prev: any) => {
        const currentLimit = Number(prev?.limit ?? 10);
        return { ...(prev ?? {}), limit: currentLimit + 10 };
      });
    },
  });

  return (
    <div className="w-full min-h-screen flex flex-col gap-3 rela">
      <WidgetListTop
        createButton={entity === "topup" || entity === "city"}
        entity={entity}
        filterTabs={entity === "transaction" || entity === "user"}
        searchInput={
          entity === "topup" ||
          entity === "message" ||
          entity === "claim" ||
          entity === "user" ||
          entity === "city"
        }
        onChange={(filters, search) => {
          // При смене фильтров/поиска — начать заново (limit=10), сбросить локальный список
          setFiltersOld({ ...filters, limit: 10 });
          setFilters({ ...filters, limit: 10 });
          setSearchOld(search);
          setSearch(search);

          seenIdsRef.current.clear();
          setStableUsers([]);
        }}
        onAdd={() => {
          switch (entity) {
            case "city":
              onAction("addCity", {});
              break;
            default:
              break;
          }
        }}
      />

      {viewType === "list" ? (
        <div className="flex flex-col gap-3 w-full">
          {sessionData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {cityData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {claimData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {mailingData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item._id)}
            />
          ))}
          {messageData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              color={item.fileUrl ? 'yellow' : ''}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {serviceData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {transactionData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {topupData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {withdrawalData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          {saleData?.map((item: any, index: number) => (
            <WidgetListListCard
              key={item._id}
              items={getMappedItem(entity, item)}
              index={index}
              length={data?.length}
              onAction={(action) => onAction(action, item)}
            />
          ))}
          <div ref={ref} />
        </div>
      ) : null}

      {viewType === "card" ? (
        <div className="grid grid-cols-5 gap-6">
          {stableUsers.map((user: any) => (
            <WidgetUserCard
              key={user._id}
              user={user}
              onAction={(action) => onAction(action, user)}
            />
          ))}
          <div ref={ref} />
        </div>
      ) : null}

      {/* Модальки */}
      <ModalWithInput
        action="Ответить"
        isOpen={isReply}
        placeholder="Текст ответа..."
        title="Ответ"
        type="textarea"
        onAction={(value: any) => onAction("reply", value)}
        onOpenChange={changeReply}
      />

      <ModalWithInput
        action="Добавить"
        isOpen={isMoney}
        placeholder="1 000"
        text={`Добаить деньги на счет, сейчас ${formatRubleWithThousands(currentItem?.balance)}`}
        title="Добвить деньги"
        type="amount"
        onAction={(value: any) => onAction("addMoney", value)}
        onOpenChange={changeMoney}
      />

      <ModalPricing
        isOpen={isPricing}
        title={currentItem?.name}
        pricing={currentItem?.options}
        onAction={(value: any) => onAction("pricing", value)}
        onOpenChange={changePricing}
      />

      <ModalWithInput
        action="Добавить"
        isOpen={isCity}
        placeholder="Название города"
        title="Новый город"
        type="text"
        onAction={(value: any) => onAction("addCity", value)}
        onOpenChange={changeCity}
      />
    </div>
  );
};
