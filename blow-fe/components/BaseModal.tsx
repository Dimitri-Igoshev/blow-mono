"use client";

import { cn, Modal, ModalContent } from "@heroui/react";
import { FunctionComponent, ReactNode } from "react";

interface BaseModalProps {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onOpenChange: () => void;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "full"
    | "xl"
    | "xs"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | undefined;
}

const BaseModal: FunctionComponent<BaseModalProps> = ({
  children,
  className = "",
  isOpen,
  onOpenChange,
  size = "md",
}) => {
  return (
    <Modal
      closeButton
      backdrop="blur"
      className={cn("m-3", className)}
      classNames={{
        closeButton: "m-3.5",
      }}
      isOpen={isOpen}
      placement="center"
      size={size}
      onOpenChange={onOpenChange}
    >
      <ModalContent>{(onClose) => children}</ModalContent>
    </Modal>
  );
};

export default BaseModal;
