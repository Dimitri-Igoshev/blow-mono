"use client";

import { useDisclosure } from "@heroui/react";
import { useEffect, useState, type FunctionComponent } from "react";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";
import { EmailModal } from "./email-password";
import { ErrorModal } from "./ErrorModal";
import { RecoveryPasswordModal } from "./RecoveryPasswordModal";
import { RecoverySuccessModal } from "./RecoverySuccesModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { logout } from "@/app/auth/logout";
import { InfoModal } from "./InfoModal";
import { useGetMeQuery } from "@/redux/services/userApi";
import { usePathname } from "next/navigation";

interface AuthProps {
	registrationSignal: number;
}

const Auth: FunctionComponent<AuthProps> = ({ registrationSignal }) => {
	const { data: me, isFetching } = useGetMeQuery(null);

	const [newUser, setNewUser] = useState(null);
	const [error, setError] = useState("");
	const pathname = usePathname();

	const register = () => {};

	const {
		isOpen: isLogin,
		onOpen: onLogin,
		onOpenChange: onLoginChange,
	} = useDisclosure();
	const {
		isOpen: isRegister,
		onOpen: onRegister,
		onOpenChange: onRegisterChange,
		onClose: onRegisterClose,
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

	const isConfirmPage = pathname.includes("confirm");
	const isServicesPage = pathname.includes("services");

	useEffect(() => {
		if (!me) return;

		if (me.status === "new" && !isConfirmPage) onConfirmationRequired();

		if (me.status !== "active" && me.status !== "new") {
			onInfoBlocked();
		}
	}, [me]);

	useEffect(() => {
		if (registrationSignal) onRegister(); // каждое новое значение откроет модалку
	}, [registrationSignal, onRegister]);

	const handleError = (error: string) => {
		console.log("error", error);
		setError(error);
		onError();
	};

	return (
		<>
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
				onRegister={register}
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
		</>
	);
};

export default Auth;
