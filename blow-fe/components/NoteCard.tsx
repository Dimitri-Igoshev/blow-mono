"use client";

import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/app/routes";
import { resolveMediaUrl } from "@/common/env";
import { useGetUserQuery } from "@/redux/services/userApi";
import { Button } from "@heroui/button";
import { MdDeleteOutline } from "react-icons/md";

export const NoteCard = ({ note, onDelete }: any) => {
	const { data: user } = useGetUserQuery(note._id);
	const router = useRouter();

	return (
		<button
			className="bg-white dark:bg-foreground-100 flex justify-between gap-5 rounded-[24px] p-5 cursor-pointer group"
			onClick={() => router.push(ROUTES.ACCOUNT.SEARCH + "/" + note._id)}
		>
			{/* <div className="min-w-[60px]"> */}
			{/* <Avatar
				showFallback
				// isBordered={isPremium(me)}
				fallback={
					<CameraIcon
						className="animate-pulse w-6 h-6 text-default-500"
						fill="currentColor"
						size={20}
					/>
				}
				src={
                                        user?.photos[0]?.url
                                                ? resolveMediaUrl(user?.photos[0]?.url)
                                                : user?.sex === "male"
                                                        ? "/men.jpg"
                                                        : "/woman.jpg"
				}
				onClick={() => router.push(`${ROUTES.ACCOUNT.SEARCH}/${user?._id}`)}
			/> */}
			{/* </div> */}
			<div className="bg-white dark:bg-foreground-100 flex gap-5">
				<div className="relative w-[60px] h-[60px] min-w-[60px] min-h-[60px] xl:flex-shrink-0 aspect-[1/1] overflow-hidden rounded-full cursor-pointer">
					<div className="absolute inset-0">
						<img
							alt=""
							src={
                                        user?.photos[0]?.url
                                                ? resolveMediaUrl(user.photos[0].url)
                                                : user?.sex === "male"
                                                        ? "/men2.png"
                                                        : "/woman2.png"
							}
							className="w-full h-full object-cover object-center"
						/>
					</div>
				</div>
				<p className="text-[18px] text-left">{note.text}</p>
			</div>

			<Button
				isIconOnly
				size="sm"
				radius="full"
				onPress={onDelete}
				color="primary"
				className="hidden group-hover:flex"
			>
				<MdDeleteOutline className="text-[20px]" />
			</Button>
		</button>
	);
};
