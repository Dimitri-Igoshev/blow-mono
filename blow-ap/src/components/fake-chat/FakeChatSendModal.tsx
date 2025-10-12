import { useCreateMessageMutation } from "@/redux/services/messageApi";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useState } from "react";

export const FakeChatSendModal = ({
  isOpen,
  onOpenChange,
  chatId,
  fakeId,
  notFakeId,
}: any) => {
  const [text, setText] = useState("");

  const [send] = useCreateMessageMutation();

  const onSend = async () => {
    if (!text) return;

    send({
      sender: fakeId,
      recipient: notFakeId,
      text,
    })
      .unwrap()
      .finally(() => {
        setText("");
        onOpenChange(false)
      });
  };

  return (
    <Modal
      backdrop="blur"
      className="bg-foreground-300 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
      classNames={{
        closeButton: "mt-2.5 mr-2.5",
      }}
      isOpen={isOpen}
      placement="center"
      size="sm"
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-[20px] text-center">
          <div className="flex justify-between gap-3">
            <p className="w-full">Сообщение</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <Textarea
            className="w-full"
            placeholder="Текст сообщения"
            value={text}
            onValueChange={(value: string) => setText(value)}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-raw w-full gap-3">
            {/* <Button className="w-full" radius="full" onPress={onOpenChange}>
              Закрыть
            </Button> */}
            <Button
              className="w-full"
              radius="full"
              color="primary"
              onPress={onSend}
            >
              Отправить
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
