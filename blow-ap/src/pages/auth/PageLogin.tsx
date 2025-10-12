import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { MdEmail, MdLock } from "react-icons/md";

import { loginSchema } from "@/redux/services/auth/schema";
import { WidgetAuth } from "@/components/widget/WidgetAuth";
import { LayoutAuth } from "@/layout/LayoutAuth";
import { authApi, useLoginMutation } from "@/redux/services/authApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getRolesFromToken } from "./getRoles"
import { userApi } from "@/redux/services/userApi"

type FormValues = z.infer<typeof loginSchema>;

export default function PageLogin() {
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const [loginMutation] = useLoginMutation();

  const onSubmit = (data: FormValues) => {
    loginMutation(data)
      .unwrap()
      .then(async (res: any) => {
        if (res.accessToken) {
          const roles = getRolesFromToken(res.accessToken);
          const isAdmin = roles.includes("admin");

          if (!isAdmin) return

          localStorage.setItem("accessToken", res.accessToken);

          // Дождаться получения пользователя
          await dispatch(userApi.endpoints.fetchMe.initiate()).unwrap();

          window.location.replace("/");

          // navigate('/', { replace: true });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <LayoutAuth>
      <WidgetAuth title="Авторизация">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Input
            placeholder="Введите email"
            radius="full"
            startContent={<MdEmail />}
            type="email"
            {...form.register("email")}
          />
          <Input
            placeholder="Введите пароль"
            radius="full"
            startContent={<MdLock />}
            type="password"
            {...form.register("password")}
          />

          {/* {login.error && (
            <SystemMessage className="mt-2 -mb-1.5 text-sm" type="error">
              Ошибка: {(login.error as any)?.response?.data?.message}
            </SystemMessage>
          )} */}

          <Button
            className="mt-3"
            color="primary"
            radius="full"
            onPress={() => onSubmit(form.getValues())}
          >
            {"Войти"}
          </Button>
        </form>
      </WidgetAuth>
    </LayoutAuth>
  );
}
