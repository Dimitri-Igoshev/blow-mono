import { LayoutMain } from "@/layout/main/LayoutMain";
import { LayoutPageList } from "@/layout/page/LayoutPageList";
import { useGetMessagesQuery } from "@/redux/services/messageApi";
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

  const { data: messageData, isFetching } = useGetMessagesQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList
        entity="message"
        viewType="list"
        messageData={messageData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}
      />
    </LayoutMain>
  );
};

export default PageTopups;
