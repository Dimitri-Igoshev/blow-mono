export const coreSchema = {
  pages: [
    {
      type: 'auth-page',
      path: '/login',
      layout: 'centered',
      children: [
        {
          type: 'modal',
          title: 'Вход в систему',
          widget: 'form',
          endpoint: '/auth/login',
          fields: [
            { name: 'email', type: 'string', widget: 'email', label: 'Email' },
            {
              name: 'password',
              type: 'string',
              widget: 'password',
              label: 'Пароль',
            },
          ],
          submit: {
            label: 'Войти',
            action: {
              type: 'login',
              successRedirect: '/dashboard',
            },
          },
        },
      ],
    },
    {
      type: 'auth-page',
      path: '/register',
      layout: 'centered',
      children: [
        {
          type: 'model',
          title: 'Регистрация',
          widget: 'form',
          endpoint: '/auth/register',
          fields: [
            { name: 'email', type: 'string', widget: 'email', label: 'Email' },
            {
              name: 'password',
              type: 'string',
              widget: 'password',
              label: 'Пароль',
            },
            { name: 'name', type: 'string', widget: 'text', label: 'Имя' },
          ],
          submit: {
            label: 'Зарегистрироваться',
            action: {
              type: 'login',
              successRedirect: '/dashboard',
            },
          },
        },
      ],
    },
    {
      type: 'auth-page',
      path: '/forgot-password',
      layout: 'centered',
      children: [
        {
          type: 'model',
          title: 'Восстановление пароля',
          widget: 'form',
          endpoint: '/auth/forgot-password',
          fields: [{ name: 'email', type: 'string', widget: 'email', label: 'Email' }],
          submit: {
            label: 'Восстановить',
            action: {
              type: 'custom',
            },
          },
        },
      ],
    },
    {
      type: 'protected-page',
      path: '/dashboard',
      label: 'Дашборд',
      icon: 'LayoutDashboard',
      access: ['admin', 'client'],
      content: {
        type: 'custom',
        component: 'DashboardPage',
      },
    },
  ],

  menu: [
    {
      label: 'Дашборд',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      access: ['admin', 'client'],
    },
    {
      label: 'Выход',
      action: 'logout',
      icon: 'LogOut',
    },
  ],
};
