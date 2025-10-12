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

interface RecoverySuccessModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const RecoverySuccessModal: FC<RecoverySuccessModalProps> = ({
  isOpen,
  onOpenChange,
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-[20px]">
              Восстановление пароля
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                Ссылка для восстановления пароля отправлена на указанную почту.
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <Button
                  className="w-full"
                  color="primary"
                  radius="full"
                  type="submit"
                  onPress={onClose}
                >
                  Закрыть
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
