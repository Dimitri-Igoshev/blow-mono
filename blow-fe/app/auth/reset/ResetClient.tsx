"use client";

import { useDisclosure } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { ResetModal } from "@/components/ResetModal";
import { ResetModalSuccess } from "@/components/ResetModalSuccess";
import { useResetPasswordMutation } from "@/redux/services/authApi";

export default function ResetClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    isOpen: isReset,
    onOpen: onReset,
    onOpenChange: onResetChange,
  } = useDisclosure();
  const {
    isOpen: isSuccess,
    onOpen: onSuccess,
    onOpenChange: onSuccessChange,
  } = useDisclosure();

  useEffect(() => {
    if (token) {
      onReset();
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [reset] = useResetPasswordMutation();

  const onSend = (password: string) => {
    setIsLoading(true);

    reset({ password, token })
      .unwrap()
      .then(() => {
        onResetChange();
        onSuccess();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ResetModal isOpen={isReset} onSend={onSend} />

          <ResetModalSuccess isOpen={isSuccess} />
        </>
      )}
    </div>
  );
}
