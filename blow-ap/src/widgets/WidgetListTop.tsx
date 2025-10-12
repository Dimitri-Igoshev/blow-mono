import type { EntityType } from '@/type/entity.types';

import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbItem, Breadcrumbs, Button, Input, Tab, Tabs } from '@heroui/react';
import { FiPlusCircle } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';

import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { getFilterTabGroups, type TabGroup, type TabOption } from '@/data/filterTabGroups';
import { useFilterTabsState } from '@/hooks/useFilterTabsState';

type WidgetListTopProps = {
  entity: EntityType;
  filterTabs?: boolean;
  searchInput?: boolean;
  createButton?: boolean;
  onChange: (filters: Record<string, unknown>, search: string) => void;
  onAdd?: () => void;
  buttonText?: string;
};

export const WidgetListTop: FC<WidgetListTopProps> = ({
  entity,
  filterTabs = false,
  searchInput = false,
  createButton = false,
  onChange,
  onAdd,
  buttonText = 'Добавить',
}) => {
  // Хлебные крошки из хука на основе роута
  const breadcrumbs = useBreadcrumbs();

  // Фильтры по табам из функции по типу сущности
  const tabGroups: TabGroup[] = getFilterTabGroups(entity);
  const [filters, setFilter] = useFilterTabsState(tabGroups);

  // Стейт для поиска сделаю в любом случае
  const [search, setSearch] = useState('');

  useEffect(() => {
    onChange(filters, search);
  }, [filters, search]);

  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center pb-6 gap-3 w-full">
      <Breadcrumbs radius="full" size="lg" onAction={(key) => navigate(key.toString())}>
        {breadcrumbs.map((item: any) => (
          <BreadcrumbItem key={item.path}>{item.name}</BreadcrumbItem>
        ))}
      </Breadcrumbs>

      {filterTabs ? (
        <div className="flex items-center gap-4">
          {tabGroups.map((group: TabGroup) => (
            <Tabs
              key={group.key}
              radius="full"
              size="sm"
              //@ts-ignore
              onSelectionChange={(key: string) => setFilter(group.type, key)}
            >
              {group.options.map((tab: TabOption) => (
                <Tab key={tab.key} title={tab.title} />
              ))}
            </Tabs>
          ))}
        </div>
      ) : null}

      {searchInput || createButton ? (
        <div className="flex items-center gap-4">
          {searchInput ? (
            <Input
              className="w-[300px]"
              placeholder="Найти..."
              radius="full"
              size="sm"
              startContent={<IoSearch />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          ) : null}

          {createButton ? (
            <Button
              color="primary"
              radius="full"
              size="sm"
              startContent={<FiPlusCircle className="text-white min-w-4 text-[20px]" />}
              onPress={onAdd}
            >
              {buttonText}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
