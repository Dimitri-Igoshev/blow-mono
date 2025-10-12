import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetSessionsQuery } from "@/redux/services/sessionsApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageSessions = () => {
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

  const { data: sessionData, isFetching } = useGetSessionsQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="session"
        viewType="list"
        sessionData={sessionData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageSessions;
