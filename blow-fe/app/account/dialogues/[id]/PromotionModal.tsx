"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { FC } from "react";

interface PromotionModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}

export const PromotionModal: FC<PromotionModalProps> = ({
	isOpen,
	onOpenChange,
	onClose,
}) => {
	return (
		<Modal
			backdrop="blur"
			className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
			classNames={{
				closeButton: "hidden",
			}}
			isOpen={isOpen}
			placement="center"
			size="lg"
			onOpenChange={onOpenChange}
			isDismissable={false}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 text-[20px]">
					Узнай, кто готов платить за внимание - продавай свой контакт!
				</ModalHeader>
				<ModalBody>
					<p>
						Ты сама назначаешь цену за свой контакт и сразу видишь,{" "}
						<span className="font-semibold">
							кто действительно ценит тебя и готов платить.
						</span>
					</p>
					<p>
						После продажи{" "}
						<span className="font-semibold">
							50% суммы поступает на твой счёт
						</span>{" "}
						удобным способом.
					</p>
					<p>
						💰 Проверяй платежеспособность и щедрость мужчин ещё до знакомства.
					</p>
					<p>
						В чате с мужчиной нажми на кнопку{" "}
						<span className="font-semibold text-primary">Контакт</span>, назначь
						цену и он автоматически получит сообщение от Blow с предложением
						купить контакт.
					</p>
					<p>Просто, безопасно и выгодно.</p>
					<p>Твоя ценность — твои правила!</p>
					<p className="font-semibold">Важные условия</p>
					<p className="text-primary text-sm">- Срок зачисления денежных средств : 48 часов</p>
					<p className="text-primary text-sm -mt-3">- При обмане либо предоставлении ложной информации : отказ в выплате + блокировка вашей страницы</p>
				</ModalBody>
				<ModalFooter>
					<div className="flex flex-raw w-full gap-3">
						<Button
							className="w-full"
							radius="full"
							onPress={() => {
								onOpenChange();
								onClose();
							}}
						>
							Закрыть
						</Button>
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
