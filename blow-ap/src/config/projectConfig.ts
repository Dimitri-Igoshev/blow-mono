// пока так но эти данные должны приходить из объекта проекта

const projectConfig: any = {
  routes: [
    {
      path: '/',
      element: 'PageUsers',
      private: true,
      name: 'Пользователи',
      menu: false,
    },
    {
      path: '/users',
      element: 'PageUsers',
      private: true,
      name: 'Пользователи',
      menu: true,
    },
    {
      path: '/users/edit/:id',
      element: 'PageUserEdit',
      private: true,
      name: 'Редактирование пользователя',
      menu: false,
    },
    {
      path: '/services',
      element: 'PageServices',
      private: true,
      name: 'Услуги',
      menu: true,
    },
    {
      path: '/transactions',
      element: 'PageTransactions',
      private: true,
      name: 'Транзакции',
      menu: true,
    },
    {
      path: '/topups',
      element: 'PageTopups',
      private: true,
      name: 'Карты пополнения',
      menu: true,
    },
    {
      path: '/messages',
      element: 'PageMessages',
      private: true,
      name: 'Сообщения',
      menu: true,
    },
    {
      path: '/claims',
      element: 'PageClaims',
      private: true,
      name: 'Жалобы',
      menu: true,
    },
    {
      path: '/cities',
      element: 'PageCities',
      private: true,
      name: 'Города',
      menu: true,
    },
    {
      path: '/sessions',
      element: 'PageSessions',
      private: true,
      name: 'Сессии',
      menu: false,
    },
    {
      path: '/mailings',
      element: 'PageMailings',
      private: true,
      name: 'Рассылки',
      menu: true,
    },
    {
      path: '/sales',
      element: 'PageSales',
      private: true,
      name: 'Продажи',
      menu: true,
    },
    {
      path: '/withdrawals',
      element: 'PageWithdrawals',
      private: true,
      name: 'Запросы на вывод средств',
      menu: true,
    },
    {
      path: '/fake-chat',
      element: 'PageFakeChat',
      private: true,
      name: 'Фейковое общение',
      menu: true,
    }
  ],
};

// Автоматически достроим routerComponentMap
projectConfig.routerComponentMap = Object.fromEntries(
  projectConfig.routes.map((route: any) => [route.element, route.element])
);

export default projectConfig;
