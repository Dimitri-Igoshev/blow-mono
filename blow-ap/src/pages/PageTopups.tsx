import { LayoutMain } from '@/layout/main/LayoutMain';
import { LayoutPageList } from '@/layout/page/LayoutPageList';
import { useGetTopupsQuery } from '@/redux/services/topupApi'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

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
  
    const { data: topupData, isFetching } = useGetTopupsQuery(params);

  return (
    <LayoutMain>
      <LayoutPageList entity='topup' viewType="list" topupData={topupData}
        setSearch={setSearch}
        setFilters={setFilters}
        isFetching={isFetching}/>
    </LayoutMain>
  );
};

export default PageTopups;
