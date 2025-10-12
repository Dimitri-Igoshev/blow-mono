import { useGetCitiesQuery } from "@/redux/services/cityApi"

export const useCityLabel = () => {
  const { data: cities } = useGetCitiesQuery(null)

  const getCityLabel = (cityValue: string | null | undefined): string => {
    if (!cityValue) return 'не указан';
    return cities?.find((c: any) => c.value === cityValue)?.label || 'не указан';
  };

  return { getCityLabel };
};
