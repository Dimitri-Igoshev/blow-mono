import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetCountQuery, useGetUsersQuery } from "@/redux/services/userApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageUsers = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Record<string, unknown>>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      setFilters((prev) => ({
        ...prev,
        userId,
        limit: 10,
      }));
    }
  }, [searchParams]);

  const params = { ...filters, search };

  const { data: userData, isFetching } = useGetUsersQuery(params);
  const { data: count } = useGetCountQuery(null)

  return (
    <LayoutMain>
      <div className="flex items-center justify-between mb-6 p-3 px-4 mt-0 text-xs gap-3 flex-wrap bg-gray-300 rounded-full">
        <p>Всего анкет <span className="text-primary">{count?.totals?.all}</span></p>
        <p>Активных <span className="text-primary">{count?.totals?.active}</span></p>
        <p>Реальных <span className="text-primary">{count?.totals?.real}</span></p>
        <p>Фейковых <span className="text-primary">{count?.totals?.fake}</span></p>
        <p>Реальных онлайн <span className="text-primary">{count?.online?.real}</span></p>
        <p>Фейковых онлайн <span className="text-primary">{count?.online?.fake}</span></p>
        <p>Всего онлайн <span className="text-primary">{count?.online?.total}</span></p>
      </div>
      <LayoutPageList
        entity="user"
        viewType="card"
        userData={userData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageUsers;
