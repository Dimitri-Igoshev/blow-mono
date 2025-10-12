import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetMailingsQuery } from "@/redux/services/mailingApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageMailings = () => {
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

  const { data: mailingData, isFetching } = useGetMailingsQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="mailing"
        viewType="list"
        mailingData={mailingData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageMailings;
