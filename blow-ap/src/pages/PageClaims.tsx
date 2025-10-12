import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetClaimsQuery } from "@/redux/services/claimApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageTopups = () => {
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

  const { data: claimData, isFetching } = useGetClaimsQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="claim"
        viewType="list"
        claimData={claimData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageTopups;
