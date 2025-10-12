"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { on } from "events";
import { FC } from "react";

interface InfoModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	title: string;
	text: string;
	onAction?: () => void;
	actionBtn?: string;
	closeBtn?: string;
	onClose?: () => void;
}

export const InfoModal: FC<InfoModalProps> = ({
	isOpen,
	onOpenChange,
	title,
	text,
	onAction,
	actionBtn,
	closeBtn,
	onClose,
}) => {
	return (
		<Modal
			backdrop="blur"
			className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
			classNames={{
				closeButton: "m-3.5",
			}}
			isOpen={isOpen}
			placement="center"
			size="sm"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 text-[20px] mr-6">
					{title}
				</ModalHeader>
				<ModalBody>
					<div>{text}</div>
				</ModalBody>
				<ModalFooter>
					<div className="flex flex-raw w-full gap-3">
						<Button
							className="w-full"
							radius="full"
							onPress={onOpenChange}
						>
							{closeBtn ? closeBtn : "Закрыть"}
						</Button>
						{onAction && actionBtn ? (
							<Button
								className="w-full"
								color="primary"
								radius="full"
								onPress={onAction}
							>
								{actionBtn}
							</Button>
						) : null}
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
