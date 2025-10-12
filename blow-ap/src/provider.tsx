import type { NavigateOptions } from 'react-router-dom';

import { HeroUIProvider } from '@heroui/react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { useHref, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { store, AppDispatch } from '@/redux/store';
import { fetchProject } from '@/generator/projectSlice';
import { useFetchMeQuery } from './redux/services/userApi'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function Init() {
  const dispatch = useDispatch<AppDispatch>();

  useFetchMeQuery();

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  return null;
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ReduxProvider store={store}>
      <Init />
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        {children}
      </HeroUIProvider>
    </ReduxProvider>
  );
}
