"use client";

import { useRouter } from "next/navigation";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { useDisclosure } from "@heroui/react";

import Loader from "./Loader";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";
import { EmailModal } from "./email-password";
import { ErrorModal } from "./ErrorModal";
import { RecoveryPasswordModal } from "./RecoveryPasswordModal";
import { RecoverySuccessModal } from "./RecoverySuccesModal";

import { ROUTES } from "@/app/routes";
import { useGetMeQuery } from "@/redux/services/userApi";

interface ToLoginProps {
  children: ReactNode;
}

const ToLogin: FunctionComponent<ToLoginProps> = ({ children }) => {
  const router = useRouter();

  const [newUser, setNewUser] = useState(null);

  const { data: me } = useGetMeQuery(null);

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

  const onNext = (value: any) => {
    setNewUser(value);

    onEmail();
  };

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
    const timeout = setTimeout(() => {
      if (!me) onLogin();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [me]);

  return (
    <>
      {me ? children : <Loader />}

      <LoginModal
        isOpen={isLogin}
        showError={(error: string) => handleError(error)}
        onOpenChange={onLoginChange}
        onRecovery={onRecovery}
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
    </>
  );
};

export default ToLogin;
