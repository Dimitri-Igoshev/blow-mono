// Пока получаю из конфига, но нужно прям здесь из useProject там просто нет этого объекта

import { useLocation } from 'react-router-dom';

import projectConfig from '@/config/projectConfig';

type RouteItem = {
  path: string;
  name: string;
};

export function useBreadcrumbs() {
  // пока так, нужно из useProject
  const routes = projectConfig.routes;

  const location = useLocation();
  const currentPath = location.pathname;

  const parts = currentPath.split('/').filter(Boolean);
  const breadcrumbs: RouteItem[] = [];

  let accumulatedPath = '';

  for (const part of parts) {
    accumulatedPath += `/${part}`;

    const route = routes.find((r: any) => r.path.includes(accumulatedPath));

    if (route) {
      breadcrumbs.push({ path: route.path, name: route.name });
    }
  }

  // Добавляем корень, если он не учтён
  if (currentPath === '/' || breadcrumbs.length === 0) {
    const root = routes.find((r: any) => r.path === '/');

    if (root) breadcrumbs.unshift({ path: '/', name: root.name });
  }

  return breadcrumbs;
}
