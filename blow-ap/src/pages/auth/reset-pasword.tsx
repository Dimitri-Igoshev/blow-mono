import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { resetPasswordSchema } from '@/redux/services/auth/schema';
import { useResetPassword } from '@/redux/services/auth/hooks';

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: '' },
  });

  const mutation: any = useResetPassword();

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('newPassword')} placeholder="Новый пароль" type="password" />
      <button disabled={mutation.isLoading} type="submit">
        {mutation.isLoading ? 'Сброс...' : 'Сбросить пароль'}
      </button>
      {mutation.isSuccess && <p className="text-green-600">Пароль успешно сброшен!</p>}
      {mutation.error && (
        <p className="text-red-500">Ошибка: {(mutation.error as any)?.response?.data?.message}</p>
      )}
    </form>
  );
}
