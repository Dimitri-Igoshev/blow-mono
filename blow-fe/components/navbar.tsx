"use client";

import {
	Navbar as HeroUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";
import { Avatar, cn, useDisclosure } from "@heroui/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { RiCloseFill, RiMegaphoneLine, RiMenu4Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";

import { RegisterModal } from "./register-modal";
import { LoginModal } from "./login-modal";
import { EmailModal } from "./email-password";
import { ErrorModal } from "./ErrorModal";
import { RecoveryPasswordModal } from "./RecoveryPasswordModal";
import { RecoverySuccessModal } from "./RecoverySuccesModal";
import { ConfirmationModal } from "./ConfirmationModal";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { ROUTES } from "@/app/routes";
import {
	useGetMeQuery,
	useSetActivityMutation,
} from "@/redux/services/userApi";
import { config } from "@/common/env";
import { CameraIcon } from "@/common/icons";
import { isPremium } from "@/helper/checkIsActive";
import { LiaCrownSolid } from "react-icons/lia";
import { ru } from "date-fns/locale";
import { format } from "date-fns";
import { FiMessageCircle } from "react-icons/fi";
import { BsMegaphone } from "react-icons/bs";
import { useGetChatsQuery } from "@/redux/services/chatApi";
import { useGetMailingsQuery } from "@/redux/services/mailingApi";
import { InfoModal } from "./InfoModal";
import { useSession } from "@/hooks/useSession";
import { AddContactsModal } from "./AddContactsModal";

export const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();

	const isConfirmPage = pathname.includes("confirm");
	const isServicesPage = pathname.includes("services");

	const [newUser, setNewUser] = useState(null);

	const { data: me, isFetching } = useGetMeQuery(null);

	useSession(me?._id);

	// const [setActivity] = useSetActivityMutation();

	// useEffect(() => {
	// 	if (!me?._id) return;

	// 	let debounce = 0;

	// 	const activityHandler = () => {
	// 		events.forEach((event) =>
	// 			window.removeEventListener(event, activityHandler)
	// 		);
	// 		setTimeout(() => {
	// 			setActivity({ id: me._id, body: { timestamp: new Date() } })
	// 				.unwrap()
	// 				.catch((err) => console.error(err));

	// 			events.forEach((event) =>
	// 				window.addEventListener(event, activityHandler)
	// 			);

	// 			debounce = 60000;
	// 		}, debounce);
	// 	};

	// 	const events = ["mousemove", "keydown", "click"];

	// 	events.forEach((event) => window.addEventListener(event, activityHandler));

	// 	return () => {
	// 		events.forEach((event) =>
	// 			window.removeEventListener(event, activityHandler)
	// 		);
	// 	};
	// }, [me]);

	useEffect(() => {
		if (!me) return;

		if (me.status === "new" && !isConfirmPage) onConfirmationRequired();

		if (me.status !== "active" && me.status !== "new") {
			onInfoBlocked();
		}
	}, [me]);

	const {
		isOpen: isLogin,
		onOpen: onLogin,
		onOpenChange: onLoginChange,
	} = useDisclosure();
	const {
		isOpen: isRegister,
		onOpen: onRegister,
		onOpenChange: onRegisterChange,
	} = useDisclosure();
	const {
		isOpen: isEmail,
		onOpen: onEmail,
		onOpenChange: onEmailChange,
	} = useDisclosure();
	const {
		isOpen: isError,
		onOpen: onError,
		onOpenChange: onErrorChange,
	} = useDisclosure();
	const {
		isOpen: isRecovery,
		onOpen: onRecovery,
		onOpenChange: onRecoveryChange,
	} = useDisclosure();
	const {
		isOpen: isRecoverySuccess,
		onOpen: onRecoverySuccess,
		onOpenChange: onRecoverySuccessChange,
	} = useDisclosure();
	const {
		isOpen: isConfirmationRequired,
		onOpen: onConfirmationRequired,
		onOpenChange: onConfirmationRequiredChange,
	} = useDisclosure();
	const {
		isOpen: isInfoBlocked,
		onOpen: onInfoBlocked,
		onOpenChange: onInfoBlockedChange,
	} = useDisclosure();

	const onNext = (value: any) => {
		setNewUser(value);
		onEmail();
	};

	useEffect(() => {
		if (isServicesPage && !isFetching && !me) {
			onLogin();
		}
	}, [isFetching]);

	const [error, setError] = useState("");

	const handleError = (error: string) => {
		console.log("error", error);
		setError(error);
		onError();
	};

	const registration = () => {};

	const [mobileMenu, setMobileMenu] = useState(false);

	const logout = () => {
		localStorage.setItem("access-token", "");
		router.replace(ROUTES.HOME);
		window.location.reload();
	};

	useEffect(() => {
		if (mobileMenu) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [mobileMenu]);

	const getPremiumTime = () => {
		return `до ${format(
			new Date(
				me.services.find(
					(item: any) => item._id === "6831be446c59cd4bad808bb5"
				).expiredAt
			),
			"dd.MM.yyyy, HH:mm",
			{
				locale: ru,
			}
		)}`;
	};

	const { data: chats, refetch } = useGetChatsQuery(me?._id, {
		skip: !me?._id,
	});
	const { data: mailings } = useGetMailingsQuery(null, {
		skip: !me?._id,
	});

	const [unreaded, setUnreaded] = useState<number>(0);

	useEffect(() => {
		if (!chats) return;

		let quantity = 0;

		// chats?.forEach((item: any) => {
		// 	item?.messages?.forEach((message: any) => {
		// 		if (message?.sender !== me?._id && message.isReaded === false) {
		// 			quantity += 1;
		// 		}
		// 	});
		// });

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
	}, [chats]);

	useEffect(() => {
		if (!me) return;

		const interval = setInterval(() => {
			refetch();
		}, 60000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const {
		isOpen: isAddContactPromo,
		onOpen: onAddContactPromo,
		onOpenChange: onAddContactPromoChange,
	} = useDisclosure();

	useLayoutEffect(() => {
		const isAddContactViewed =
			typeof window !== "undefined" &&
			localStorage.getItem("isAddContactViewed") === "true";

		if (me && !isAddContactViewed) {
			setTimeout(() => {
				onAddContactPromo();
			}, 3000);
		}
	}, [me]);

	const addContactPromoViewed = () => {
		localStorage.setItem("isAddContactViewed", "true");
	};

	const hasAllContacts =
		me?.firstName &&
		me?.age &&
		me?.height &&
		me?.weight &&
		me?.photos?.[0]?.url &&
		me?.about &&
		me?.voice;

	return (
		<>
			<HeroUINavbar
				className={cn("p-0 md:p-3 fixed bg-transparent", {
					["hidden"]: pathname?.includes("promo"),
				})}
				isBlurred={true}
				maxWidth="full"
				position="sticky"
			>
				<NavbarContent className="basis-1/5 md:basis-full" justify="start">
					<NavbarBrand as="li" className="gap-3 max-w-fit">
						<NextLink
							className="flex justify-start items-center gap-1"
							href="/"
							onClick={() => {
								document.body.style.overflow = ""; // сброс overflow
							}}
						>
							<Image
								alt="BLOW"
								className="w-[102px] md:w-[127px] h-[40px] md:h-[50px]"
								radius="none"
								src="/logo.png"
							/>
						</NextLink>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent
					className="hidden md:flex basis-1/5 md:basis-full"
					justify="end"
				>
					{/* <SearchIcon
            className="text-white cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          /> */}

					{me && me?.status === "active" ? (
						<>
							<button
								className="relative"
								onClick={() => router.push(ROUTES.ACCOUNT.MAILINGS)}
							>
								<RiMegaphoneLine color="white" size={20} />
								{mailings?.[0]?._id &&
								(!me?.lastMailing || me?.lastMailing !== mailings?.[0]?._id) ? (
									<div className="absolute top-px right-px w-2 h-2 rounded-full bg-primary"></div>
								) : null}
							</button>

							<a
								className="relative sm:mr-6"
								href={ROUTES.ACCOUNT.DIALOGUES + "1"}
								// onClick={() => router.push(ROUTES.ACCOUNT.DIALOGUES + "1")}
							>
								<FiMessageCircle color="white" size={20} />
								{unreaded ? (
									<div className="absolute top-px right-px w-2 h-2 rounded-full bg-primary" />
								) : null}
							</a>
						</>
					) : null}

					<ThemeSwitch className="mr-6" />

					{me?._id && me?.status === "active" ? (
						<>
							<NavbarItem
								className="hidden md:flex cursor-pointer"
								onClick={() => router.push(ROUTES.ACCOUNT.PROFILE)}
							>
								<div className="flex items-center gap-3">
									<p className="text-white hover:underline">
										{me?.firstName
											? me.firstName
											: me?.sex === "male"
												? "Мужчина"
												: "Девушка"}
									</p>
									<div className="rounded-full border-white relative">
										{isPremium(me) ? (
											// <FaCrown className="text-[24px] text-white absolute -top-[14px] left-2 z-0" />
											<img
												alt="premium"
												className="min-w-[48px] h-[62px] absolute -top-[8px] -right-[4px] z-0"
												src="/blw-r.png"
											/>
										) : null}
										<Avatar
											showFallback
											// isBordered={isPremium(me)}
											fallback={
												<CameraIcon
													className="animate-pulse w-6 h-6 text-default-500"
													fill="currentColor"
													size={20}
												/>
											}
											src={
												me?.photos[0]?.url
													? `${config.MEDIA_URL}/${me?.photos[0]?.url}`
													: me?.sex === "male"
														? "/men.jpg"
														: "/woman.jpg"
											}
										/>
									</div>
								</div>
							</NavbarItem>
						</>
					) : (
						<>
							<NavbarItem className="hidden md:flex">
								<Button
									className="text-sm px-6"
									radius="full"
									variant="solid"
									onPress={onLogin}
								>
									Вход
								</Button>
							</NavbarItem>
							<NavbarItem className="hidden md:flex">
								<Button
									className="text-sm  bg-primary text-white px-6"
									radius="full"
									variant="solid"
									onPress={onRegister}
								>
									Регистрация
								</Button>
							</NavbarItem>
						</>
					)}
				</NavbarContent>

				<NavbarContent className="md:hidden basis-1 pl-4" justify="end">
					{me && me?.status === "active" ? (
						<>
							<button
								className="relative"
								onClick={() => router.push(ROUTES.ACCOUNT.MAILINGS)}
							>
								<RiMegaphoneLine color="white" size={32} />
								{mailings?.[0]?._id &&
								(!me?.lastMailing || me?.lastMailing !== mailings?.[0]?._id) ? (
									<div className="absolute top-px right-px w-3 h-3 rounded-full bg-primary"></div>
								) : null}
							</button>

							<a
								className="relative mr-10"
								// onClick={() => router.push(ROUTES.ACCOUNT.DIALOGUES + "1")}
								href={ROUTES.ACCOUNT.DIALOGUES + "1"}
							>
								<FiMessageCircle color="white" size={32} />
								{unreaded ? (
									<div className="absolute top-px right-px w-3 h-3 rounded-full bg-primary" />
								) : null}
							</a>
						</>
					) : null}
					<button onClick={() => setMobileMenu(true)}>
						<RiMenu4Fill color="white" size={32} />
					</button>
				</NavbarContent>

				{/* Мобильное меню */}
				{/* <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu> */}
			</HeroUINavbar>

			{mobileMenu ? (
				<div className="h-screen w-screen fixed top-0 left-0 bottom-0 right-0 bg-white dark:bg-dark z-40 flex flex-col gap-3 p-3 px-5">
					<div className="flex justify-between">
						<ThemeSwitch className="" />
						<p className="text-[20px] font-semibold mt-[2px]">Меню</p>

						<RiCloseFill size={36} onClick={() => setMobileMenu(false)} />
					</div>

					{isPremium(me) ? (
						<div className="flex justify-between items-center mt-4">
							<div className="flex items-center gap-1 text-primary">
								<LiaCrownSolid />
								<p className="font-semibold ">Premium</p>
							</div>
							<p className="text-xs">{getPremiumTime()}</p>
						</div>
					) : null}

					{me && me?.status === "active" ? (
						<ul className="flex flex-col items-start gap-3 text-[18px] mt-4">
							<button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.SEARCH);
									setMobileMenu(false);
								}}
							>
								Поиск анкет
							</button>
							<button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.PROFILE);
									setMobileMenu(false);
								}}
							>
								Профиль
							</button>
							<a
								href={ROUTES.ACCOUNT.DIALOGUES + "1"}
								onClick={() => {
									// router.push(ROUTES.ACCOUNT.DIALOGUES + "1");
									setMobileMenu(false);
								}}
							>
								Диалоги
							</a>
							<button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.GUESTS);
									setMobileMenu(false);
								}}
							>
								Кто смотрел
							</button>
							<button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.SERVICES);
									setMobileMenu(false);
								}}
							>
								Услуги
							</button>
							<button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.NOTES);
									setMobileMenu(false);
								}}
							>
								Заметки
							</button>
							<button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.MAILINGS);
									setMobileMenu(false);
								}}
							>
								Рассылки
							</button>

							<button className="mt-6" onClick={logout}>
								Выйти
							</button>
						</ul>
					) : (
						<ul className="flex flex-col items-start gap-3 text-[18px] mt-4">
							<button onClick={onLogin}>Вход</button>
							<button onClick={onRegister}>Регистрация</button>
						</ul>
					)}
				</div>
			) : null}

			<LoginModal
				isOpen={isLogin}
				showError={(error: string) => handleError(error)}
				onConfirmationRequired={onConfirmationRequired}
				onOpenChange={onLoginChange}
				onRecovery={() => onRecovery()}
				onRegister={onRegister}
			/>
			<RegisterModal
				isOpen={isRegister}
				onLogin={onLogin}
				onNext={onNext}
				onOpenChange={onRegisterChange}
				onRecovery={() => onRecovery()}
			/>
			<EmailModal
				isOpen={isEmail}
				newUser={newUser}
				onLogin={onLoginChange}
				onOpenChange={onEmailChange}
				onRecovery={() => onRecovery()}
				onRegister={registration}
			/>
			<ErrorModal error={error} isOpen={isError} onOpenChange={onErrorChange} />
			<RecoveryPasswordModal
				isOpen={isRecovery}
				onOpenChange={onRecoveryChange}
				onSend={onRecoverySuccess}
			/>
			<RecoverySuccessModal
				isOpen={isRecoverySuccess}
				onOpenChange={onRecoverySuccessChange}
			/>
			<ConfirmationModal
				isOpen={isConfirmationRequired}
				onOpenChange={() => {
					logout();
					onConfirmationRequiredChange();
				}}
			/>
			<InfoModal
				isOpen={isInfoBlocked}
				onOpenChange={() => {
					onInfoBlockedChange();
					logout();
				}}
				onClose={() => logout()}
				title="Ошибка"
				text="Ваша анкета заблокирована или удалена. Свяжитесь с администрацией BLOW."
			/>
			{me && !hasAllContacts ? (
				<AddContactsModal
					isOpen={isAddContactPromo}
					onOpenChange={onAddContactPromoChange}
					onClose={addContactPromoViewed}
				/>
			) : null}
		</>
	);
};
