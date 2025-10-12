import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Минимум 6 символов' }),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Введите корректный email'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6, 'Минимум 6 символов'),
});
