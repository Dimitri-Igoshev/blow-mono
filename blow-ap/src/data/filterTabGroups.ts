export type TabOption = {
  key: string;
  title: string;
};

export type TabGroup = {
  key: string; // уникальный идентификатор группы (например, 'status')
  type: string; // тип группы (например, 'status')
  title: string; // отображаемое имя группы (например, 'Статус')
  options: TabOption[]; // табы внутри группы
};

const tabGroups: TabGroup[] = [
  {
    key: 'status',
    type: 'status',
    title: 'Статус',
    options: [
      { key: 'all', title: 'Все' },
      { key: 'active', title: 'Активные' },
      { key: 'new', title: 'Неактивные' },
      { key: 'inactive', title: 'Заблокированные' },
      { key: "archive", title: "Архив" },
    ],
  },
  {
    key: 'sex',
    type: 'sex',
    title: 'Пол',
    options: [
      { key: '', title: 'Все' },
      { key: 'male', title: 'Мужчины' },
      { key: 'female', title: 'Женщины' },
    ],
  },
  {
    key: 'transactionStatus',
    type: 'status',
    title: 'Статус транзакции',
    options: [
      { key: '', title: 'Все' },
      { key: 'paid', title: 'Оплачено' },
      { key: 'unpaid', title: 'Неоплачено' },
    ],
  },
  {
    key: 'transactionType',
    type: 'type',
    title: 'Тип транзакции',
    options: [
      { key: '', title: 'Все' },
      { key: 'credit', title: 'Пополнение' },
      { key: 'debit', title: 'Списание' },
    ],
  },
  {
    key: 'transactionMethod',
    type: 'method',
    title: 'Метод транзакции',
    options: [
      { key: '', title: 'Все' },
      { key: 'topup', title: 'Карта пополнения' },
      { key: 'card', title: 'Платежный терминал' },
    ],
  },
];

export const getFilterTabGroups = (type: any) => {
  switch (type) {
    case 'user':
      return tabGroups.filter((group) => group.key === 'status' || group.key === 'sex');
    case 'transaction':
      return tabGroups.filter(
        (group) =>
          group.key === 'transactionStatus' ||
          group.key === 'transactionType' ||
          group.key === 'transactionMethod'
      );
    default:
      return [];
  }
};
