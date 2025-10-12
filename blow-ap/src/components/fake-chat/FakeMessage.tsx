import type { FC } from "react";

import { Avatar, Button, Card, cn, useDisclosure } from "@heroui/react";

import { FakeChatSendModal } from "./FakeChatSendModal";
import { FakeContextModal } from "./FakeContextModal";

import { formatSafeDateWithTime } from "@/helper/formatSafeDate";
import { ENV } from "@/config/env";

type FakeMessageProps = {
  chat: any;
};

export const FakeMessage: FC<FakeMessageProps> = ({ chat }) => {
  const fake = chat?.sender?.isFake ? chat?.sender : chat?.recipient;
  const notFake = chat?.sender?.isFake ? chat?.recipient : chat?.sender;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isChat,
    onOpen: onChat,
    onOpenChange: onOpenChangeChat,
  } = useDisclosure();

  return (
    <div className="relative">
      <p className="text-xs text-gray-500 mb-1">
        {formatSafeDateWithTime(chat?.messages[0]?.createdAt)}
      </p>

      <Card
        className={cn("p-3 px-4", {
          ["bg-success"]: chat?.messages?.length < 2,
        })}
      >
        <div className="grid grid-cols-[80px_150px_1fr] items-center gap-6">
          <div>
            <Avatar
              className="w-20 h-20 text-large cursor-pointer"
              color="secondary"
              name={notFake?.firstName}
              src={`${ENV.MEDIA_URL}/${notFake?.photos[0]?.url}`}
              onClick={() =>
                window.open(`https://blow.ru/account/search/${notFake?._id}`)
              }
            />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-lg">
              {notFake?.firstName || "???"}
            </p>
            <p className="text-xs">{notFake?.email}</p>
            <p>
              {notFake?.age || "???"},{" "}
              <span className="capitalize">{notFake?.city || "???"}</span>
            </p>
          </div>

          <div className="ml-20 -mr-1 bg-zinc-100 h-full rounded-xl p-3">
            <p className="text-sm">{chat?.messages[0]?.text}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Card className="p-3 px-4 flex flex-row gap-3 items-center -mt-2">
          <Avatar
            className="cursor-pointer"
            size="md"
            src={`${ENV.MEDIA_URL}/${fake?.photos[0]?.url}`}
            onClick={() =>
              window.open(`https://blow.ru/account/search/${fake?._id}`)
            }
          />

          <div className="flex flex-col">
            <p className="font-semibold">{fake?.firstName || "???"}</p>
            <p className="text-sm">
              {fake?.age || "???"},{" "}
              <span className="capitalize">{fake?.city || "???"}</span>
            </p>
          </div>

          {chat?.messages?.[1]?.text ? (
            <div className="ml-10 flex flex-col">
              <p className="text-xs text-gray-500">
                {formatSafeDateWithTime(chat?.messages[1].createdAt)}
              </p>
              <p className="text-sm">{chat?.messages[1].text}</p>
            </div>
          ) : null}

          <div className="ml-10 flex gap-3 items-center">
            <Button radius="full" size="sm" variant="flat" onPress={onChat}>
              Контекст
            </Button>
            {chat?.messages[1]?.text ? (
              <Button radius="full" size="sm" onPress={onOpen}>
                Написать
              </Button>
            ) : (
              <Button radius="full" size="sm" onPress={onOpen}>
                Ответить
              </Button>
            )}
          </div>
        </Card>
      </div>

      <FakeChatSendModal
        chatId={chat?._id}
        fakeId={fake?._id}
        isOpen={isOpen}
        notFakeId={notFake?._id}
        onOpenChange={onOpenChange}
      />

      <FakeContextModal
        chatId={chat?._id}
        isOpen={isChat}
        onOpenChange={onOpenChangeChat}
      />
    </div>
  );
};
