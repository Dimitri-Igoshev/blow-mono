import type { RootState } from '@/redux/store';

import React from 'react';
import { useSelector } from 'react-redux';

interface LayoutAuthProps {
  children: React.ReactNode;
}

// Это лейайт для страницы авторизации, и сдесь должна быть персонализация. Админку я буду фреймом встаривать, занчит через него нужно будет как то и передавать, ссылки на бекграунд, логотип и название проекта.

export const LayoutAuth: React.FC<LayoutAuthProps> = ({ children }) => {
  const { project, loading } = useSelector((state: RootState) => state.project);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        Загрузка проекта...
      </div>
    );
  }

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center"
      style={{
        backgroundImage: project?.config?.bgUrl
          ? `url(${project.config.bgUrl})`
          : 'url(/img/background.jpg)',
      }}
    >
      <div className="w-screen h-screen flex justify-center items-center bg-black/50">
        {children}
      </div>
    </div>
  );
};
