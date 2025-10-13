// app/krasnye-flagi-i-moshenniki-v-sugar-dating/page.tsx
import type { Metadata } from "next";
import RedFlagsClient from "./RedFlagsClient"

export const metadata: Metadata = {
  title: "Красные флаги и мошенники: как защититься | 18+",
  description:
    "Типовые схемы, поведенческие красные флаги и пошаговый план защиты в формате знакомств win-win. Жалоба модерации, 2FA, безопасность.",
  alternates: {
    canonical: "https://kutumba.ru/krasnye-flagi-i-moshenniki-v-sugar-dating",
  },
  openGraph: {
    type: "article",
    title: "Красные флаги и мошенники: как защититься",
    description:
      "Риски и защита: спешка, давление, фишинг-ссылки, «верификационные» платежи. 18+.",
    url: "https://kutumba.ru/krasnye-flagi-i-moshenniki-v-sugar-dating",
  },
  twitter: {
    card: "summary",
    title: "Красные флаги и мошенники: как защититься | 18+",
    description:
      "Поведенческие флаги, типичные схемы и план защиты: 2FA, жалоба модерации, проверка ссылок.",
  },
};

export default function Page() {
  return <RedFlagsClient />;
}
