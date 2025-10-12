// src/routes/AppRoutes.tsx
import { useRoutes, RouteObject } from 'react-router-dom';
import { useMemo } from 'react';

import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './pages/auth/PageLogin';
import RegisterPage from './pages/auth/register';
import ForgotPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-pasword';

type ProjectConfig = {
  routes: {
    path: string;
    element: string;
    private?: boolean;
    name?: string;
    menu?: boolean;
  }[];
  routerComponentMap: Record<string, string>;
};

// 🧠 Загружаем ВСЕ страницы (вложенные тоже) — универсально
const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
  string,
  { default: React.FC }
>;

function getComponentMap(routerComponentMap: Record<string, string>): Record<string, React.FC> {
  const map: Record<string, React.FC> = {};

  Object.entries(routerComponentMap).forEach(([key, filename]) => {
    const filePath = Object.keys(pages).find((path) => path.endsWith(`/${filename}.tsx`));

    if (!filePath) {
      console.warn(`❗ Компонент "${filename}" не найден в ../pages`);

      return;
    }
    map[key] = pages[filePath].default;
  });

  return map;
}

export function AppRoutes({ config }: { config: ProjectConfig }) {
  const { routes, routerComponentMap } = config;

  const elementsMap = useMemo(() => getComponentMap(routerComponentMap), [routerComponentMap]);

  const staticRoutes: RouteObject[] = [
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },
  ];

  const dynamicRoutes = routes
    .map(({ path, element, private: isPrivate }) => {
      const Component = elementsMap[element];

      if (!Component) return null;

      const wrapped = isPrivate ? (
        <PrivateRoute>
          <Component />
        </PrivateRoute>
      ) : (
        <Component />
      );

      return { path, element: wrapped };
    })
    .filter((route): route is Exclude<typeof route, null> => route !== null);

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  return useRoutes(allRoutes);
}
