"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

import { ROUTES } from "../routes";

import { useGetMeQuery } from "@/redux/services/userApi";
import { ConfirmationModal } from "@/components/ConfirmationModal";

function WrapperEmailConf({ children }: any) {
  const { data: me } = useGetMeQuery(null);
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!me) return;

    if (me?.status === "new") {
      onOpen();
    }
  }, [me]);

  return (
    <div>
      {children}
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          router.push(ROUTES.HOME);
        }}
      />
    </div>
  );
}

export default WrapperEmailConf;
