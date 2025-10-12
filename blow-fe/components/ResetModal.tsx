"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa6";

interface ResetModalProps {
  isOpen: boolean;
  onSend: (password: string) => void;
}

export const ResetModal: FC<ResetModalProps> = ({ isOpen, onSend }) => {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [match, setMatch] = useState(true);

  useEffect(() => {
    if (data.password === data.confirmPassword && data.password.length >= 6) {
      setMatch(true);
    } else {
      setMatch(false);
    }
  }, [data.password, data.confirmPassword]);

  const handleSubmit = () => {
    if (!match) return;

    onSend(data.password);
  };

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
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1 text-[20px]">
            Сброс пароля
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-5">
              <Input
                classNames={{
                  input: "bg-transparent dark:text-white",
                  inputWrapper: "dark:bg-foreground-200",
                }}
                placeholder="Пароль"
                radius="full"
                startContent={<FaLock size={14} />}
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <Input
                classNames={{
                  input: "bg-transparent dark:text-white",
                  inputWrapper: "dark:bg-foreground-200",
                }}
                placeholder="Подтверждение пароля"
                radius="full"
                startContent={<FaLock size={14} />}
                type="password"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="text-sm mt-1">
              *Минимальная длинна пароля 6 символов, пароли должны совпадать.
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-col w-full">
              <Button
                className="w-full"
                color={match ? "primary" : "default"}
                disabled={!match}
                radius="full"
                type="submit"
              >
                Сбросить пароль
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
