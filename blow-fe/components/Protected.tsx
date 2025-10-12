"use client";

import { useRouter } from "next/navigation";
import { FunctionComponent, ReactNode, useEffect } from "react";

import Loader from "./Loader";

import { useGetMeQuery } from "@/redux/services/userApi";
import { ROUTES } from "@/app/routes";

interface ProtectedProps {
  children: ReactNode;
}

const Protected: FunctionComponent<ProtectedProps> = ({ children }) => {
  const router = useRouter();

  const { data: me } = useGetMeQuery(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!me) router.push(ROUTES.HOME);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [me]);

  return <>{me ? children : <Loader />}</>;
};

export default Protected;
