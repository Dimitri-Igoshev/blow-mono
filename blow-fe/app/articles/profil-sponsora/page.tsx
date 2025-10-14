import type { Metadata } from "next";
import SponsorProfileClient from "./SponsorProfileClient"

export const metadata: Metadata = {
  title: "Профиль спонсора: структура, примеры и этикет | 18+",
  description:
    "Что писать спонсору в анкете: цели, образ жизни, формат встреч, границы и конфиденциальность. Примеры, ошибки и правила этикета.",
  alternates: {
    canonical: "https://blow.ru/profil-sponsora",
  },
  openGraph: {
    type: "article",
    title: "Профиль спонсора: структура, примеры и этикет",
    description:
      "Структура анкеты спонсора, готовые примеры, частые ошибки и корректная коммуникация на старте.",
    url: "https://blow.ru/profil-sponsora",
  },
  twitter: {
    card: "summary",
    title: "Профиль спонсора: структура, примеры и этикет | 18+",
    description:
      "Что указать в анкете спонсора: цели, формат встреч, границы и приватность. Примеры и ошибки.",
  },
};

export default function Page() {
  return <SponsorProfileClient />;
}
