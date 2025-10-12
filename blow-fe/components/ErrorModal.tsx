"use client";

import { Modal, ModalContent } from "@heroui/react";
import { FC } from "react";

interface LoginModalProps {
  error: string;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const ErrorModal: FC<LoginModalProps> = ({
  error,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Modal
      backdrop="blur"
      className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all p-9"
      classNames={{
        closeButton: "m-3.5",
      }}
      isOpen={isOpen}
      placement="center"
      size="sm"
      onOpenChange={onOpenChange}
    >
      <ModalContent>{(onClose) => <div>{error}</div>}</ModalContent>
    </Modal>
  );
};
