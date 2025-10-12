import type { TabGroup } from '@/data/filterTabGroups';

import { useState } from 'react';

export function useFilterTabsState(tabGroups: TabGroup[]) {
  const initialState = Object.fromEntries(
    tabGroups.map((group) => [group.key, group.options[0]?.key || ''])
  );

  const [state, setState] = useState<Record<string, string>>(initialState);

  const setTab = (groupKey: string, value: string) => {
    setState((prev) => ({ ...prev, [groupKey]: value }));
  };

  return [state, setTab] as const;
}
