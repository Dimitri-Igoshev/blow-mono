"use client";

import { cn, Tab, Tabs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import NextLink from "next/link";

import { ROUTES } from "../routes";
import WrapperEmailConf from "./WrapperEmailConf";

import { SearchWidget } from "@/components/search-widget";
import { useGetMeQuery } from "@/redux/services/userApi";
import { useGetChatsQuery } from "@/redux/services/chatApi";
import { useGetMailingsQuery } from "@/redux/services/mailingApi";

function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [tab, setTab] = useState("profile");
  const { data: me } = useGetMeQuery(null);
  const { data: mailings } = useGetMailingsQuery(null);

  const isSearch =
    pathname === ROUTES.ACCOUNT.SEARCH ||
    pathname.includes(ROUTES.ACCOUNT.CITY);
  const isChat = pathname.includes(ROUTES.ACCOUNT.DIALOGUES);

  useEffect(() => {
    switch (pathname) {
      case ROUTES.ACCOUNT.SEARCH:
        setTab("search");
        return;
      case ROUTES.ACCOUNT.GUESTS:
        setTab("guests");
        return;
      case ROUTES.ACCOUNT.MAILINGS:
        setTab("mailings");
        return;
      case ROUTES.ACCOUNT.PROFILE:
        setTab("profile");
        return;
      case ROUTES.ACCOUNT.SERVICES:
        setTab("services");
        return;
      case ROUTES.ACCOUNT.NOTES:
        setTab("notes");
        return;
      default:
        setTab("search");
    }

    if (pathname.includes(ROUTES.ACCOUNT.DIALOGUES)) {
      setTab("dialogues");
    }
  }, [pathname]);

  const { data: chats } = useGetChatsQuery(me?._id, {
    skip: !me?._id,
  });

  const [unreaded, setUnreaded] = useState<number>(0);

  useEffect(() => {
    if (!chats) return;

    let quantity = 0;
    chats?.forEach((item: any) => {
      item?.messages?.forEach((message: any) => {
        if (
          message?.sender !== me?._id &&
          message?.unreadBy?.find((i: string) => i === me?._id)
        ) {
          quantity += 1;
        }
      });
    });

    setUnreaded(quantity);
  }, [chats, me?._id]);

  return (
    <div className={cn("", { ["max-h-screen sm:max-h-auto"]: isChat })}>
      <div className="relative">
        <img
          alt=""
          className={cn(
            "hidden sm:flex rounded-b-[50px] flex-col z-10 w-full object-cover",
            {
              "h-[300px] sm:h-[440px] xl:h-[350px]": isSearch && me,
              "h-[300px] sm:h-[440px] xl:h-[262px]": isSearch && !me,
              "sm:h-[210px] fixed": !isSearch,
            }
          )}
          src={isSearch ? "/bg.png" : "/bg-min.png"}
        />

        <img
          alt=""
          className={cn(
            "flex sm:hidden rounded-b-[50px] flex-col absolute z-20 w-full object-cover z-10",
            {
              "h-[434px]": isSearch,
              hidden: !isSearch,
            }
          )}
          src={isSearch ? "/bg-m.png" : "/bg-min.png"}
        />

        <div
          className={cn(
            "absolute z-10 px-3 sm:px-9 top-[96px] mt-0 sm:mt-[30px] w-full",
            {
              ["sm:fixed"]: !isSearch,
            }
          )}
        >
          {me ? (
            <div className="sm:mb-[40px]">
              <Tabs
                fullWidth
                aria-label="Tabs"
                className={cn("", {
                  ["mb-9 sm:mb-0"]: isSearch,
                })}
                classNames={{
                  tabContent: "text-white",
                }}
                radius="full"
                selectedKey={tab}
                variant="bordered"
              >
                <Tab key="search" href={ROUTES.ACCOUNT.SEARCH} title="Поиск анкет" />
                <Tab key="profile" href={ROUTES.ACCOUNT.PROFILE} title="Профиль" />
                <Tab
                  key="dialogues"
                  href={ROUTES.ACCOUNT.DIALOGUES + "1"}
                  title={
                    <div className="flex w-full justify-between items-center gap-3">
                      <span>Диалоги</span>
                      {unreaded ? (
                        <div className="w-4 min-w-4 h-4 rounded-full bg-primary text-white text-[8px] flex font-semibold justify-center items-center">
                          {unreaded}
                        </div>
                      ) : null}
                    </div>
                  }
                />
                <Tab key="guests" href={ROUTES.ACCOUNT.GUESTS} title="Кто смотрел" />
                <Tab key="services" href={ROUTES.ACCOUNT.SERVICES} title="Услуги" />
                <Tab key="notes" href={ROUTES.ACCOUNT.NOTES} title="Заметки" />
                <Tab
                  key="mailings"
                  href={ROUTES.ACCOUNT.MAILINGS}
                  title={
                    <div className="flex w-full justify-between items-center gap-3">
                      <span>Рассылки</span>
                      {mailings?.[0]?._id &&
                      (!me?.lastMailing || me?.lastMailing !== mailings?.[0]?._id) ? (
                        <div className="w-4 min-w-4 h-4 rounded-full bg-primary text-white text-[8px] flex font-semibold justify-center items-center">
                          !
                        </div>
                      ) : null}
                    </div>
                  }
                />
              </Tabs>
            </div>
          ) : null}

          {isSearch ? (
            <div className="flex w-full justify-center md:justify-start items-center gap-9">
              <SearchWidget horizontal />
              <p className="hidden md:flex xl:hidden text-white text-[26px] lg:text-[36px] font-semibold">
                Поиск лучших содержанок и самых успешных мужчин
              </p>
            </div>
          ) : null}

          {isSearch ? (
            <h2 className="block sm:hidden mt-[20px] text-[26px] text-white font-semibold z-20 relative text-center">
              Результаты поиска
            </h2>
          ) : null}
        </div>

        <div className="pt-[100px] sm:pt-[160px] pb-[50px]">
          <WrapperEmailConf>{children}</WrapperEmailConf>
        </div>

        <footer className="bg-gray dark:bg-black w-full">
          <div className="bg-dark rounded-t-[50px] px-3 sm:px-12 py-[28px] grid grid-cols-1 sm:grid-cols-3 text-white items-center text-xs sm:text-base">
            <div className="sm:hidden flex justify-center">
              <Image alt="BLOW" height={40} radius="none" src="/logo.png" width={101} />
            </div>
            <p className="text-center sm:text-left mt-5 sm:mt-0 text-xs">
              {new Date().getFullYear()} © BLOW
            </p>
            <div className="hidden sm:flex justify-center">
              <Image alt="BLOW" height={40} radius="none" src="/logo.png" width={101} />
            </div>
            <div className="text-xs mt-7 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-6">
              <NextLink
							className="underline cursor-pointer hover:text-primary text-nowrap"
							href={ROUTES.ARTICLES}
						>
							Статьи
						</NextLink>
              <NextLink
                href={ROUTES.CONTACTS}
                className="underline cursor-pointer hover:text-primary text-nowrap"
              >
                Свяжись с нами
              </NextLink>
              <NextLink
                href={ROUTES.POLICY}
                className="underline cursor-pointer hover:text-primary text-nowrap"
              >
                Политики
              </NextLink>
              <NextLink
                href={ROUTES.OFFER}
                className="underline cursor-pointer hover:text-primary text-nowrap"
              >
                Договор оферта
              </NextLink>
              <NextLink
                href={ROUTES.RULES}
                className="underline cursor-pointer hover:text-primary text-nowrap"
              >
                Правила
              </NextLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ClientLayout;
