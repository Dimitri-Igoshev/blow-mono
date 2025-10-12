import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetTransactionsQuery } from "@/redux/services/transactionApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageTransactions = () => {
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

  const { data: transactionData, isFetching } = useGetTransactionsQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="transaction"
        viewType="list"
        transactionData={transactionData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageTransactions;
