// app/billing/deposit/DepositButton.tsx
'use client';

import { config } from "@/common/env"

export function DepositButton({ userId, amountMinor }: { userId: string; amountMinor: number }) {
  const onClick = async () => {
    const res = await fetch(`${config.NEXT_PUBLIC_API_URL}/yoomoney/deposit`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId, amountMinor, comment: 'Пополнение кошелька' }),
    });
    if (!res.ok) return alert('Не удалось инициировать платеж');
    const data = await res.json(); // { status: 'success' | 'in_progress', paymentId? }
    if (data.status === 'success') {
      alert('Оплата успешна, баланс скоро обновится.');
    } else {
      alert('Оплата инициирована, ожидаем подтверждение…');
    }
  };
  return <button onClick={onClick}>Пополнить</button>;
}
