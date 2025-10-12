"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/app/routes";
import { InfoModal } from "@/components/InfoModal";
import { useConfirmationMutation } from "@/redux/services/authApi";

export default function ConfirmClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  const [confirm] = useConfirmationMutation();

  const confirmation = () => {
    confirm({ token })
      .unwrap()
      .then((res) => {
        localStorage.setItem("access-token", res.accessToken);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!token) return;

    confirmation();
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center">
      <InfoModal
        closeBtn="В профиль"
        isOpen={true}
        text="Ваша почта успешно подтверждена."
        title="Поздравляем!"
        onAction={() => router.push(ROUTES.ACCOUNT.PROFILE)}
        onOpenChange={() => router.push(ROUTES.ACCOUNT.PROFILE)}
      />
    </div>
  );
}
