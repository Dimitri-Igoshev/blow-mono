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
import { FaLock } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import Loader from "./Loader";

import { useRegisterMutation } from "@/redux/services/authApi";
import { useUploadMutation } from "@/redux/services/uploadApi";

type Inputs = {
	email: string;
	password: string;
};

interface EmailModalProps {
	isOpen: boolean;
	onLogin: () => void;
	onRegister: () => void;
	onOpenChange: () => void;
	newUser: any;
	onRecovery: () => void;
}

export const EmailModal: FC<EmailModalProps> = ({
	isOpen,
	onLogin,
	onRegister,
	onOpenChange,
	newUser,
	onRecovery,
}) => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<Inputs>();
	const [isLoading, setIsLoading] = useState(false);

	const [registaration] = useRegisterMutation();
	const [upload] = useUploadMutation();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setIsLoading(true);

		const body: any = {
			email: data.email.toLowerCase(),
			password: data.password,
			sex: newUser.men ? "male" : "female",
			age: newUser.age,
			city: newUser.city,
			height: newUser.height,
			weight: newUser.weight,
			sponsor: newUser.sponsor,
			firstName: newUser.firstName,
		};

		if (newUser?.photo) {
			const formData = new FormData();

			formData.set("files", newUser?.photo);
			await upload(formData)
				.unwrap()
				.then((res) => {
					body.photos = [{ ...res[0], priority: 0 }];
				})
				.catch((err) => console.log(err));
		}

		registaration(body)
			.unwrap()
			.then((res) => {
				localStorage.setItem("access-token", res.accessToken);
				document.location.reload();
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
									Данные входа
								</ModalHeader>
								<ModalBody>
									<div>Введите свой емейл и придумайте пароль</div>
									<div className="flex flex-col gap-5 mt-3">
										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="E-mail"
											radius="full"
											startContent={<MdEmail />}
											type="email"
											autoCapitalize="none" // <-- Важно для iPhone
											autoCorrect="off" // <-- Чтобы не исправляло автоматически
											{...register("email", {
												required: { value: true, message: "Обязательное поле" },
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Невалидный emaill",
												},
												onChange: (e) => {
													e.target.value =
														e.target.value.charAt(0).toLowerCase() +
														e.target.value.slice(1);
												},
											})}
										/>
										<Input
											required
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Пароль"
											radius="full"
											startContent={<FaLock size={14} />}
											type="password"
											{...register("password", {
												required: { value: true, message: "Обязательное поле" },
												minLength: { value: 6, message: "Не менее 6 символов" },
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
											Сохранить
										</Button>

										<div className="flex items-center justify-between w-full gap-4 text-xs mt-2 -mb-3">
											<Button
												className="cursor-pointer hover:text-primary bg-transparent text-xs"
												radius="full"
												variant="flat"
												onPress={() => {
													onRecovery();
													onClose();
												}}
											>
												Забыли пароль?
											</Button>
											<Button
												className="cursor-pointer hover:text-primary bg-transparent text-xs"
												radius="full"
												variant="flat"
												onPress={() => {
													onLogin();
													onClose();
												}}
											>
												Есть аккаунт?
											</Button>
										</div>
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
