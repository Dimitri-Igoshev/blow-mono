import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Tab,
  Tabs,
} from "@heroui/react";
import { FiPlusCircle } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";

type WidgetAdminHeaderProps = {
  breadcrumbs: {
    label: string;
    link: string;
  }[];
  filters: {}[];
  searchMethod: () => void;
  addMethod: () => void;
};

export const WidgetAdminHeader: FC<WidgetAdminHeaderProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center pb-6 gap-3 w-full">
      <Breadcrumbs
        radius="full"
        size="lg"
        onAction={(key) => navigate(key.toString())}
      >
        <BreadcrumbItem key="/">Дашборд</BreadcrumbItem>
        <BreadcrumbItem key="/users">Пользователи</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex items-center gap-4">
        <Tabs
          radius="full"
          size="sm"
          //@ts-ignore
          // onSelectionChange={(key: string) => {
          //   if (key === "active") {
          //     setFilter({ ...filter, active: "active" });
          //   } else {
          //     setFilter({ ...filter, active: "" });
          //   }
          // }}
        >
          <Tab key="notActive" title="Все" />
          <Tab key="active" title="Активные" />
        </Tabs>

        <Tabs
          radius="full"
          size="sm"
          variant="light"
          //@ts-ignore
          // onSelectionChange={(key: string) => {
          //   if (key === "all") {
          //     setFilter({ ...filter, sex: "" });
          //   } else {
          //     setFilter({ ...filter, sex: key });
          //   }
          // }}
        >
          <Tab key="all" title="Все" />
          <Tab key="male" title="Мужчины" />
          <Tab key="female" title="Девушки" />
        </Tabs>

        <Input
          placeholder="Найти..."
          radius="full"
          size="sm"
          startContent={<IoSearch />}
          className="w-[300px]"
          // value={filter.search}
          // onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
      </div>

      <Button
        color="primary"
        radius="full"
        size="sm"
        startContent={
          <FiPlusCircle className="text-white min-w-4 text-[20px]" />
        }
      >
        Создать
      </Button>
    </div>
  );
};
