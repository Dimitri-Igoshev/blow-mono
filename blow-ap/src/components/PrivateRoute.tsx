import { Navigate } from 'react-router-dom';

import { useAuth } from '@/redux/services/auth/hooks';

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Загрузка...</p>; // можно заменить на спиннер
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
}
