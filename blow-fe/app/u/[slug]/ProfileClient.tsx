"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { Image } from "@heroui/image";
import { MdOutlineHeight } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { Button } from "@heroui/button";
import { PiWaveform } from "react-icons/pi";
import { cn, useDisclosure } from "@heroui/react";
import { config } from "@/common/env";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetMeQuery,
  useNewVisitMutation,
  useUpdateNoteMutation,
  useUpdateUserMutation,
} from "@/redux/services/userApi";
import { getActivityString } from "@/helper/getActivityString";
import { NoteModal } from "@/components/NoteModal";
import { useStartChatMutation } from "@/redux/services/chatApi";
import { isPremium } from "@/helper/checkIsActive";
import { ROUTES } from "@/app/routes";
import { InfoModal } from "@/components/InfoModal";
import { useCreateClaimMutation } from "@/redux/services/claimApi";
import { useCityLabel } from "@/helper/getCityString";
import { maskContacts } from "@/helper/maskContacts";
import useIsBlocked from "@/hooks/useIsBlocked";
import { Note } from "@/app/account/search/[id]/Note";
import Auth from "@/components/Auth";

type ProfileClientProps = {
  profile: any;
  mediaBase?: string; // прокинули с сервера для склейки адресов
};

const ProfileClient: FC<ProfileClientProps> = ({ profile, mediaBase }) => {
  const router = useRouter();

  // user = локальная копия профиля (сохраняем API совместимость твоего кода)
  const [user, setUser] = useState<any>(profile);
  const id = user?._id;

  const { data: me } = useGetMeQuery(null);
  const [newVisit] = useNewVisitMutation();
  const { getCityLabel } = useCityLabel();

  useEffect(() => {
    if (!me?._id || !id) return;

    newVisit({ id, body: { timestamp: new Date(), guest: me._id } })
      .unwrap()
      .catch((err) => console.log(err));

    setNote(me?.notes.find((el: any) => el?._id === id)?.text || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, me?._id]);

  const [currentImage, setCurrentImage] = useState(user?.photos?.[0]?.url);

  const [note, setNote] = useState(
    me?.notes.find((el: any) => el?._id === id)?.text || ""
  );

  const {
    isOpen: isNote,
    onOpen: onNote,
    onOpenChange: onNoteChange,
  } = useDisclosure();

  const [createNote] = useCreateNoteMutation();
  const [editNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const addNote = async (text: string) => {
    if (!text || !me?._id || !id) return;
    if (note) {
      editNote({ id: me?._id, body: { text, userId: id } }).unwrap();
    } else {
      createNote({ id: me?._id, body: { text, userId: id } }).unwrap();
    }
    setNote(text);
  };

  const [claim, setClaim] = useState(false);
  const [createClaim] = useCreateClaimMutation();

  const addClaim = async (text: string) => {
    if (!text || !me?._id || !id) return;
    createClaim({ from: me?._id, text, about: id })
      .unwrap()
      .then(() => {
        setClaim(true);
        onComplainOpenChange();
        onComplainInfoOpen();
      });
  };

  const removeNote = async () => {
    if (!note || !me?._id || !id) return;
    deleteNote({ id: me?._id, body: { userId: id } }).unwrap();
    setNote("");
  };

  const {
    isOpen: isPremiumRequired,
    onOpen: onPremiumRequired,
    onOpenChange: onPremiumRequiredChange,
  } = useDisclosure();

  const {
    isOpen: isRegisterRequired,
    onOpen: onRegisterRequired,
    onOpenChange: onRegisterRequiredChange,
  } = useDisclosure();

  const [startChat] = useStartChatMutation();

  const onSendMessage = async () => {
    if (!me) {
      onRegisterRequired();
      return;
    }
    // } else if (me?.sex === "male" && !isPremium(me)) {
    //   onPremiumRequired();
    //   return;
    // }

    await startChat({ sender: me?._id, recipient: id })
      .unwrap()
      .then((chat: any) => {
        router.push(`${ROUTES.ACCOUNT.DIALOGUES}/${chat._id}`);
      })
      .catch((err) => console.log(err));
  };

  const onOpenNote = () => {
    if (isNote) return;
    onNote();
  };

  const premium = isPremium(me);
  const audioRef = useRef<any>(null);

  const {
    isOpen: isRegistrationRequired,
    onOpen: onRegistrationRequired,
    onOpenChange: onRegistrationRequiredChange,
  } = useDisclosure();

  const mediaUrl = mediaBase || (config as any)?.MEDIA_URL || "";

  const handlePlay = () => {
    if (!me || me?.status !== "active") {
      onRegistrationRequired();
      return;
    }
    if (!premium && me?.sex === "male") {
      onPremiumRequiredVoiceChange();
      return;
    }

    const src = user?.voice ? `${mediaUrl}/${user?.voice}` : "";
    if (!src) return;

    const audio = new Audio(src);
    audio.play().catch((err) => {
      console.error("Ошибка воспроизведения:", err);
    });
  };

  const {
    isOpen: isPremiumRequiredVoice,
    onOpen: onPremiumRequiredVoice,
    onOpenChange: onPremiumRequiredVoiceChange,
  } = useDisclosure();

  const {
    isOpen: isComplainOpen,
    onOpen: onComplainOpen,
    onOpenChange: onComplainOpenChange,
  } = useDisclosure();

  const {
    isOpen: isComplainInfoOpen,
    onOpen: onComplainInfoOpen,
    onOpenChange: onComplainInfoOpenChange,
  } = useDisclosure();

  const isBlocked = useIsBlocked(me, id);
  const [updateBlockList] = useUpdateUserMutation();

  const onBlock = () => {
    if (!me || !id) return;

    let newBlockList: string[] = [];
    if (me?.blockList?.includes(id)) {
      newBlockList = me?.blockList.filter((item: any) => item !== id);
    } else {
      newBlockList = [...(me?.blockList || []), id];
    }
    updateBlockList({ id: me._id, body: { blockList: newBlockList } }).unwrap();
  };

  const [contacts, setContacts] = useState<any>();

  useEffect(() => {
    if (!me) return;

    const contacts = me?.purchasedContacts?.find((i: any) => i.user === id);
    if (contacts) setContacts(contacts);
  }, [me, id]);

  const getContact = () => {
    const contacts = me?.purchasedContacts?.filter((i: any) => i.user === id);
    const contact = contacts?.length ? contacts[contacts?.length - 1] : null;

    if (contact?.whatsapp) return `WhatsApp: ${contact?.whatsapp}`;
    if (contact?.telegram) return `Telegram: ${contact?.telegram}`;
    if (contact?.phone) return `Телефон: ${contact?.phone}`;

    return "";
  };

  const [registrationSignal, setRegistrationSignal] = useState(0);
  const triggerRegistration = () => setRegistrationSignal(Date.now());

  // ---- SEO/доступность: человеко-понятные названия/alt ----
  const displayName = user?.firstName
    ? user.firstName
    : user?.sex === "male"
    ? "Мужчина"
    : "Девушка";
  const displayTitle = `${displayName}${user?.age ? `, ${user.age}` : ""}`;

  return (
    <div
      className={cn(
        "flex w-full flex-col px-3 sm:px-9 gap-[30px] min-h-screen",
        { "pt-[70px]": me, "sm:pt-[80px]": !me }
      )}
    >
      {user && user?.status === "active" ? (
        <>
          <div className="flex w-full items-center justify-between">
            <div>
              <Button
                className="w-full z-0 relative"
                radius="full"
                aria-label="Назад к результатам поиска"
                onPress={() => router.push(ROUTES.ACCOUNT.SEARCH)}
              >
                Назад к результатам
              </Button>
            </div>
          </div>

          <div className="w-full grid grid-cols-12 sm:gap-9">
            {/* LEFT */}
            <div className="col-span-12 sm:col-span-6 flex flex-col">
              <div className="overflow-hidden relative rounded-[36px]">
                <Image
                  alt={displayTitle || "Фото профиля"}
                  className="z-0 relative"
                  radius="none"
                  src={
                    currentImage || user?.photos?.[0]?.url
                      ? `${mediaUrl}${currentImage || user?.photos?.[0]?.url}`
                      : user?.sex === "male"
                      ? "/men2.png"
                      : "/woman2.png"
                  }
                  width={"100%"}
                  height={"100%"}
                />
              </div>

              {Array.isArray(user?.photos) && user.photos.length ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 mb-6 sm:mb-0 gap-4 w-full mt-4">
                  {user?.photos.map((item: any) => (
                    <button
                      type="button"
                      key={item.url || item}
                      className="overflow-hidden relative rounded-[24px]"
                      onClick={() => setCurrentImage(item.url || item)}
                      aria-label="Открыть фото"
                    >
                      <Image
                        alt={`${displayName}: фото`}
                        className="z-0 relative object-cover min-w-full object-center"
                        height={"100%"}
                        radius="none"
                        src={
                          item?.url
                            ? `${mediaUrl}${item.url}`
                            : user?.sex === "male"
                            ? "/men2.png"
                            : "/woman2.png"
                        }
                        width={"100%"}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <div className="col-span-12 sm:col-span-6 bg-white dark:bg-foreground-100 rounded-[36px] p-6 py-9 sm:p-[36px] flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start gap-6 owerflow-hidden w-full">
                  <div className="flex flex-col -mt-3">
                    <div className="flex lg:hidden gap-1.5 items-center" aria-live="polite">
                      {getActivityString(user?.activity) === "онлайн" ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <p className="-mt-[2px] text-[12px] hidden sm:flex">сейчас онлайн</p>
                        </>
                      ) : (
                        <p className="-mt-[2px] text-[12px]">
                          {getActivityString(user?.activity)}
                        </p>
                      )}
                    </div>

                    {/* H1 — основной заголовок страницы профиля */}
                    <h1 className="font-semibold line-clamp-1 text-[24px] xl:text-[36px]">
                      {displayTitle}
                    </h1>

                    <p className="text-[18px] xl:text-[24px]">
                      {user?.age ? `${user.age}, ` : ""}
                      {getCityLabel(user?.city)}
                    </p>
                  </div>

                  <div className="hidden lg:flex gap-1.5 items-center flex-nowrap min-w-[110px]" aria-live="polite">
                    {getActivityString(user?.activity) === "онлайн" ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <p className="-mt-[2px] text-[12px] hidden sm:flex">сейчас онлайн</p>
                      </>
                    ) : (
                      <p className="-mt-[2px] text-[12px]">
                        {getActivityString(user?.activity)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 -ml-1.5">
                  <div className="flex items-center gap-1">
                    <MdOutlineHeight className="w-[20px] text-primary" size={20} />
                    <p>рост - {user?.height} см </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <GiWeight className="w-[18px] text-primary" size={18} />
                    <p>вес - {user?.weight} кг</p>
                  </div>
                </div>

                {user?.voice ? (
                  <div>
                    <button
                      onClick={handlePlay}
                      className="bg-primary text-white rounded-full h-[38px] px-3.5 flex gap-1 items-center"
                      aria-label="Проиграть голосовое"
                    >
                      <PiWaveform className="w-5 h-5" />
                      <p>Голос</p>
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-col gap-1 pt-6">
                  <p className="font-semibold text-[20px]">Цели знакомства</p>
                  <ul className="list-disc leading-9 mt-1 ml-5 text-[16px]">
                    {user.sponsor ? (
                      <li>{user?.sex === "male" ? "стану спонсором" : "ищу спонсора"}</li>
                    ) : null}
                    {user.relationships ? <li>серьезные отношения</li> : null}
                    {user.evening ? <li>провести вечер</li> : null}
                    {user.traveling ? <li>совместные путешествия</li> : null}
                  </ul>
                </div>

                <div className="flex flex-col gap-1 pt-6">
                  <p className="font-semibold text-[20px]">О себе</p>
                  <p className="mt-1">
                    {user?.about && user.about !== "undefined"
                      ? maskContacts(user?.about, false)
                      : "Пользователь предпочел не указывать информацию о себе."}
                  </p>
                </div>

                {getContact() ? (
                  <div className="flex flex-col gap-1 pt-6">
                    <p className="font-semibold text-[20px]">Контакт</p>
                    <p className="mt-1">{getContact()}</p>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {note ? (
                  <div className="grid col-span-1 sm:col-span-2 gap-6 mt-6 w-full">
                    <Note text={note} onDelete={removeNote} />
                  </div>
                ) : null}

                {me ? (
                  <>
                    <Button
                      className="z-0 relative"
                      color="secondary"
                      radius="full"
                      variant="solid"
                      onPress={onNote}
                    >
                      {note ? "Редактировать заметку" : "Создать заметку"}
                    </Button>

                    <Button
                      className="z-0 relative"
                      color="secondary"
                      radius="full"
                      variant="solid"
                      onPress={onBlock}
                    >
                      {isBlocked ? "Разблокировать" : "Заблокировать"}
                    </Button>
                  </>
                ) : null}

                <Button
                  className="z-0 relative"
                  color="primary"
                  radius="full"
                  variant="solid"
                  onPress={onSendMessage}
                >
                  Написать сообщение
                </Button>

                {!claim && me && me?._id !== user?._id ? (
                  <Button
                    className="z-0 relative"
                    color="secondary"
                    radius="full"
                    variant="solid"
                    onPress={onComplainOpen}
                  >
                    Пожаловаться
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="flex w-full items-center justify-between">
            <div>
              <Button
                className="w-full z-0 relative"
                radius="full"
                aria-label="Назад к результатам поиска"
                onPress={() => router.push(ROUTES.ACCOUNT.SEARCH)}
              >
                Назад к результатам
              </Button>
            </div>
          </div>

          <div className="w-full h-full mt-20 flex justify-center px-6 sm:px-20">
            <p className="sm:text-[20px] text-center">
              Анкета была удалена пользователем или администрацией за нарушение
              правил платформы.
            </p>
          </div>
        </div>
      )}

      {/* модалки */}
      <NoteModal
        isOpen={isNote}
        note={note}
        onOpenChange={onNoteChange}
        onSave={(text: string) => addNote(text)}
      />

      <NoteModal
        isOpen={isComplainOpen}
        onOpenChange={onComplainOpenChange}
        isClaim
        note=""
        onSave={(text: string) => addClaim(text)}
      />

      {/* <InfoModal
        actionBtn="Купить"
        isOpen={isPremiumRequired}
        text={
          "Для того чтобы общаться с девушками, Вам нужно купить премиум подписку"
        }
        title={"Нужен премиум"}
        onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
        onOpenChange={onPremiumRequiredChange}
      /> */}

      <InfoModal
        isOpen={isRegisterRequired}
        text={
          "Для того чтобы начать общаться, Вам нужно зарегистрироваться на сайте"
        }
        title={"Нужна регистрация"}
        actionBtn="Регистрация"
        onAction={() => {
          triggerRegistration();
          onRegisterRequiredChange();
        }}
        onOpenChange={onRegisterRequiredChange}
      />

      <InfoModal
        actionBtn="Купить"
        isOpen={isPremiumRequiredVoice}
        text={
          "Для того чтобы получить доступ к прослушиванию голоса, Вам нужно купить премиум подписку"
        }
        title={"Нужен премиум"}
        onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
        onOpenChange={onPremiumRequiredVoiceChange}
      />

      <InfoModal
        isOpen={isRegistrationRequired}
        text={
          "Для того чтобы получить доступ к прослушиванию голоса, Вам нужна регистрация и премиум подписка"
        }
        title={"Нужны регистрация и премиум"}
        onOpenChange={onRegistrationRequiredChange}
        actionBtn="Регистрация"
        onAction={() => {
          triggerRegistration();
          onRegistrationRequiredChange();
        }}
      />

      <InfoModal
        isOpen={isComplainInfoOpen}
        text={"Ваша жалоба принята и будет рассмотрена в ближайшее время"}
        title={"Жалоба"}
        onOpenChange={onComplainInfoOpenChange}
      />

      <Auth registrationSignal={registrationSignal} />
    </div>
  );
};

export default ProfileClient;
