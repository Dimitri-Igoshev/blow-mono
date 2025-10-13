"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { FC } from "react";
import YoomoneyAuthButton from "./YoomoneyAuthButton";
import { useGetMeQuery } from "@/redux/services/userApi"

interface AmountModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const AmountModal: FC<AmountModalProps> = ({ isOpen, onOpenChange }) => {
  const { data: me } = useGetMeQuery(null)

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
            Сумма платежа
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-5 pb-4">
              <YoomoneyAuthButton
								amount={100}
								label={me?._id}
								targets="Пополнение BLOW"
								receiver="4100119320198570"
								successURL="https://kutumba.ru/account/services"
							/>
							<YoomoneyAuthButton
								amount={500}
								label={me?._id}
								targets="Пополнение BLOW"
								receiver="4100119320198570"
								successURL="https://kutumba.ru/account/services"
							/>
							<YoomoneyAuthButton
								amount={1000}
								label={me?._id}
								targets="Пополнение BLOW"
								receiver="4100119320198570"
								successURL="https://kutumba.ru/account/services"
							/>
							<YoomoneyAuthButton
								amount={2000}
								label={me?._id}
								targets="Пополнение BLOW"
								receiver="4100119320198570"
								successURL="https://kutumba.ru/account/services"
							/>
							<YoomoneyAuthButton
								amount={5000}
								label={me?._id}
								targets="Пополнение BLOW"
								receiver="4100119320198570"
								successURL="https://kutumba.ru/account/services"
							/>
							<YoomoneyAuthButton
								amount={10000}
								label={me?._id}
								targets="Пополнение BLOW"
								receiver="4100119320198570"
								successURL="https://kutumba.ru/account/services"
							/>
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
    </>
  );
};

export default AmountModal;
