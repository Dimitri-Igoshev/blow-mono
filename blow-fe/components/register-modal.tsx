"use client";

import {
	Button,
	Checkbox,
	cn,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from "@heroui/react";
import { FC, useRef, useState } from "react";
import { MdOutlineGirl, MdOutlineHeight } from "react-icons/md";
import { HiOutlineCamera } from "react-icons/hi2";
import { GiWeight } from "react-icons/gi";

import { HeartIcon, MenIcon, WomenIcon } from "./icons";

// import { cities } from "@/data/cities";
import { ages } from "@/data/ages";
import { heights } from "@/data/heights";
import { weights } from "@/data/weights";
import NextLink from "next/link";
import { ROUTES } from "@/app/routes";
import { useGetCitiesQuery } from "@/redux/services/cityApi";

interface RegisterModalProps {
	isOpen: boolean;
	onLogin: () => void;
	onOpenChange: () => void;
	onNext: (value: any) => void;
	onRecovery: () => void;
}

export const RegisterModal: FC<RegisterModalProps> = ({
	isOpen,
	onLogin,
	onNext,
	onOpenChange,
	onRecovery,
}) => {
	const { data: cities } = useGetCitiesQuery(null);

	const [men, setMen] = useState(true);
	const [woman, setWoman] = useState(false);
	const [city, setCity] = useState("");
	const [sponsor, setSponsor] = useState(true);
	const [age, setAge] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [photo, setPhoto] = useState<any>();
	const [imgSrc, setImgSrc] = useState<string>("");
	const [firstName, setFirstName] = useState("");

	const inputRef = useRef<any>(null);

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setPhoto(e.target.files[0]);
			const reader = new FileReader();

			reader.addEventListener("load", () =>
				setImgSrc(reader.result?.toString() || "")
			);
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	// const uploadPhoto = (value: IFilePayload) => {
	//   setLoading(true);

	//   const formData = new FormData();

	//   if (value?.blob) formData.set("file", value.blob);

	//   upload(formData)
	//     .unwrap()
	//     .then((res) => {
	//       console.log(res);
	//     })
	//     .catch((error) => console.log(error))
	//     .finally(() => setLoading(false));
	// };

	const [accept, setAccept] = useState(false);

	return (
		<>
			<Modal
				backdrop="blur"
				className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
				classNames={{
					closeButton: "m-3.5",
				}}
				isDismissable={false}
				isOpen={isOpen}
				placement="center"
				scrollBehavior="inside"   
				size="sm"
				onOpenChange={onOpenChange}
			>
				<ModalContent className="max-h-[85dvh]">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-[20px]">
								Информация о вас
							</ModalHeader>
							<ModalBody>
								<div className="flex flex-col gap-5">
									<div className="flex items-center w-full gap-4">
										<Button
											className={cn(
												"text-xs font-regular bg-transparent w-full",
												{
													" dark:text-white border-primary border-2": men,
												}
											)}
											radius="full"
											startContent={<MenIcon className="text-danger" />}
											onPress={() => {
												setMen(!men);
												setWoman(false);
											}}
										>
											мужчина
										</Button>
										<Button
											className={cn(
												"text-xs  font-regular bg-transparent w-full",
												{
													"dark:text-white border-primary border-2": woman,
												}
											)}
											radius="full"
											startContent={<WomenIcon className="text-danger" />}
											onPress={() => {
												setWoman(!woman);
												setMen(false);
											}}
										>
											девушка
										</Button>
									</div>

									<Input
										classNames={{
											input: "bg-transparent dark:text-white",
											inputWrapper: "dark:bg-foreground-200",
										}}
										placeholder="Имя"
										radius="full"
										type="text"
										value={firstName}
										onValueChange={(value: string) => setFirstName(value)}
									/>

									{/* {woman ? ( */}
									<>
										<Select
											className="w-full text-primary"
											classNames={{
												trigger: "bg-white dark:bg-foreground-300",
											}}
											placeholder="возраст (лет)"
											radius="full"
											selectedKeys={[age]}
											startContent={<MdOutlineGirl size={24} />}
											onChange={(el: any) => setAge(el.target.value)}
										>
											{ages.map((age) => (
												<SelectItem key={age.value}>{age.label}</SelectItem>
											))}
										</Select>

										<Select
											className="w-full text-primary"
											classNames={{
												trigger: "bg-white dark:bg-foreground-300",
											}}
											placeholder="рост (см)"
											radius="full"
											selectedKeys={[height]}
											startContent={
												<MdOutlineHeight className="w-[22px]" size={22} />
											}
											onChange={(el: any) => setHeight(el.target.value)}
										>
											{heights.map((height) => (
												<SelectItem key={height.value}>
													{height.label}
												</SelectItem>
											))}
										</Select>

										<Select
											className="w-full text-primary"
											classNames={{
												trigger: "bg-white dark:bg-foreground-300",
											}}
											placeholder="вес (кг)"
											radius="full"
											selectedKeys={[weight]}
											startContent={<GiWeight className="w-[22px]" size={18} />}
											onChange={(el: any) => setWeight(el.target.value)}
										>
											{weights.map((weight) => (
												<SelectItem key={weight.value}>
													{weight.label}
												</SelectItem>
											))}
										</Select>
									</>
									{/* ) : null} */}

									<Select
										className="text-primary"
										classNames={{
											trigger: "bg-white dark:bg-foreground-300",
										}}
										placeholder="выберите город"
										radius="full"
										selectedKeys={[city]}
										onChange={(el: any) => setCity(el.target.value)}
									>
										{cities
											?.filter((item: any) => item.value)
											.map((city: any) => (
												<SelectItem key={city.value}>{city.label}</SelectItem>
											))}
									</Select>

									{/* {woman ? ( */}
									<>
										{imgSrc ? (
											<div className="flex justify-center w-full rounded-[20px] overflow-hidden">
												<img alt="" src={imgSrc} />
											</div>
										) : null}
										<input
											ref={inputRef}
											className="hidden"
											type="file"
											onChange={onSelectFile}
										/>

										<Button
											className="w-full"
											color="primary"
											radius="full"
											startContent={
												<HiOutlineCamera className="w-[22px]" size={20} />
											}
											variant="bordered"
											onPress={() => inputRef.current.click()}
										>
											{photo ? "Заменить фото" : "Добавить фото"}
										</Button>
									</>
									{/* ) : null} */}

									<p className="font-semibold mt-1">Цель знакомства</p>

									<Checkbox
										defaultSelected
										className="-mt-4"
										classNames={{
											wrapper: "bg-white dark:bg-foreground-300",
										}}
										icon={<HeartIcon />}
										isSelected={sponsor}
										onChange={(e) => e.target.checked && setSponsor(true)}
									>
										{men ? "стану спонсором" : "ищу спонсора"}
									</Checkbox>
									<Checkbox
										defaultSelected
										className="-mt-5"
										classNames={{
											wrapper: "bg-white dark:bg-foreground-300",
										}}
										icon={<HeartIcon />}
										isSelected={!sponsor}
										onChange={(e) => e.target.checked && setSponsor(false)}
									>
										{men ? "я не спонсор" : "не ищу спонсора"}
									</Checkbox>
								</div>
							</ModalBody>
							<ModalFooter>
								<div className="flex flex-col w-full">
									<Button
										className="w-full"
										color={!accept ? "default" : "primary"}
										disabled={!accept}
										radius="full"
										onPress={() => {
											onNext({
												firstName,
												men,
												woman,
												city,
												sponsor,
												age,
												height,
												weight,
												photo,
											});
											onClose();
										}}
									>
										Все верно
									</Button>

									<div className="flex gap-1 mt-2 items-start">
										<Checkbox
											// defaultSelected
											className="mt-1"
											classNames={{
												wrapper: "bg-white dark:bg-foreground-300",
											}}
											// icon={<HeartIcon />}
											isSelected={accept}
											onChange={() => setAccept(!accept)}
										></Checkbox>
										<div className="mt-[13px] text-[12px]">
											<NextLink
												href={ROUTES.RULES}
												target="_blank"
												className="underline cursor-pointer hover:text-primary mt-2.5"
											>
												Cоглашаюсь с Правилами
											</NextLink>
											,{" "}
											<NextLink
												href={ROUTES.OFFER}
												target="_blank"
												className="underline cursor-pointer hover:text-primary mt-2.5"
											>
												офертой
											</NextLink>{" "}
											и{" "}
											<NextLink
												href={ROUTES.POLICY}
												target="_blank"
												className="underline cursor-pointer hover:text-primary mt-2.5"
											>
												Политикой в отношении обработки персональных данных
											</NextLink>
										</div>
									</div>

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
											Есть анкета?
										</Button>
									</div>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
