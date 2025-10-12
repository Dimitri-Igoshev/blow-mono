import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetWithdrawalsQuery } from "@/redux/services/withdrawalApi"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageWithdrawals = () => {
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

  const { data: withdrawalData, isFetching } = useGetWithdrawalsQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="withdrawal"
        viewType="list"
        withdrawalData={withdrawalData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageWithdrawals;
