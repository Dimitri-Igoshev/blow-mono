export function moveItem<T extends { order: number }>(
  items: T[],
  index: number,
  direction: 'up' | 'down'
): T[] {
  const newItems = [...items];
  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= items.length) return items;

  // меняем order местами
  const temp = newItems[index].order;
  newItems[index].order = newItems[targetIndex].order;
  newItems[targetIndex].order = temp;

  // сортируем заново
  return newItems.sort((a, b) => a.order - b.order);
}
