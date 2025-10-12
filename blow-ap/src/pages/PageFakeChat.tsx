import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@heroui/react";

import { LayoutMain } from "@/layout/main/LayoutMain";
import { useGetFakeChatsQuery } from "@/redux/services/messageApi";
import { FakeMessage as FakeMessageBase } from "@/components/fake-chat/FakeMessage";
import { BlowLoader } from "@/components/ui/BlowLoader";

const INITIAL_STATE = {
  search: "",
  limit: 10, // дозагрузка по 10
};

// Мемо, чтобы карточки зря не перерисовывались
const FakeMessage = React.memo(FakeMessageBase, (prev, next) => {
  const a = prev.chat as any;
  const b = next.chat as any;

  if (a._id !== b._id) return false;
  if (a.lastActivityAt !== b.lastActivityAt) return false;

  const as = a.messages || [];
  const bs = b.messages || [];

  if (as.length !== bs.length) return false;
  for (let i = 0; i < as.length; i++) {
    if (
      as[i]?._id !== bs[i]?._id ||
      as[i]?.createdAt !== bs[i]?.createdAt ||
      as[i]?.text !== bs[i]?.text
    )
      return false;
  }

  return true;
});

// --------------------------------------------------
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// --------------------------------------------------

function ts(v: any): number {
  if (!v) return 0;
  const n = typeof v === "string" ? Date.parse(v) : +new Date(v);

  return Number.isFinite(n) ? n : 0;
}

function getActivityTs(chat: any): number {
  return ts(chat?.lastActivityAt) || ts(chat?.messages?.[0]?.createdAt) || 0;
}

function chatChanged(oldChat: any, freshChat: any) {
  if (!oldChat || !freshChat) return true;
  if (oldChat.lastActivityAt !== freshChat.lastActivityAt) return true;

  const a = oldChat.messages || [];
  const b = freshChat.messages || [];

  if (a.length !== b.length) return true;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i]?._id !== b[i]?._id ||
      a[i]?.createdAt !== b[i]?.createdAt ||
      a[i]?.text !== b[i]?.text
    )
      return true;
  }

  return false;
}

// бинарный поиск позиции вставки по lastActivityAt (DESC)
function findInsertIndexDESC(arr: any[], item: any): number {
  const target = getActivityTs(item);
  let lo = 0,
    hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const midTs = getActivityTs(arr[mid]);

    // нужно DESC: новые выше => если target больше — идём влево
    if (target > midTs) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}

// Умное слияние: поддерживаем общий порядок DESC по активности,
// но двигаем только изменившиеся/новые элементы
function mergeChatsOrdered(
  prev: any[],
  incoming: any[],
  mode: "poll" | "loadMore"
): any[] {
  if (!incoming?.length) return prev.slice();

  // Карта свежих элементов
  const freshMap = new Map(incoming.map((c) => [c._id, c]));
  // Карта старых
  const prevMap = new Map(prev.map((c) => [c._id, c]));

  // 1) Обновим изменившиеся «на месте» (с сохранением идентичности остальных)
  let next = prev.slice();

  for (let i = 0; i < next.length; i++) {
    const old = next[i];
    const fresh = freshMap.get(old._id);

    if (fresh && chatChanged(old, fresh)) {
      next[i] = fresh; // подменяем объект, чтобы карточка перерисовалась
      // Теперь аккуратно переставим его в нужное место по дате
      const moved = next.splice(i, 1)[0];
      const idx = findInsertIndexDESC(next, moved);

      next.splice(idx, 0, moved);
      // если переставили выше, индекс i уже невалиден — сдвинем указатель назад
      if (idx <= i) i++;
    }
  }

  // 2) Новые элементы: вставляем по позиции DESC.
  //    В режиме "poll" это обычно вершина, в "loadMore" — чаще внизу (старее),
  //    но мы всё равно рассчитываем позицию корректно.
  for (const fresh of incoming) {
    if (!prevMap.has(fresh._id)) {
      const idx = findInsertIndexDESC(next, fresh);

      next.splice(idx, 0, fresh);
    }
  }

  // 3) В режиме poll ничего не удаляем (чтобы не «прыгало»).
  //    Если хочешь ограничить максимум элементов, можно срезать хвостом: next = next.slice(0, MAX)
  return next;
}

// --------------------------------------------------

const PageFakeChat = () => {
  const [currentTab, setCurrentTab] = useState<"messages" | "sending">(
    "messages"
  );
  const [params, setParams] = useState({ ...INITIAL_STATE });

  // Чтобы понимать, какой режим слияния применять
  const mergeModeRef = useRef<"poll" | "loadMore">("poll");
  const loadingMoreRef = useRef(false);

  // Опрос каждую секунду
  const {
    data: chats,
    isFetching,
    isLoading,
  } = useGetFakeChatsQuery(params, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Стабильный массив для UI
  const [displayChats, setDisplayChats] = useState<any[]>([]);

  // Сброс при смене поиска
  useEffect(() => {
    setDisplayChats([]);
    mergeModeRef.current = "poll";
  }, [params.search]);

  // Есть ли ещё данные (если вернулось меньше, чем запросили — вероятно, дошли до конца)
  const hasMore = useMemo(() => {
    if (!chats) return false;
    const asked = params.limit || 10;

    return chats.length >= asked;
  }, [chats, params.limit]);

  // Слияние входящих данных (с поддержкой порядка DESC)
  useEffect(() => {
    if (!chats) return;
    setDisplayChats((prev) =>
      mergeChatsOrdered(prev, chats, mergeModeRef.current)
    );
    loadingMoreRef.current = false;
    mergeModeRef.current = "poll";
  }, [chats]);

  // Дозагрузка ещё 10
  const loadMore = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (!hasMore) return;
    loadingMoreRef.current = true;
    mergeModeRef.current = "loadMore";
    setParams((p) => ({ ...p, limit: (p.limit || 10) + 10 }));
  }, [hasMore]);

  // Сенсор бесконечной ленты
  const loadMoreRefEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRefEl.current;

    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) loadMore();
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, [loadMore]);

  return (
    <>
      {isLoading && !displayChats.length ? (
        <BlowLoader />
      ) : (
        <LayoutMain>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-secondary text-3xl">
                Фейковое общение
              </h1>
              {/* <Button
                color="primary"
                radius="full"
                onPress={() =>
                  setCurrentTab((t) =>
                    t === "sending" ? "messages" : "sending"
                  )
                }
              >
                {currentTab === "sending" ? "Сообщения" : "Написать"}
              </Button> */}
            </div>

            {currentTab === "messages" ? (
              <>
                {/* Лента чатов */}
                <div className="flex flex-col gap-3 w-full">
                  {displayChats.map((chat: any) => (
                    <FakeMessage key={chat._id} chat={chat} />
                  ))}

                  {(isFetching || loadingMoreRef.current) && (
                    <div className="text-xs text-default-500 self-center py-2">
                      загрузка…
                    </div>
                  )}

                  {/* Сенсор для бесконечной ленты */}
                  <div ref={loadMoreRefEl} style={{ height: 1 }} />
                </div>
              </>
            ) : null}
          </div>
        </LayoutMain>
      )}
    </>
  );
};

export default PageFakeChat;
