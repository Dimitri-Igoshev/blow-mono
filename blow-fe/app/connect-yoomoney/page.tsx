'use client';

export default function ConnectYooMoney() {
  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_YOOMONEY_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/oauth/callback`,
      // выбери нужные скоупы
      scope: 'account-info operation-history payment',
      instance_name: 'MyApp',
    });
    window.location.href = `https://yoomoney.ru/oauth/authorize?${params.toString()}`;
  };

  return <button onClick={handleConnect}>Подключить YooMoney</button>;
}
