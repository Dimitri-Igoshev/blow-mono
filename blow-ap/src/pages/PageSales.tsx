import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetSalesQuery } from "@/redux/services/saleApe"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageSales = () => {
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

  const { data: saleData, isFetching } = useGetSalesQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="sale"
        viewType="list"
        saleData={saleData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageSales;
