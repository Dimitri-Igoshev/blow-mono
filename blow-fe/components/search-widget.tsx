"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { FC, useEffect, useState } from "react";
import {
	Autocomplete,
	AutocompleteItem,
	Select,
	SelectItem,
	useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { Switch } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import { MenIcon, WomenIcon } from "./icons";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";
import { EmailModal } from "./email-password";
import { ErrorModal } from "./ErrorModal";
import { RecoveryPasswordModal } from "./RecoveryPasswordModal";
import { RecoverySuccessModal } from "./RecoverySuccesModal";

// import { cities } from "@/data/cities";
import { ages } from "@/data/ages";
import { useGetMeQuery } from "@/redux/services/userApi";
import { ROUTES } from "@/app/routes";
import { setSearch } from "@/redux/features/searchSlice";
import { isPremium } from "@/helper/checkIsActive";
import { useGetCitiesQuery } from "@/redux/services/cityApi";

interface SearchWidgetProps {
	horizontal?: boolean;
	className?: string;
	refresh?: () => void;
}

export const SearchWidget: FC<SearchWidgetProps> = ({
	horizontal = false,
	className = "",
	refresh = () => null,
}) => {
	const router = useRouter();
	const search = useSelector((state: any) => state.search.search);
	const dispatch = useDispatch();

	const { data: me } = useGetMeQuery(null);
	const { data: cities } = useGetCitiesQuery(null);

	const [ageFromOptions, setAgeFromOptions] = useState([...ages]);
	const [ageToOptions, setAgeToOptions] = useState([...ages]);

	useEffect(() => {
		if (!search?.minage) return;

		setAgeToOptions([
			...ages.filter(
				({ value }) => parseInt(value) >= parseInt(search?.minage)
			),
		]);
	}, [search?.minage]);

	useEffect(() => {
		if (!search?.maxage) return;

		setAgeFromOptions([
			...ages.filter(
				({ value }) => parseInt(value) <= parseInt(search?.maxage)
			),
		]);
	}, [search?.maxage]);

	const [newUser, setNewUser] = useState(null);

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
		isOpen: isRecovery,
		onOpen: onRecovery,
		onOpenChange: onRecoveryChange,
	} = useDisclosure();
	const {
		isOpen: isRecoverySuccess,
		onOpen: onRecoverySuccess,
		onOpenChange: onRecoverySuccessChange,
	} = useDisclosure();

	const onNext = (value: any) => {
		setNewUser(value);

		onEmail();
	};

	const registration = () => {};

	const {
		isOpen: isError,
		onOpen: onError,
		onOpenChange: onErrorChange,
	} = useDisclosure();

	const [error, setError] = useState("");

	const handleError = (error: string) => {
		setError(error);
		onError();
	};

	const onSearch = (onlineSwitch = false) => {
		// 	dispatch(
		// 		setSearch({
		// 			...search,
		// 			online: onlineSwitch
		// 				? search?.online
		// 					? ""
		// 					: "true"
		// 				: search?.isOnline
		// 					? "true"
		// 					: "",
		// 			sex,
		// 			minage: search.minage ? search.minage.toString() : "",
		// 			maxage: ageTo ? ageTo.toString() : "",
		// 			limit: "16",
		// 			city,
		// 		})
		// 	);

		router.push(ROUTES.ACCOUNT.SEARCH);
		// if (!me) {
		//   // window.open(`${ROUTES.HOME}?sex=${men && woman ? "" : men ? "male" : woman ? "female" : ""}&minage=${ageFrom ? ageFrom.toString() : ""}&maxage=${ageTo ? ageTo.toString() : ""}&city=${city || ""}`, "_self");
		//   router.push(ROUTES.HOME);
		//   refresh();
		// } else {
		//   router.push(ROUTES.ACCOUNT.SEARCH);
		// }
	};

	return (
		<div
			className={cn(
				"p-[20px] sm:p-[30px] gap-4 sm:gap-5 bg-primary/50 mx-2.5 sm:mx-0 rounded-[32px]",
				{
					"flex flex-col xl:grid xl:grid-cols-[1fr_1fr_1fr_auto] 2xl:grid-cols-4 w-[400px] xl:w-full":
						horizontal,
					"flex flex-col sm:w-[400px]": !horizontal,
				},
				className
			)}
		>
			<div
				className={cn("flex items-center justify-between", {
					"justify-between xl:justify-start": horizontal,
					"justify-between": !horizontal,
				})}
			>
				<p className="font-semibold text-sm text-white mr-4">Найти</p>
				<div className="flex items-center gap-2.5 lx:gap-4">
					<Button
						className={cn("text-xs font-regular", {
							"bg-dark dark:bg-black text-white": search.sex === "male",
						})}
						radius="full"
						startContent={<MenIcon className="text-danger" />}
						onPress={() =>
							dispatch(
								setSearch({
									...search,
									sex: "male",
								})
							)
						}
					>
						мужчину
					</Button>
					<Button
						className={cn("text-xs  font-regular", {
							"bg-dark dark:bg-black text-white": search.sex === "female",
						})}
						radius="full"
						startContent={<WomenIcon className="text-danger" />}
						onPress={() =>
							dispatch(
								setSearch({
									...search,
									sex: "female",
								})
							)
						}
					>
						девушку
					</Button>
				</div>
			</div>

			<div
				className={cn("flex items-center", {
					"justify-between xl:justify-start": horizontal,
					"justify-between": !horizontal,
				})}
			>
				<p className="font-semibold text-sm mr-4 text-white">Возраст</p>
				<div className="flex items-center gap-2.5 xl:gap-4">
					<Select
						className="w-[119px] text-primary"
						placeholder="от"
						radius="full"
						selectedKeys={[search.minage]}
						onChange={(el: any) =>
							dispatch(
								setSearch({
									...search,
									minage: el.target.value,
								})
							)
						}
					>
						{ageFromOptions.map((age) => (
							<SelectItem key={age.value}>{age.label}</SelectItem>
						))}
					</Select>
					<Select
						className="w-[119px] text-primary"
						placeholder="до"
						radius="full"
						// @ts-ignore
						selectedKeys={[search.maxage]}
						onChange={(el: any) =>
							dispatch(
								setSearch({
									...search,
									maxage: el.target.value,
								})
							)
						}
					>
						{ageToOptions.map((age) => (
							<SelectItem key={age.value}>{age.label}</SelectItem>
						))}
					</Select>
				</div>
			</div>

			<div
				className={cn("flex items-center", {
					"justify-between xl:justify-start": horizontal,
					"justify-between": !horizontal,
				})}
			>
				<p className="font-semibold text-sm mr-4 text-white">Откуда</p>
				<Autocomplete
					className="max-w-[248px] xl:max-w-[254px] text-primary"
					placeholder="выберите город"
					radius="full"
					selectedKey={search?.city ?? null}
					allowsCustomValue={false}
					allowsEmptyCollection
					isClearable={false}
					onSelectionChange={(key) => {
						// key может быть string | number | null
						const city = (key ?? null) as string | null;
						dispatch(setSearch({ ...search, city }));
					}}
				>
					{cities?.map((city: any) => (
						<AutocompleteItem key={city.value}>{city.label}</AutocompleteItem>
					))}
				</Autocomplete>
				{/* <Select
          className="max-w-[248px] xl:max-w-[254px] text-primary"
          placeholder="выберите город"
          radius="full"
          selectedKeys={[search.city]}
          onChange={(el: any) => {
            dispatch(
              setSearch({
                ...search,
                city: el.target.value,
              }),
            );
          }}
        >
          {cities?.map((city: any) => (
            <SelectItem key={city.value}>{city.label}</SelectItem>
          ))}
        </Select> */}
			</div>

			<div className={cn("flex wrap gap-6 items-center w-full justify-between", {
        // ['flex-col']: horizontal
      })}>
				{isPremium(me) || me?.sex === "female" ? (
          <div className={cn("items-center", {
            ['flex gap-6  w-full justify-between']: horizontal,
            ['mt-2']: !horizontal
          })}>
					<Switch
						classNames={{
							label: "text-white",
						}}
						color="success"
						isSelected={!!search.online}
						onValueChange={(value) => {
							dispatch(
								setSearch({
									...search,
									online: value ? "true" : "",
								})
							);
							// onSearch(true);
						}}
					>
						Онлайн
					</Switch>
          <Switch
						classNames={{
							label: "text-white",
						}}
            className={cn('text-nowrap', {
              ['flex']: horizontal,
              ['hidden']: !horizontal
            })}
						color="success"
						isSelected={!!search.withPhoto}
						onValueChange={(value) => {
							dispatch(
								setSearch({
									...search,
									withPhoto: value ? "true" : "",
								})
							);
						}}
					>
						C фото
					</Switch>
          </div>
				) : null}
				<Button
					className={cn(
						"font-semibold text-white dark:bg-black bg-dark w-full",
						{
							"mt-2 w-full": !horizontal,
							"xl:hidden 2xl:flex": horizontal,
						}
					)}
					radius="full"
					onPress={() => onSearch(false)}
				>
					НАЙТИ
				</Button>
				<Button
					isIconOnly
					aria-label="Search"
					className={cn("", {
						hidden: !horizontal,
						"hidden xl:flex 2xl:hidden": horizontal,
					})}
					color="secondary"
					radius="full"
				>
					<IoSearch className="text-[20px]" />
				</Button>
			</div>

			<LoginModal
				isOpen={isLogin}
				showError={(error: string) => handleError(error)}
				onOpenChange={onLoginChange}
				onRecovery={() => null}
				onRegister={onRegister}
			/>
			<RegisterModal
				isOpen={isRegister}
				onLogin={onLogin}
				onNext={onNext}
				onOpenChange={onRegisterChange}
				onRecovery={onRecovery}
			/>
			<EmailModal
				isOpen={isEmail}
				newUser={newUser}
				onLogin={onLoginChange}
				onOpenChange={onEmailChange}
				onRecovery={onRecovery}
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
		</div>
	);
};
