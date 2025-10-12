export const formatRubleWithThousands = (value: any): string => {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '—';

  return (
    new Intl.NumberFormat('ru-RU', {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number) + ' ₽'
  );
}