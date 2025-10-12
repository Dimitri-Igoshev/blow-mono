import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export const getActivityString = (date: Date): string => {
  if (!date) return "нет данных";

  const now = new Date(Date.now());
  const target = new Date(date);

  const diffMin = differenceInMinutes(now, target);
  const diffHour = differenceInHours(now, target);
  const diffDay = differenceInDays(now, target);

  if (diffMin < 30) return "онлайн";
  if (diffMin < 60) return `${diffMin} мин назад`;
  if (diffHour < 24) return `${diffHour} ч назад`;
  if (diffDay < 7) return `${diffDay} д назад`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} нед назад`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)} мес назад`;
  if (diffDay >= 365) return `${Math.floor(diffDay / 365)} г назад`;

  return "";
};
