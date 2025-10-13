import type { EntityType } from "@/type/entity.types";
import { formatSafeDateWithTime } from "./formatSafeDate";
import { formatRubleWithThousands } from "./formatedRubleWithThousands";
import { ENV } from "@/config/env"

export const getMappedItem = (
  entity: EntityType,
  item: Record<string, any>
) => {
  switch (entity) {
    case "sale":
      return [
        {
          label: "Продавец",
          value: `${item?.seller?.firstName || "Не указано"} (${item?.seller?.email})`,
          link: `https://kutumba.ru/account/search/${item?.seller?._id}`,
        },
        {
          label: "Покупатель",
          value: `${item?.buyer?.firstName || "Не указано"} (${item?.buyer?.email})`,
          link: `https://kutumba.ru/account/search/${item?.buyer?._id}`,
        },
        {
          label: "Описание",
          value: item?.description,
        },
        {
          label: "Дата",
          value: formatSafeDateWithTime(item?.createdAt),
        },
        { label: "Сумма", value: formatRubleWithThousands(item?.amount) },
      ];
    case "withdrawal":
      const actions =
        item?.status === "pending" || item?.status === "new"
          ? [
              {
                label: "Перевести",
                type: "topUpMoney",
                active: true,
              },
            ]
          : []; // Пустой массив если статус не pending

      return [
        {
          label: "Запрашивает",
          value: `${item?.user?.firstName || "Не указано"} (${item?.user?.email})`,
          link: `https://kutumba.ru/account/search/${item?.user?._id}`,
        },

        {
          label: "Тип",
          value: item?.type,
        },
        {
          label: "Данные",
          value: item?.data,
        },
        { label: "Сумма", value: formatRubleWithThousands(item?.amount) },
        {
          label: "Действия",
          type: "actions",
          actions, // Используем условный массив действий
        },
      ];
    case "mailing":
      return [
        {
          label: "Отправитель",
          value: `${item?.owner?.firstName || "Не указано"} (${item?.owner?.email})`,
          link: `https://kutumba.ru/account/search/${item?.owner?._id}`,
        },
        {
          label: "Сообщение",
          value: item?.text,
        },
        {
          label: "Действия",
          type: "actions",
          actions: [
            {
              label: "Удалить",
              type: "removeMailing",
              active: true,
            },
          ],
        },
      ];
    case "service":
      return [
        {
          label: "Название",
          value: item?.name,
        },
        {
          label: "Описание",
          value: item?.description,
        },
        {
          label: "Действия",
          type: "actions",
          actions: [
            {
              label: "Цены",
              type: "pricing",
              active: true,
            },
          ],
        },
      ];
    case "transaction":
      return [
        {
          label: "Пользователь",
          value: `${item?.userId?.firstName || "Не указано"} (${item?.userId?.email})`,
          link: `https://kutumba.ru/account/search/${item?.userId?._id}`,
        },
        {
          label: "Тип",
          value: item.type === "credit" ? "Пополнение" : "Списание",
        },
        { label: "Дата", value: formatSafeDateWithTime(item?.createdAt) },
        {
          label: "Метод оплаты",
          value:
            item.method === "topup"
              ? "Карта пополнения"
              : item.method === "card"
                ? "Платежный терминал"
                : "Внутренняя операция",
        },
        {
          label: "Статус",
          value:
            item.status === "paid" || item.type === "debit"
              ? "Оплачено"
              : item.status === "new"
                ? "Ожидает оплты"
                : "Отменено",
        },
        { label: "Сумма", value: formatRubleWithThousands(item?.sum) },
      ];
    case "topup":
      return [
        {
          label: "Название",
          value: "Карта пополнения BLOW",
        },
        { label: "Токен", value: item?.token },
        { label: "Сумма", value: formatRubleWithThousands(item?.amount) },
      ];
    case "message":
      return [
        {
          label: "Отправитель",
          value: `${item?.sender?.firstName || "Не указано"} (${item?.sender?.email})`,
          link: `https://kutumba.ru/account/search/${item?.sender?._id}`,
        },
        {
          label: "Получатель",
          value: `${item?.recipient?.firstName || "Не указано"} (${item?.recipient?.email})`,
          link: `https://kutumba.ru/account/search/${item?.recipient?._id}`,
        },
        {
          label: "Сообщение",
          value: item?.fileUrl ? "ПОСМОТРЕТЬ ФАЙЛ" : item?.text,
          link: `${ENV.MEDIA_URL}/${item?.fileUrl}`,
        },
        {
          label: "Дата",
          value: formatSafeDateWithTime(item?.createdAt),
        },
      ];
    case "claim":
      return [
        {
          label: "От",
          value: `${item?.from?.firstName || "Не указано"} (${item?.from?.email || "Не указано"})`,
          link: `https://kutumba.ru/account/search/${item?.from?._id}`,
        },
        {
          label: "На",
          value: `${item?.about?.firstName || "Не указано"} (${item?.about?.email || "Не указано"})`,
          link: `https://kutumba.ru/account/search/${item?.about?._id}`,
        },
        {
          label: "Жалоба",
          value: item?.text,
        },
        {
          label: "Ответ",
          value: item?.reply || "Без ответа",
        },
        {
          label: "Действия",
          type: "actions",
          actions: [
            {
              label: "Ответить",
              type: "reply",
              active: !item?.reply || item?.reply === "",
            },
          ],
        },
      ];
    case "city":
      return [
        {
          label: "Название",
          value: item?.label,
        },
        {
          label: "Действия",
          type: "actions",
          actions: [
            {
              label: "Вверх",
              type: "up",
              active: true,
            },
            {
              label: "Вниз",
              type: "down",
              active: true,
            },
          ],
        },
      ];
    case "session":
      return [
        {
          label: "IP",
          value: item?.ip || "Неизвестно",
        },
        {
          label: "UserAgent",
          value: item?.userAgent || "Неизвестно",
        },
        {
          label: "Время",
          value: formatSafeDateWithTime(item?.createdAt),
          value2: formatSafeDateWithTime(item?.updatedAt),
        },
      ];
    default:
      return [];
  }
};
