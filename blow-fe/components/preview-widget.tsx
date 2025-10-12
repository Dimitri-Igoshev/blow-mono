"use client";

import { cn } from "@heroui/theme";
import { FC, useEffect, useRef, useState } from "react";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";

import { config } from "@/common/env";
// import { getCityString } from "@/helper/getCityString";
import { ROUTES } from "@/app/routes";
import { getActivityString } from "@/helper/getActivityString";
import { isTop } from "@/helper/checkIsActive";
import { useCityLabel } from "@/helper/getCityString";

interface PreviewWidgetProps {
	item: any;
	className?: string;
	style?: any
}

export const PreviewWidget: FC<PreviewWidgetProps> = ({ item, className, style }) => {
	const router = useRouter();
	const ref = useRef<any>(null);

	const { getCityLabel } = useCityLabel();

	const [width, setWidth] = useState<number | null>();

	useEffect(() => {
		if (ref?.current?.offsetWidth) {
			setWidth(ref.current.offsetWidth);
		}
	}, [ref?.current?.offsetWidth]);

	return (
		<button
			ref={ref}
			className={cn(
				"w-full border-[5px] rounded-[32px] border-white overflow-hidden cursor-pointer text-white sm:hover:scale-110 hover:z-30 transition-all z-0 relative",
				{
					["border-white dark:border-white/25"]: !isTop(item),
					["border-primary dark:border-primary/75"]: isTop(item),
				},
				className
			)}
			style={{ height: `${width ? width * 1.42 : 0}px` }}
			onClick={() =>
				window.open(
					`${ROUTES.ACCOUNT.SEARCH}/${item._id}`,
					"_blank",
					"noopener,noreferrer"
				)
			}
		>
			<Image
				alt=""
				className="object-cover"
				height={width ? width * 1.40 : 0}
				src={
					item?.photos?.[0]?.url
						? `${config.MEDIA_URL}/${item?.photos[0]?.url}`
						: item?.sex === "male"
							? "/men2.png"
							: "/woman2.png"
				}
				width={"100%"}
			/>

			<div className="text-sm sm:text-base p-[7px] bg-transparent w-full absolute left-0 bottom-0 z-10">
				<div
					className={cn("  p-3 px-4 rounded-[24px] flex flex-col bg-dark/50", {
						// ["bg-dark/50"]: !isTop(item),
						// ["bg-primary/50"]: isTop(item),
					})}
				>
					<div className="flex items-center gap-1.5">
						{getActivityString(item?.activity) === "онлайн" ? (
							<div className="w-2.5 h-2.5 rounded-full bg-green-400" />
						) : null}
						<p className="font-semibold line-clamp-1">
							{item?.firstName
								? item.firstName
								: item?.sex === "male"
									? "Мужчина"
									: "Девушка"}
						</p>
					</div>

					<div className="flex items-center justify-between gap-3">
						<p className="opacity-50 text-start">
							{item?.age ? item.age + ", " : ""}
							{getCityLabel(item?.city)}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-transparent absolute -right-[100px] sm:-right-[70px] top-[12px] sm:top-[36px] z-10">
				{isTop(item) ? (
					<div className="bg-primary w-[250px] h-[25px] sm:w-[250px] sm:h-[45px] rotate-45 flex justify-center items-center">
						<Image alt="" className="w-[40px] sm:w-[70px]" src="/top.png" />
					</div>
				) : null}
			</div>
		</button>
	);
};
