"use client";

import { FC } from "react";
import { Image } from "@heroui/image";
import { format } from "date-fns";
import { cn } from "@heroui/theme";

import { resolveMediaUrl } from "@/common/env";
import { useGetMeQuery } from "@/redux/services/userApi";
import { maskContacts } from "@/helper/maskContacts";
import { isPremium } from "@/helper/checkIsActive";
import { Button } from "@heroui/button";
import { MdOutlineFileDownload } from "react-icons/md";
import { ROUTES } from "@/app/routes";
import { FiCornerUpRight } from "react-icons/fi";
import { sanitizeContactsClient } from "@/helper/sanitizeClient";
import { useRouter } from "next/navigation"

interface MessageProps {
	left?: boolean;
	message?: any;
	sameSender?: boolean;
	onReply?: (m: any) => void;
}

export const Message: FC<MessageProps> = ({
	left = false,
	message,
	sameSender = false,
	onReply,
}) => {
	const { data: me } = useGetMeQuery(null);
	const premium = isPremium(me);
	const router = useRouter();

        const handleDownload = async () => {
                const fileUrl = resolveMediaUrl(message?.fileUrl);

                if (!fileUrl) return;

                const response = await fetch(fileUrl);
		const blob = await response.blob();

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", ""); // 💾 имя файла
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	};

	const ReplyQuote = () => {
		if (!message?.replyTo) return null;
		const r = message.replyTo;
		return (
			<div className="mb-2 rounded-md border border-default-200 bg-default-100/60 p-2">
				<div className="text-xs opacity-70">
					{r?.sender?.firstName
						? r.sender.firstName
						: r?.sender?.sex === "male"
							? "Мужчина"
							: "Девушка"}
					{" • "}
					{r?.createdAt ? format(new Date(r?.createdAt), "HH:mm dd.MM") : ""}
				</div>
				{r?.fileUrl ? (
					<div className="mt-1 text-xs italic opacity-80">📎 Вложение</div>
				) : null}
				{r?.text ? (
					<div className="text-sm line-clamp-3">
						{isPremium(me) || me?.sex === "female"
							? r.text
							: sanitizeContactsClient(r.text).text}
					</div>
				) : null}
			</div>
		);
	};

	return (
		<div
			className={cn("flex flex-col gap-5", {
				["items-start"]: left,
				["items-end"]: !left,
			})}
		>
			{!sameSender ? (
				<div className="flex items-center gap-2">
					<Image
						alt=""
						className="rounded-full z-0 relative min-w-[30px] cursor-pointer"
						height={30}
						src={
                                                        message?.sender?.photos?.[0]?.url
                                                                ? resolveMediaUrl(message?.sender?.photos?.[0]?.url) ?? ""
								: message?.sender?.sex === "male"
									? "/men.jpg"
									: "/woman.jpg"
						}
						style={{ objectFit: "cover" }}
						width={30}
						onClick={() =>
							window.open(
								`${ROUTES.ACCOUNT.SEARCH}/${message?.sender?._id}`,
								"_blank",
								"noopener,noreferrer"
							)
						}
					/>
					<p
						className={cn("font-semibold line-clamp-1", {
							["text-primary"]: message?.sender?._id !== me?._id,
						})}
					>
						{left
							? message?.sender?.firstName
								? message?.sender?.firstName
								: message?.sender?.sex === "male"
									? "Мужчина"
									: "Девушка"
							: "Вы"}
					</p>
				</div>
			) : null}

			<div className="flex justify-between items-center gap-6 w-full">
				<div
					className={cn(
						"flex flex-col justify-between bg-white dark:bg-foreground-100 rounded-[12px] px-5 p-3 -mt-3 md:max-w-[50%]",
						{ ["rounded-tr-none"]: !left, ["rounded-tl-none"]: left }
					)}
				>
					{/* 👇 цитата сверху */}
					<ReplyQuote />

					{message?.fileUrl ? (
						<div className="relative group">
							<Image
								alt=""
								className="rounded-lg z-0 relative min-w-[200px]"
                                                                src={resolveMediaUrl(message?.fileUrl) ?? ""}
								style={{ objectFit: "cover" }}
							/>
							<Button
								isIconOnly
								className="absolute bottom-3 right-3 opacity-75 hover:opacity-100 transition-all"
								color="secondary"
								radius="full"
								variant="solid"
								onPress={handleDownload}
							>
								<MdOutlineFileDownload className="text-[20px]" />
							</Button>
						</div>
					) : null}
					{message?.text ? (
						<p>
							{isPremium(me) || me?.sex === "female"
								? message.text
								: sanitizeContactsClient(message.text).text}
						</p>
					) : null}

					{/* Кнопка "Ответить" */}
					{sanitizeContactsClient(message.text).found &&
					!isPremium(me) &&
					me?.sex === "male" ? (
						<div className="flex flex-col gap-3">
							<div className="mt-1 text-primary text-sm">
								Сообщение скрыто, поскольку может содержать контактные
								данные пользователя. Для просмотра необходим премиум аккаунт.
							</div>
							<div>
								<Button
									className=""
									color="default"
									radius="full"
									variant="solid"
									onPress={() => router.push(ROUTES.ACCOUNT.SERVICES)}
								>
									Купить премиум
								</Button>
							</div>
						</div>
					) : null}
					{onReply ? (
						<button
							className="self-end mt-2 text-xs opacity-70 hover:opacity-100 inline-flex items-center gap-1"
							onClick={() => onReply(message)}
							title="Ответить"
						>
							<FiCornerUpRight /> Ответить
						</button>
					) : null}
				</div>

				<p className="text-[10px] text-right mt-1">
					{message?.createdAt
						? format(new Date(message?.createdAt), "HH:mm dd.MM.yyyy")
						: ""}
					{/* <span className="text-[9px]">
						{format(new Date(message?.updatedAt), "dd.MM.yyyy")}
					</span> */}
				</p>
			</div>
		</div>
	);
};
