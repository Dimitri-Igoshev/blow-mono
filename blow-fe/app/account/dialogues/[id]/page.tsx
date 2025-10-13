"use client";

import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { cn } from "@heroui/theme";
import {
	use,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import {
	useDeleteChatMutation,
	useGetChatMessagesQuery,
	useGetChatsQuery,
	useSendMessageMutation,
	useUpdateMessageMutation,
} from "@/redux/services/chatApi";
import { useGetMeQuery } from "@/redux/services/userApi";
import { resolveMediaUrl } from "@/common/env";
import { Message } from "@/components/Message";
import { InfoModal } from "@/components/InfoModal";
import { canChatDelete, isPremium } from "@/helper/checkIsActive";
import { ROUTES } from "@/app/routes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MdDeleteOutline } from "react-icons/md";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useCityLabel } from "@/helper/getCityString";
import FileUploadButton from "@/components/FileUploadButton";
import { useUploadFileMutation } from "@/redux/services/fileApi";
import { BlowLoader } from "@/components/BlowLoader";
import { FiSend } from "react-icons/fi";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { MdIosShare } from "react-icons/md";
import { MdOutlineCurrencyRuble } from "react-icons/md";

import dynamic from "next/dynamic";
import data from "@emoji-mart/data";
import { PromotionModal } from "./PromotionModal";
import ShareContactModal from "./ShareContactModal";
import { SystemMessage } from "@/components/SystemMessage";
import ConfirmPurchaseModal from "./ConfirmPurchaseModal";
import { sanitizeContactsClient } from "@/helper/sanitizeClient";
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

interface ProfileViewProps {
	params: any;
}

export default function AccountDialogues({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [currentChat, setCurrentChat] = useState<any>();
	const [text, setText] = useState("");

	const { getCityLabel } = useCityLabel();

	const { data: me } = useGetMeQuery(null);
	const { data: chats, refetch } = useGetChatsQuery(me?._id, {
		skip: !me?._id,
	});
	const { data: chat, refetch: refetch2 } = useGetChatMessagesQuery(
		// @ts-ignore
		currentChat?._id,
		{ skip: !currentChat?._id }
	);

	const isMobile = useMediaQuery("(max-width: 620px)");
	const [send] = useSendMessageMutation();

	const getInterlocutor = (chat: any) => {
		return chat?.sender?._id === me?._id ? chat?.recipient : chat?.sender;
	};

	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(() => {
			if (refetch) refetch();
			if (refetch2) refetch2();
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!chats || currentChat) return;
		if (id === "1") {
			if (isMobile) {
				setCurrentChat(null);
				setSortedChats(sortChatsByLastMessage(chats));
			} else {
				setCurrentChat(chats[0]);
				readMessages(chats[0]);
			}
		} else {
			setCurrentChat(chats.find((item: any) => item._id === id));
			readMessages(chats.find((item: any) => item._id === id));
		}
	}, [chats, id]);

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const scrollToTop = () => {
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0 });
		}
	};

	const [replyTo, setReplyTo] = useState<any>(null);

	useEffect(() => {
		setReplyTo(null);
	}, [currentChat]);

	const handleSubmit = async () => {
		if (!text) return;

		if (
			sanitizeContactsClient(text).found &&
			!isPremium(me) &&
			me?.sex === "male"
		) {
			onPremiumRequired();
			return;
		}

		const body = {
			chat: chat?._id,
			sender: me._id,
			recipient: getInterlocutor(currentChat)._id,
			text,
			replyTo: replyTo?._id ?? null,
		};

		send(body)
			.then(() => {
				setText("");
				setReplyTo(null);
			})
			.catch(() => setText(""));
	};

	useEffect(() => {
		scrollToTop();
		const prevOverflow = document.body.style.overflow;
		const prevPosition = document.body.style.position;

		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = "0";

		return () => {
			document.body.style.overflow = prevOverflow || "auto";
			document.body.style.position = prevPosition || "";
			document.body.style.top = "";
		};
	}, []);

	const handleKeyDown = (event: any) => {
		if (event.key === "Enter") {
			if (event.shiftKey) {
				setText((prev) => prev + "\n");
			} else {
				event.preventDefault();
				if (text.trim() !== "") {
					handleSubmit();
				}
			}
		}
	};

	// Обязательный премиум для М в сообщениях
	// useEffect(() => {
	// 	if (!me) return;
	// 	if (me?.sex === "male" && !isPremium(me)) {
	// 		onPremiumRequired();
	// 	}
	// }, [me]);

	const [sortedChats, setSortedChats] = useState<any[]>([]);

	function sortChatsByLastMessage(chats: any) {
		return [...chats].sort((a: any, b: any) => {
			const aLastMessage = a.messages[0];
			const bLastMessage = b.messages[0];

			const aDate = aLastMessage
				? new Date(aLastMessage.createdAt)
				: new Date(0);
			const bDate = bLastMessage
				? new Date(bLastMessage.createdAt)
				: new Date(0);

			// @ts-ignore
			return bDate - aDate;
		});
	}

	useEffect(() => {
		if (!chat) return;
		setSortedChats(sortChatsByLastMessage(chats));
	}, [chat]);

	const hasUnreadedMesages = (chat: any) => {
		let quantity = 0;
		// chat?.messages?.forEach((message: any) => {
		// 	if (message?.sender !== me?._id && message.isReaded === false) {
		// 		quantity += 1;
		// 	}
		// });
		chat?.messages?.forEach((message: any) => {
			if (
				message?.sender !== me?._id &&
				message?.unreadBy?.find((i: string) => i === me?._id)
			) {
				quantity += 1;
			}
		});
		return quantity;
	};

	const [updateMessage] = useUpdateMessageMutation();

	const readMessages = (chat: any) => {
		// chat?.messages?.forEach(async (message: any) => {
		// 	if (!message.isReaded && message?.sender !== me?._id) {
		// 		updateMessage({ id: message._id, body: { isReaded: true } });
		// 	}
		// });
		chat?.messages?.forEach(async (message: any) => {
			if (
				message.unreadBy.find((i: string) => i === me?._id) &&
				message?.sender !== me?._id
			) {
				updateMessage({
					id: message._id,
					body: {
						unreadBy: message.unreadBy.filter((i: string) => i !== me._id),
					},
				});
			}
		});
	};

	useEffect(() => {
		const originalStyle = {
			position: document.body.style.position,
			left: document.body.style.left,
			right: document.body.style.right,
		};
		document.body.style.position = "fixed";
		document.body.style.left = "0";
		document.body.style.right = "0";
		return () => {
			document.body.style.position = "";
			document.body.style.left = originalStyle.left;
			document.body.style.right = originalStyle.right;
			document.body.style.overflow = "auto";
		};
	}, []);

	const [selectedChat, setSelectedChat] = useState(null);

	const {
		isOpen: isOpenRemove,
		onOpen: onOpenRemove,
		onOpenChange: onOpenChangeRemove,
	} = useDisclosure();

	const {
		isOpen: isRemoveSuccess,
		onOpen: onRemoveSuccess,
		onOpenChange: onRemoveSuccessChange,
	} = useDisclosure();

	const {
		isOpen: isPromo,
		onOpen: onPromo,
		onOpenChange: onPromoChange,
	} = useDisclosure();

	const {
		isOpen: isShareContact,
		onOpen: onShareContact,
		onOpenChange: onShareContactChange,
	} = useDisclosure();

	const {
		isOpen: isPurchaseContact,
		onOpen: onPurchaseContact,
		onOpenChange: onPurchaseContactChange,
	} = useDisclosure();

	const [deleteChat] = useDeleteChatMutation();

	const remove = () => {
		if (!selectedChat) return;
		deleteChat({ id: selectedChat, userId: me._id })
			.unwrap()
			.then(() => {
				onOpenChangeRemove();
				onRemoveSuccess();
				router.refresh();
			})
			.catch(() => {
				onOpenChangeRemove();
			});
	};

	const [loading, setLoading] = useState(false);
	const [uploadFiles] = useUploadFileMutation();

	const uploadFile = (file: any) => {
		if (!file.type.startsWith("image/")) {
			console.warn("Файл не является изображением:", file.type);
			return;
		}
		setLoading(true);
		const formData = new FormData();
		formData.set("files", file);

		uploadFiles(formData)
			.unwrap()
			.then((res: any) => {
				const body = {
					chat: chat?._id,
					sender: me._id,
					recipient: getInterlocutor(currentChat)._id,
					text,
					fileUrl: res[0].url,
					replyTo: replyTo?._id ?? null,
				};

				send(body)
					.then(() => {
						setText("");
						setReplyTo(null);
					})
					.catch(() => setText(""))
					.finally(() => {
						scrollToTop();
						setLoading(false);
					});
			})
			.catch(() => setLoading(false))
			.finally(() => setLoading(false));
	};

	const containerRef = useRef<any>(null);

	useScrollToBottom(containerRef, [currentChat?._id, chat?.length], {
		smooth: true,
	});

	// ====== PREVIEW ЦИТАТЫ ======
	const ReplyPreview = () => {
		if (!replyTo) return null;
		return (
			<div className="mx-3 mb-2 rounded-[12px] border border-default-200 bg-default-100 p-2 flex items-start justify-between gap-3">
				<div className="text-sm">
					<div className="text-xs opacity-70">
						Ответ на:{" "}
						{replyTo?.sender?.firstName ??
							(replyTo?.sender?.sex === "male" ? "Мужчина" : "Девушка")}
					</div>
					{replyTo?.fileUrl ? (
						<div className="text-xs italic">📎 Вложение</div>
					) : null}
					{replyTo?.text ? (
						<div className="line-clamp-2">
							{isPremium(me) || me?.sex === "female"
								? replyTo.text
								: sanitizeContactsClient(replyTo.text).text}
						</div>
					) : null}
				</div>
				<button
					className="text-xs opacity-70 hover:opacity-100"
					onClick={() => setReplyTo(null)}
				>
					✕
				</button>
			</div>
		);
	};

	// ====== EMOJI ======
	const [showEmoji, setShowEmoji] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	// HeroUI Input может прокидывать inputRef внутрь: используем callback-ref, чтобы поймать реальный DOM <input>
	const setInputDomRef = (node: any) => {
		const el: HTMLInputElement | null =
			node?.inputRef?.current ?? (node as HTMLInputElement | null) ?? null;
		if (el) inputRef.current = el;
	};

	const addEmoji = (emoji: any) => {
		const sym: string = emoji?.native || "";
		if (!sym) return;

		setText((prev) => {
			const el = inputRef.current;
			if (!el) return prev + sym; // fallback
			const start = el.selectionStart ?? prev.length;
			const end = el.selectionEnd ?? prev.length;
			const next = prev.slice(0, start) + sym + prev.slice(end);
			// вернуть фокус/каретку на след. кадр
			requestAnimationFrame(() => {
				el.focus();
				const pos = start + sym.length;
				try {
					el.setSelectionRange(pos, pos);
				} catch {}
			});
			return next;
		});

		setShowEmoji(false); // закрыть после выбора (можно убрать)
	};

	useLayoutEffect(() => {
		const isSaleContactInfoViewed =
			typeof window !== "undefined" &&
			localStorage.getItem("isSaleContactInfoViewed") === "true";

		if (me?.sex === "female" && !isSaleContactInfoViewed) {
			setTimeout(() => {
				onPromo();
			}, 1000);
		}
	}, [me]);

	const promoViewed = () => {
		localStorage.setItem("isSaleContactInfoViewed", "true");
	};

	const [contactData, setContactData] = useState<any>();

	return (
		<>
			{loading ? (
				<BlowLoader />
			) : (
				<div
					className="flex flex-col px-3 md:px-9 pt-[84px] gap-[30px] min-h-screen max-h-screen sm:max-h-auto relative"
					style={{ height: "calc(var(--vh, 1vh) * 100)" }}
				>
					<div className="flex w-full items-center justify-between">
						{currentChat ? (
							<div className="flex items-center justify-between gap-3 w-full">
								<Button
									className="flex md:hidden items-center !-mt-6"
									radius="full"
									onPress={() => setCurrentChat(null)}
								>
									Назад
								</Button>

								{me?.sex === "female" ? (
									<Button
										radius="full"
										className="flex sm:hidden min-w-[120px] !-mt-6"
										color="secondary"
										startContent={
											<MdOutlineCurrencyRuble className="text-[18px]" />
										}
										onPress={onShareContact}
									>
										Контакт
									</Button>
								) : null}

								{canChatDelete(me) ? (
									<Button
										className="flex md:hidden items-center !-mt-6"
										radius="full"
										color="primary"
										onPress={() => {
											setSelectedChat(currentChat?._id);
											onOpenRemove();
										}}
									>
										Удалить
									</Button>
								) : null}
							</div>
						) : (
							<h1 className="flex md:hidden font-semibold text-[36px] w-full justify-center !-mt-6">
								Диалоги
							</h1>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[100%] fixed top-[220px] sm:top-[250px] left-0 right-0 px-3 sm:px-9 w-full">
						<div
							className={cn(
								"col-span-1 flex-col gap-1 w-full mt-8 overflow-y-scroll hide-scroll relative",
								{
									"hidden md:flex": currentChat,
									flex: !currentChat,
								}
							)}
							style={{ height: "calc(var(--vh, 1vh) * 65)" }}
						>
							{sortedChats?.map((chat: any) => (
								<button
									key={chat._id}
									className={cn(
										"h-[60px] flex gap-2.5 bg-white dark:bg-foreground-100 p-[5px] justify-between items-center transition-all group",
										{
											["md:mr-6 rounded-[24px]"]: currentChat?._id !== chat._id,
											["md:mr-0 rounded-[24px] rounded-r-none"]:
												currentChat?._id === chat._id,
										}
									)}
									onClick={() => {
										setCurrentChat(chat);
										if (hasUnreadedMesages(chat)) {
											readMessages(chat);
										}
									}}
								>
									<Image
										alt=""
										className="rounded-[20px] z-0 relative w-[50px] min-w-[50px] min-h-[50px]"
										height={50}
										src={
											getInterlocutor(chat)?.photos[0]?.url
                            ? resolveMediaUrl(getInterlocutor(chat)?.photos[0]?.url) ?? ""
												: getInterlocutor(chat)?.sex === "male"
													? "/men.jpg"
													: "/woman.jpg"
										}
										style={{ objectFit: "cover" }}
										width={50}
										onClick={(e) => {
											e.stopPropagation();
											window.open(
												`${ROUTES.ACCOUNT.SEARCH}/${getInterlocutor(chat)?._id}`
											);
										}}
									/>

									<div className="flex flex-col justify-center items-start text-sm w-full">
										<p className="font-semibold line-clamp-1 text-left">
											{getInterlocutor(chat)?.firstName
												? getInterlocutor(chat)?.firstName
												: getInterlocutor(chat)?.sex === "male"
													? "Мужчина"
													: "Девушка"}
										</p>
										<p className="-mt-[2px]">
											{getInterlocutor(chat)?.age},{" "}
											{getCityLabel(getInterlocutor(chat)?.city)}
										</p>
									</div>

									{canChatDelete(me) ? (
										<MdDeleteOutline
											className="hidden md:flex min-w-4 min-h-4 opacity-0 group-hover:opacity-100 hover:text-primary mr-3"
											onClick={() => {
												setSelectedChat(chat._id);
												onOpenRemove();
											}}
										/>
									) : null}

									{currentChat?._id !== chat?._id &&
									hasUnreadedMesages(chat) > 0 ? (
										<div className="w-4 min-w-4 h-4 rounded-full bg-primary text-white text-[8px] flex font-semibold justify-center items-center mr-3">
											{hasUnreadedMesages(chat)}
										</div>
									) : null}
								</button>
							))}
						</div>

						<div className="relative col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col h-full w-full">
							<div className="rounded-[24px] border-[7px] p-3 border-white dark:border-foreground-100">
								<div
									key={currentChat?._id}
									ref={containerRef}
									className={cn(
										"col-span-1 md:col-span-2 p-0 py-3.5 pr-6 lg:col-span-3 xl:col-span-4 w-full rounded-[12px] relative text-[14px] overflow-y-scroll scroll-transparent scroll-smooth flex-1",
										{ "hidden md:flex": !currentChat }
									)}
									style={{
										height: "calc((var(--vh, 1vh) * 100 - 210px) * 0.75)",
									}}
								>
									<div className="flex flex-col gap-4 w-full">
										{chat ? (
											<>
												{chat?.map((message: any, idx: number) => (
													<div key={message?._id}>
														{message?.sender ? (
															<Message
																message={message}
																sameSender={
																	chat?.[idx - 1]?.sender?._id ===
																	message?.sender?._id
																}
																left
																onReply={(m) => setReplyTo(m)}
															/>
														) : (
															<SystemMessage
																message={message}
																sameSender={
																	chat?.[idx - 1]?.sender?._id ===
																	message?.sender?._id
																}
																key={message?._id}
																left
																onAction={(
																	action: string,
																	amount: number,
																	contactType: string
																) => {
																	if (action === "contact") {
																		setContactData({ amount, contactType });
																		onPurchaseContact();
																	}
																}}
															/>
														)}
													</div>
												))}
											</>
										) : null}
									</div>
								</div>
							</div>

							{currentChat ? (
								// панель ввода
								<div className="relative flex items-center gap-3 p-3 md:p-0 bg-transparent md:bg-transparent fixed bottom-0 left-0 right-0 md:static md:mt-3">
									{/* превью цитаты */}
									<div className="absolute -top-20 left-3 right-3 md:static md:top-auto">
										<ReplyPreview />
									</div>

									{/* ПИКЕР СМАЙЛОВ — вынесен СЮДА, фиксируем сверху */}
									{showEmoji ? (
										<div className="absolute -top-4 sm:top-[500px] left-0 right-0 -translate-y-full mb-2 z-50 flex justify-center">
											{/* @ts-ignore */}
											<Picker
												data={data}
												onEmojiSelect={addEmoji}
												locale="ru"
											/>
										</div>
									) : null}

									{me?.sex === "female" ? (
										<Button
											radius="full"
											className="hidden sm:flex min-w-[120px]"
											color="secondary"
											startContent={
												<MdOutlineCurrencyRuble className="text-[18px] -mt-0.5" />
											}
											onPress={onShareContact}
										>
											Контакт
										</Button>
									) : null}

									{/* кнопка смайликов */}
									<Button
										isIconOnly
										radius="full"
										color="secondary"
										onPress={() => setShowEmoji((v) => !v)}
										title="Смайлики"
									>
										<p className="text-[20px]">🙂</p>
									</Button>

									{/* инпут */}
									<Input
										ref={setInputDomRef as any} // 👈 корректный DOM-ref
										classNames={{
											input: "bg-transparent dark:text-white",
											inputWrapper: "dark:bg-foreground-200",
										}}
										placeholder="Текст сообщения"
										radius="full"
										type="text"
										value={text}
										onChange={(e) => setText(e.target.value)}
										onKeyDown={handleKeyDown}
									/>

									<FileUploadButton
										onFileSelect={(file: any) => uploadFile(file)}
									/>

									<Button
										className="flex sm:hidden"
										isIconOnly
										color="primary"
										radius="full"
										variant="solid"
										onPress={handleSubmit}
									>
										<FiSend />
									</Button>

									<Button
										className="hidden sm:flex min-w-[110px]"
										color="primary"
										radius="full"
										variant="solid"
										onPress={handleSubmit}
									>
										Отправить
									</Button>
								</div>
							) : null}
						</div>
					</div>

					{/* <InfoModal
						actionBtn="Купить"
						isOpen={isPremiumRequired}
						text={
							"Для того чтобы общаться с девушками, Вам нужно купить премиум подписку"
						}
						title={"Нужен премиум"}
						onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
						onOpenChange={() => router.back()}
					/> */}

					<InfoModal
						actionBtn="Купить"
						isOpen={isPremiumRequired}
						text={
							"Для того чтобы передавать контакты, Вам нужно купить премиум подписку."
						}
						title={"Нужен премиум"}
						onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
						onOpenChange={onPremiumRequiredChange}
					/>

					<ConfirmModal
						actionBtn="Удалить"
						isOpen={isOpenRemove}
						text="Вы уверены что хотите удалить переписку?"
						title="Удаление переписки"
						onAction={remove}
						onOpenChange={onOpenChangeRemove}
					/>

					<InfoModal
						isOpen={isRemoveSuccess}
						text={"Переписка успешно удалена!"}
						title={"Удаление преписки"}
						onOpenChange={onRemoveSuccessChange}
					/>

					{me?.sex === "female" ? (
						<PromotionModal
							isOpen={isPromo}
							onOpenChange={onPromoChange}
							onClose={promoViewed}
						/>
					) : null}

					{me?.sex === "female" ? (
						<ShareContactModal
							chatId={currentChat?._id}
							recipientId={getInterlocutor(currentChat)?._id}
							isOpen={isShareContact}
							onOpenChange={onShareContactChange}
						/>
					) : null}

					{me?.sex === "male" ? (
						<ConfirmPurchaseModal
							isOpen={isPurchaseContact}
							onOpenChange={onPurchaseContactChange}
							user={getInterlocutor(currentChat)}
							amount={contactData?.amount}
							contactType={contactData?.contactType}
						/>
					) : null}
				</div>
			)}
		</>
	);
}
