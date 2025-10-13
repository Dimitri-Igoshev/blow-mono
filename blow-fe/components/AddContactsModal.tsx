"use client";

import { ROUTES } from "@/app/routes";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface AddContactsModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}

export const AddContactsModal: FC<AddContactsModalProps> = ({
	isOpen,
	onOpenChange,
	onClose,
}) => {
	const router = useRouter();

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
                                    Акция! Получите 500₽ на баланс KUTUMBA.RU
				</ModalHeader>
				<ModalBody>
					<p>
						•{" "}
						<NextLink href={ROUTES.ACCOUNT.PROFILE_EDIT}>
							Перейдите в Редактирование Профиля
						</ NextLink>
					</p>
					<p>
						• Загрузите фото в профиль (качественное, четкое) , можно типажное.
					</p>
					<p>
						• <span className="font-semibold">Заполните профиль:</span>
					</p>
					<p>• Имя</p>
					<p>• Город</p>
					<p>• Рост и вес</p>
					<p>• Раздел «О себе»</p>
					<p>• Запишите голосовое сообщение</p>
					<p>
						• Напишите Администрации “Задание выполнено , и ваш E-mail адрес” в
						телеграм <NextLink href="https://t.me/@blowadmin">@blowadmin</ NextLink>
					</p>
					<p>• Дождитесь проверки</p>
				</ModalBody>
				<ModalFooter>
					<div className="flex flex-raw w-full gap-6">
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
					<div className="flex flex-raw w-full gap-3">
						<Button
							className="w-full"
							radius="full"
              color="primary"
							onPress={() => {
                router.push(ROUTES.ACCOUNT.PROFILE_EDIT);
                onOpenChange();
								onClose();
							}}
						>
							К профилю
						</Button>
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
