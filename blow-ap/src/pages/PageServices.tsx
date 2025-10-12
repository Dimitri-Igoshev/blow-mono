import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetServicesQuery } from "@/redux/services/serviceApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageServices = () => {
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

  const { data: serviceData, isFetching } = useGetServicesQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="service"
        viewType="list"
        serviceData={serviceData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageServices;
