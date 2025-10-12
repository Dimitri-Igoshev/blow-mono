"use client";

import { FC } from "react";
import { Image } from "@heroui/image";
import { format } from "date-fns";
import { cn } from "@heroui/theme";

import { useGetMeQuery } from "@/redux/services/userApi";
import { Button } from "@heroui/button";
import { ROUTES } from "@/app/routes";

interface SystemMessageProps {
	left?: boolean;
	message?: any;
	sameSender?: boolean;
	onAction?: (action: string, amount: number, contactType: string) => void;
}

export const SystemMessage: FC<SystemMessageProps> = ({
	left = false,
	message,
	sameSender = false,
	onAction = () => null,
}) => {
	const { data: me } = useGetMeQuery(null);

	// находим сумму в сообщении
	const match = message.text.match(/(\d[\d\s]*)\s*₽/);
	const amount = parseInt(match[1].replace(/\s/g, ""), 10);

	// находим тип контакта
	const contactType = message.text.match(/\((.*?)\)/);

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
						src="/logo-round.png"
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
						Системное сообщение
					</p>
				</div>
			) : null}

			<div className="flex justify-between items-center gap-6 w-full">
				<div
					className={cn(
						"flex flex-col justify-between bg-white dark:bg-foreground-100 rounded-[12px] px-5 p-3 gap-3 -mt-3 md:max-w-[50%]",
						{ ["rounded-tr-none"]: !left, ["rounded-tl-none"]: left }
					)}
				>
					{message?.text ? <p>{message.text}</p> : null}

					{me?.sex === "male" ? (
						<div className="flex justify-end">
							<Button
								radius="full"
								color="primary"
								size="sm"
								onPress={() => onAction("contact", amount, contactType[1])}
							>
								Купить контакт
							</Button>
						</div>
					) : null}
				</div>

				<p className="text-[10px] text-right mt-1">
					{format(new Date(message?.createdAt), "HH:mm dd.MM.yyyy")}
				</p>
			</div>
		</div>
	);
};
