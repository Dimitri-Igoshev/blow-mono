import { cn, Modal, ModalContent } from "@heroui/react";
import { AnimatedLogo } from "./AnimatedLogo";

export const BlowLoader = ({ text = "Загрузка ...", noBlur = false }: { text?: string, noBlur?:boolean }) => {
	return (
		<div className={cn("fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[50] flex justify-center items-center", {
			['bg-foreground-50']: noBlur,
			['bg-transparent']: !noBlur
		})}>
		<Modal
			closeButton
			backdrop="blur"
			className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
			classNames={{
				closeButton: "hidden",
			}}
			isDismissable={false}
			isOpen
			placement="center"
			size="xs"
		>
			<ModalContent className="p-10">
				<div className="flex gap-3 items-center flex-col">
					<AnimatedLogo />
					<p className="text-[18px] loading">{text}</p>
				</div>
			</ModalContent>
		</Modal>
		</div>
	);
};
