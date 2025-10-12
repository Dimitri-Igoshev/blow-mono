import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetCitiesQuery } from "@/redux/services/cityApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageCities = () => {
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

  const { data: cityData, isFetching } = useGetCitiesQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="city"
        viewType="list"
        cityData={cityData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageCities;
