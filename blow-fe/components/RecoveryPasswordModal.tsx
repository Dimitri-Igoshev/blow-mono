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
import { FC, useState } from "react";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import Loader from "./Loader";

import { useRecoveryPasswordMutation } from "@/redux/services/authApi";

type Inputs = {
  email: string;
  password: string;
};

interface RecoveryPasswordModalProps {
  isOpen: boolean;
  onSend: () => void;
  onOpenChange: () => void;
}

export const RecoveryPasswordModal: FC<RecoveryPasswordModalProps> = ({
  isOpen,
  onSend,
  onOpenChange,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);

  const [recovery] = useRecoveryPasswordMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const body: any = {
      email: data.email,
    };

    recovery(body)
      .unwrap()
      .then((res) => {
        onSend();
        onOpenChange();
        setIsLoading(false);
      })
      .catch((error: any) => console.log(error))
      .finally(() => {
        onOpenChange();
        setIsLoading(false);
      });
  };

  return (
    <Modal
      backdrop="blur"
      className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
      classNames={{
        closeButton: `m-3.5 ${isLoading && "hidden"}`,
      }}
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      size="sm"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {isLoading ? (
              <Loader modal save />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1 text-[20px]">
                  Восстановление пароля
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-5">
                    <Input
                      classNames={{
                        input: "bg-transparent dark:text-white",
                        inputWrapper: "dark:bg-foreground-200",
                      }}
                      placeholder="E-mail"
                      radius="full"
                      startContent={<MdEmail />}
                      type="email"
                      {...register("email", {
                        required: { value: true, message: "Обязательное поле" },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Невалидный emaill",
                        },
                      })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex flex-col w-full">
                    <Button
                      className="w-full"
                      color="primary"
                      radius="full"
                      type="submit"
                    >
                      Отправить
                    </Button>
                  </div>
                </ModalFooter>
              </form>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
