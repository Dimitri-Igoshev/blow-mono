import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { forgotPasswordSchema } from '@/redux/services/auth/schema';
import { useForgotPassword } from '@/redux/services/auth/hooks';

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation: any = useForgotPassword();

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} placeholder="Email" />
      <button disabled={mutation.isLoading} type="submit">
        {mutation.isLoading ? 'Отправка...' : 'Отправить ссылку на почту'}
      </button>
      {mutation.isSuccess && <p className="text-green-600">Письмо отправлено!</p>}
      {mutation.error && (
        <p className="text-red-500">Ошибка: {(mutation.error as any)?.response?.data?.message}</p>
      )}
    </form>
  );
}
