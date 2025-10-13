import type { Metadata } from "next";
import MoscowRfRulesClient from "./MoscowRfRulesClient"

export const metadata: Metadata = {
  title: "Москва и РФ: правила, безопасность и различия формата | 18+",
  description:
    "Как знакомиться в Москве и регионах: этикет, безопасность, корректные договорённости и приватность. Формат взрослых отношений win-win, без интим-услуг.",
  alternates: {
    canonical: "https://kutumba.ru/pravila-bezopasnost-moskva-rf",
  },
  openGraph: {
    type: "article",
    title: "Москва и РФ: правила, безопасность и различия формата",
    description:
      "Контекст мегаполиса и регионов, рекомендации по безопасности и этикету, корректные разговоры о поддержке.",
    url: "https://kutumba.ru/pravila-bezopasnost-moskva-rf",
  },
  twitter: {
    card: "summary",
    title: "Москва и РФ: правила, безопасность и различия формата | 18+",
    description:
      "Этикет и безопасность знакомств в Москве и регионах. Приватность и корректные договорённости.",
  },
};

export default function Page() {
  return <MoscowRfRulesClient />;
}
