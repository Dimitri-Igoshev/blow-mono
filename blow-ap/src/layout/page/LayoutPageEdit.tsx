import { useEffect, useState, type FC } from "react";
import type { ViewType } from "@/type/layout.types";
import type { EntityType } from "@/type/entity.types";

import { WidgetListTop } from "@/widgets/WidgetListTop";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/services/userApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { WidgetEditUserData } from "@/widgets/WidgetEditUserData";
import { BlowLoader } from "@/components/ui/BlowLoader";

interface LayoutPageEditProps {
  entity: EntityType;
  viewType: ViewType;
}

export const LayoutPageEdit: FC<LayoutPageEditProps> = ({
  entity,
  viewType,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Получение данных исходя из entity так же поиск и фильтры внутри
  // const { data, isFetching, setSearch, setFilters } = useEntityData(entity);
  const { data: user } = useGetUserQuery(id);

  const [form, setForm] = useState<any>();

  useEffect(() => {
    if (!user) return;

    setForm({
      email: user?.email || "",
      password: "",
      firstName: user?.firstName || "",
      sex: user?.sex || "",
      age: user?.age || "",
      height: user?.height || "",
      weight: user?.weight || "",
      city: user?.city || "",
      about: user?.about || "",
      voice: user?.voice || "",
      sponsor: user?.sponsor || false,
      traveling: user?.traveling || false,
      relationships: user?.relationships || false,
      evening: user?.evening || false,
      photos: user?.photos || [],
      isFake: user?.isFake || false,
    });
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [updateUser] = useUpdateUserMutation();

  const onSubmit = () => {
    setLoading(true);

    const { password, ...rest } = form;
    const body = { ...rest };
    if (password) body.password = password;

    updateUser({ id, body })
      .unwrap()
      .then(() => {
        navigate("/users");
        setLoading(false);
      });

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-3 relative pt-1.5">
      <WidgetListTop
        createButton={false}
        entity={entity}
        filterTabs={false}
        searchInput={false}
        onChange={() => null}
        onAdd={() => null}
      />

      {viewType === "user" ? (
        <div>
          <div className="grid grid-cols-12 gap-6 items-start w-full">
            <WidgetEditUserData
              className="col-span-12"
              data={form}
              onChange={(key: string, value: string) =>
                setForm({ ...form, [key]: value })
              }
            />
          </div>

          <div className="flex justify-end pt-6 w-full">
            <Button color="primary" radius="full" onPress={onSubmit}>
              Сохранить
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? <BlowLoader /> : null}
    </div>
  );
};
