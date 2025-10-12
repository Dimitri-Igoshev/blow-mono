import { useCreateSessionMutation, useUpdateActivityMutation } from '@/redux/services/sessionApi'
import { useUpdateUserMutation } from '@/redux/services/userApi'
import { useEffect } from 'react';

export function useSession(userId?: string) {
  const [createSession] = useCreateSessionMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (!userId) return;

    const THIRTY_MIN = 30 * 60 * 1000;
    const now = Date.now();

    let sessionId = localStorage.getItem('sessionId') || '';
    const lastActivity = localStorage.getItem('lastActivity');
    const isSessionStale = !lastActivity || now - Number(lastActivity) > THIRTY_MIN;

    // Создаем новую сессию, если нет или устарела
    if (!sessionId || isSessionStale) {
      createSession(userId)
        .unwrap()
        .then((session) => {
          sessionId = session._id;
          localStorage.setItem('sessionId', sessionId);
          localStorage.setItem('lastActivity', String(Date.now()));
        })
        .catch((err) => console.error('Session creation error:', err));
    }

    // Обработчик активности с debounce
    let debounceTimer: NodeJS.Timeout | null = null;
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];

    const handleActivity = () => {
      if (debounceTimer) return;
      debounceTimer = setTimeout(() => (debounceTimer = null), 60000);

      const currentSessionId = localStorage.getItem('sessionId');
      const activityTimestamp = new Date();

      const promises = [];

      // Обновление активности сессии
      if (currentSessionId) {
        promises.push(updateActivity(currentSessionId).unwrap());
      }

      // Обновление активности пользователя
      promises.push(
        updateUser({ id: userId, body: { activity: activityTimestamp } }).unwrap()
      );

      Promise.all(promises)
        .then(() => {
          localStorage.setItem('lastActivity', String(Date.now()));
        })
        .catch((err) => console.error('Activity update error:', err));
    };

    events.forEach((e) => window.addEventListener(e, handleActivity));
    return () => events.forEach((e) => window.removeEventListener(e, handleActivity));
  }, [userId, createSession, updateActivity, updateUser]);
}
