import { ENV } from "@/config/env";
import { formatSafeDateWithTime } from "@/helper/formatSafeDate";
import { useGetChatQuery } from "@/redux/services/messageApi";
import {
  Avatar,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";

export const FakeContextModal = ({ isOpen, onOpenChange, chatId }: any) => {
  const { data: chat } = useGetChatQuery(chatId);

  return (
    <Modal
      backdrop="blur"
      className="bg-foreground-300 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
      classNames={{
        closeButton: "mt-2.5 mr-2.5",
      }}
      isOpen={isOpen}
      placement="center"
      size="xl"
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-[20px]">
          <div className="flex items-center justify-between gap-3">
            <p className="w-full">Контекст</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div
            className="max-h-[70vh] overflow-y-auto pr-4 -mr-4 min-w-full"
            style={{ scrollbarGutter: "stable both-edges" }} // чтобы не прыгал лэйаут при появлении скролла
          >
            {chat?.map((chat: any) => (
              <>
                <Card className="p-3 px-4 flex flex-col gap-3 mb-3">
                  <div className="flex gap-3 items-center justify-ctart">
                    <Avatar
                      size="md"
                      src={`${ENV.MEDIA_URL}/${chat?.sender?.photos[0]?.url}`}
                      className="cursor-pointer min-w-10"
                      onClick={() =>
                        window.open(
                          `https://kutumba.ru/account/search/${chat?.sender?._id}`
                        )
                      }
                    />

                    <div className="flex flex-col">
                      <p className="font-semibold">
                        {chat?.sender?.firstName || "???"}
                      </p>
                      <p className="text-sm">
                        {chat?.sender?.age || "???"},{" "}
                        <span className="capitalize">
                          {chat?.sender?.city || "???"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {chat?.text ? (
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500">
                        {formatSafeDateWithTime(chat?.createdAt)}
                      </p>
                      <p className="text-sm">{chat?.text}</p>
                    </div>
                  ) : null}
                </Card>
              </>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
