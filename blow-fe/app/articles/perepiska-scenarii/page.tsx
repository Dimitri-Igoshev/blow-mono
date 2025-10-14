// app/perepiska-scenarii/page.tsx
import type { Metadata } from "next";
import MessagingScenariosClient from "./MessagingScenariosClient"

export const metadata: Metadata = {
  title: "Переписка: первые сообщения и переход к встрече | 18+",
  description:
    "Готовые сценарии первых сообщений, структура диалога, анти-фразы и как мягко перейти к офлайн-встрече. Формат взрослых отношений win-win, без интим-услуг.",
  alternates: {
    canonical: "https://blow.ru/perepiska-scenarii",
  },
  openGraph: {
    type: "article",
    title: "Переписка: первые сообщения и переход к встрече",
    description:
      "Шаблоны первых сообщений, корректная коммуникация и безопасный переход к встрече.",
    url: "https://blow.ru/perepiska-scenarii",
  },
  twitter: {
    card: "summary",
    title: "Переписка: первые сообщения и переход к встрече | 18+",
    description:
      "Сценарии, структура диалога, анти-фразы и мягкий переход к офлайн-встрече.",
  },
};

export default function Page() {
  return <MessagingScenariosClient />;
}
