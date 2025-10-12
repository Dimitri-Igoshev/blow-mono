"use client";

import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

import { ProfilePreview } from "@/components/ProfilePreview";
import { useGetMeQuery, useGetUsersQuery } from "@/redux/services/userApi";
import { useGetCitiesQuery } from "@/redux/services/cityApi";
import { cn } from "@heroui/react";
import { setSearch } from "@/redux/features/searchSlice";
import { motion, AnimatePresence } from "framer-motion";
// import { cities } from "@/data/cities";

const AccountSearch = ({ city = "", sex = "", withPhoto = "" }: any) => {
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const search = state?.search?.search ? state.search.search : null;
	const [limit, setLimit] = useState(12);

	const { ref, inView } = useInView();

	useEffect(() => {
		if (sex) dispatch(setSearch({ ...search, sex }));
		if (withPhoto) dispatch(setSearch({ ...search, withPhoto }));
	}, []);

	// const { data: users, isFetching } = useGetUsersQuery(
	// 	search ? { ...search, limit } : { limit }
	// );
	const { data: pageUsers, isFetching } = useGetUsersQuery(
		search ? { ...search, limit } : { limit }
	);

	// локальный стабильный список
	const [list, setList] = useState<any[]>([]);

	useEffect(() => {
		setList([]);
		setLimit(12);
	}, [search]);

	const { data: cities } = useGetCitiesQuery(null);
	const { data: me } = useGetMeQuery(null);

	useEffect(() => {
		if (city) dispatch(setSearch({ ...search, city }));
	}, []);

	useEffect(() => {
		if (inView && !isFetching) {
			setLimit((prev) => prev + 12);
		}
	}, [inView, isFetching]);

	useEffect(() => {
		if (!pageUsers) return;

		setList((prev) => {
			if (prev.length === 0) return pageUsers; // первая порция

			const seen = new Set(prev.map((u: any) => u._id));
			const toAppend = pageUsers.filter((u: any) => !seen.has(u._id));
			// важно: сохраняем исходный порядок prev и добавляем хвост
			return [...prev, ...toAppend];
		});
	}, [pageUsers]);
	
	return (
		<div
			className={cn(
				"flex w-full flex-col px-3 sm:px-9 gap-[30px] min-h-screen",
				{
					"pt-[390px] sm:-mt-[520px]": me,
					"pt-[320px] sm:-mt-[450px]": !me,
				}
			)}
		>
			<div className="hidden sm:flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">
					Результаты поиска{" "}
					<span className="text-primary text-[28px]">
						{search?.city
							? cities?.find((city: any) => city.value === search.city)?.label
							: ""}
					</span>
				</h1>
			</div>
			{list?.length ? (
				<>
					<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-5 sm:gap-[34px] mt-[16px] sm:mt-0">
						<AnimatePresence initial={false}>
							{list.map((item: any) => (
								<motion.div
									key={item._id}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.18 }}
									className="h-full"
								>
									<ProfilePreview item={item} className="h-full" />
								</motion.div>
							))}
						</AnimatePresence>
					</div>

					<div ref={ref} className="h-10 text-center text-gray-500" />
				</>
			) : (
				<div className="text-[24px]">Анкет не найдено :(</div>
			)}
		</div>
	);
};

export default AccountSearch;
