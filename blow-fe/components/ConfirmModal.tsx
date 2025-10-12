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

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  text: string;
  onAction?: () => void;
  actionBtn?: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  text,
  onAction,
  actionBtn,
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
              {title}
            </ModalHeader>
            <ModalBody>
              <div>{text}</div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-raw w-full gap-3">
                <Button className="w-full" radius="full" onPress={onClose}>
                  Закрыть
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
