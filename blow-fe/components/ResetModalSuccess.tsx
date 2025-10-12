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
import { useRouter } from "next/navigation";

import { ROUTES } from "@/app/routes";

interface ResetModalSuccessProps {
  isOpen: boolean;
}

export const ResetModalSuccess: FC<ResetModalSuccessProps> = ({ isOpen }) => {
  const router = useRouter();

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
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-[20px]">
          Сброс пароля
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-5">
            Ваш пароль изменен успешно! Зайдите в свой профиль используя новый
            пароль.
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col w-full">
            <Button
              className="w-full"
              color="primary"
              radius="full"
              type="submit"
              onPress={() => router.push(ROUTES.HOME)}
            >
              На главную
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
