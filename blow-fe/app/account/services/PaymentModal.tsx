"use client";

import { ConnectYooMoneyButton } from "@/app/billing/deposit/ConnectButton";
import { useGetMeQuery } from "@/redux/services/userApi";
import {
	Button,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import YoomoneyAuthButton from "./YoomoneyAuthButton";
import { config } from "@/common/env";
import AmountModal from "./AmountModal";

interface PaymentModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const PaymentModal: FC<PaymentModalProps> = ({ isOpen, onOpenChange }) => {
	const { data: me } = useGetMeQuery(null);
	const router = useRouter();

	const {
		isOpen: isAmount,
		onOpen: onAmount,
		onOpenChange: onAmountChange,
	} = useDisclosure();

	return (
		<>
			<Modal
				backdrop="blur"
				className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
				classNames={{
					closeButton: "mr-2.5 mt-2.5",
				}}
				isOpen={isOpen}
				placement="center"
				size="sm"
				onOpenChange={onOpenChange}
				isDismissable={false}
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1 text-[20px] text-center">
						Внесение средств
					</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-5 pb-4">
							<Button
								radius="full"
								size="lg"
								startContent={
									<Image src="/wb.svg" width={20} height={20} radius="none" />
								}
								onPress={() => {
									router.push("https://digital.wildberries.ru/author/53091011");
									onOpenChange();
								}}
							>
								Wildberries
							</Button>
							<Button
								radius="full"
								size="lg"
								startContent={
									<Image src="/ym.png" width={20} height={20} radius="none" />
								}
								onPress={() => { 
									onAmount() 
									onOpenChange()
								}}
							>
								YooMoney
							</Button>
						</div>
					</ModalBody>
					{/* <ModalFooter>
						<div className="flex flex-raw w-full gap-3">
							<Button className="w-full" radius="full" onPress={onOpenChange}>
								Закрыть
							</Button>
						</div>
					</ModalFooter> */}
				</ModalContent>
			</Modal>

			<AmountModal isOpen={isAmount} onOpenChange={onAmountChange} />
		</>
	);
};

export default PaymentModal;
