import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetServicesQuery } from "@/redux/services/serviceApi";
import { useGetTransactionsQuery } from "@/redux/services/transactionApi";
import { useGetTopupsQuery } from "@/redux/services/topupApi";
import { useGetMessagesQuery } from "@/redux/services/messageApi";
import { useGetClaimsQuery } from "@/redux/services/claimApi";
import { useGetCitiesQuery } from "@/redux/services/cityApi";

export const useEntityData = (entity: string) => {
  const [searchParams] = useSearchParams();
  const [filters, setFiltersOld] = useState<Record<string, unknown>>();
  const [search, setSearchOld] = useState("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      setFiltersOld((prev) => ({
        ...prev,
        userId,
        limit: 10,
      }));
    }
  }, [searchParams]);

  const params = { ...filters, search };

  const servicesQuery = useGetServicesQuery(params);
  const transactionsQuery = useGetTransactionsQuery(params);
  const topupsQuery = useGetTopupsQuery(params);
  const messagesQuery = useGetMessagesQuery(params);
  const claimsQuery = useGetClaimsQuery(params);
  const citiesQuery = useGetCitiesQuery(params);

  const data =
    entity === "service"
      ? servicesQuery.data
      : entity === "topup"
        ? topupsQuery.data
        : entity === "transaction"
          ? transactionsQuery.data
          : entity === "message"
            ? messagesQuery.data
            : entity === "claim"
              ? claimsQuery.data
              : entity === "city"
                ? citiesQuery.data
                : [];

  const isFetchingOld =
    entity === "service"
      ? servicesQuery.isFetching
      : entity === "topup"
        ? topupsQuery.isFetching
        : entity === "transaction"
          ? transactionsQuery.isFetching
          : entity === "message"
            ? messagesQuery.isFetching
            : entity === "claim"
              ? claimsQuery.isFetching
              : entity === "city"
                ? citiesQuery.isFetching
                : [];

  return {
    data,
    isFetchingOld,
    search,
    setSearchOld,
    filters,
    setFiltersOld,
  };
};
