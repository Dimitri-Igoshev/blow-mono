"use client";

import { differenceInHours, differenceInDays } from "date-fns";
import { useEffect, useState } from "react";

import { PreviewWidget } from "@/components/preview-widget";
import { useGetMeQuery } from "@/redux/services/userApi";
import { useGetGuestsQuery } from "@/redux/services/guestApi";

export default function AccountGuests() {
	const { data: me } = useGetMeQuery(null);
	const { data: guests } = useGetGuestsQuery(me?._id, { skip: !me?._id });

	const [lastDay, setLastDay] = useState<any[]>([]);
	const [lastWeek, setLastWeek] = useState<any[]>([]);
	const [lastMonth, setLastMonth] = useState<any[]>([]);
	const [lastYear, setLastYear] = useState<any[]>([]);

useEffect(() => {
  if (!guests?.length) return;

  const clonedGuests = guests.map((g: any) => ({ ...g }));

  const uniqueArray = Array.from(
    new Map(clonedGuests.map((item: any) => [String(item._id), item])).values()
  );

  const now = new Date();

  const filterAndMap = (filterFn: (item: any) => boolean) => {
    return Array.from(
      new Map(
        uniqueArray
          .filter(filterFn)
          .map((item: any) => [String(item.guest._id), item.guest]) // дедуплицируем guest
      ).values()
    );
  };

  setLastDay(
    filterAndMap(
      (item) => differenceInHours(now, new Date(item.createdAt)) <= 24
    )
  );

  setLastWeek(
    filterAndMap(
      (item) =>
        differenceInHours(now, new Date(item.createdAt)) > 24 &&
        differenceInDays(now, new Date(item.createdAt)) <= 7
    )
  );

  setLastMonth(
    filterAndMap(
      (item) =>
        differenceInHours(now, new Date(item.createdAt)) > 24 &&
        differenceInDays(now, new Date(item.createdAt)) > 7 &&
        differenceInDays(now, new Date(item.createdAt)) <= 30
    )
  );

  setLastYear(
    filterAndMap(
      (item) =>
        differenceInHours(now, new Date(item.createdAt)) > 24 &&
        differenceInDays(now, new Date(item.createdAt)) > 30 &&
        differenceInDays(now, new Date(item.createdAt)) <= 365
    )
  );
}, [guests]);


	return (
		<div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-[30px] mb-[50px] min-h-screen h-full">
			<div className="flex w-full items-center justify-between">
				<h1 className="w-full font-semibold text-[36px] text-center sm:text-left">
					Кто смотрел
				</h1>
			</div>

			{lastDay?.length ||
			lastWeek?.length ||
			lastMonth?.length ||
			lastYear?.length ? (
				<div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
					{lastDay.length ? (
						<p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3">
							За последние 24 часа
						</p>
					) : null}

					{lastDay.map((item: any) => (
						<PreviewWidget key={item._id} item={item} />
					))}

					{lastWeek?.length ? (
						<>
							<p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
								За поледние 7 дней
							</p>

							{lastWeek.map((item: any) => (
								<PreviewWidget key={item._id} item={item} />
							))}
						</>
					) : null}

					{lastMonth?.length ? (
						<>
							<p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
								За поледние 30 дней
							</p>

							{lastMonth.map((item: any) => (
								<PreviewWidget key={item._id} item={item} />
							))}
						</>
					) : null}

					{lastYear?.length ? (
						<>
							<p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
								За поледние 12 месяцев
							</p>

							{lastYear.map((item: any) => (
								<PreviewWidget key={item._id} item={item} />
							))}
						</>
					) : null}
				</div>
			) : (
				<p>Вашу анкету ни кто не просматривал...</p>
			)}
		</div>
	);
}
