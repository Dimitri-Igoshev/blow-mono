import { Button } from "@heroui/react";
import { MdDeleteOutline } from "react-icons/md";

export const Note = ({
	text,
	onDelete,
}: {
	text: string;
	onDelete: () => void;
}) => {
	return (
		<div className="p-6 bg-foreground-100 rounded-[24px] flex w-full relative z-20 justify-between gap-1.5 group">
			<div className="flex flex-col gap-1.5">
				<b>Заметка</b>
				<p>{text}</p>
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
		</div>
	);
};
