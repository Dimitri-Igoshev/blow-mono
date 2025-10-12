import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { registerSchema } from '@/redux/services/auth/schema';
import { useRegister } from '@/redux/services/auth/hooks';

type FormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });

  const register: any = useRegister();

  const onSubmit = (data: FormValues) => {
    register.mutate(data, {
      onSuccess: (res: any) => {
        console.log('Регистрация успешна:', res.data);
        // Перенаправить на логин или сохранить токен
      },
      onError: (err: any) => {
        console.error('Ошибка регистрации:', err.response?.data?.message || err.message);
      },
    });
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('firstName')} placeholder="Имя" />
      <input {...form.register('email')} placeholder="Email" />
      <input {...form.register('password')} placeholder="Пароль" type="password" />
      <button disabled={register.isLoading} type="submit">
        {register.isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      {register.error && (
        <p className="text-red-500">Ошибка: {(register.error as any)?.response?.data?.message}</p>
      )}
    </form>
  );
}
