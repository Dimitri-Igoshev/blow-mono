import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatSafeDate = (value: any, fallback = '—'): string => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime())
    ? format(date, 'dd MMMM yyyy', { locale: ru })
    : fallback;
};

export const formatSafeDateWithTime = (value: any, fallback = '—'): string => {
  const date = new Date(value);
  return !isNaN(date.getTime())
    ? format(date, 'dd MMMM yyyy, HH:mm:ss', { locale: ru })
    : fallback;
};