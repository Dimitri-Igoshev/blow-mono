// app/pervaya-vstrecha-checklist/page.tsx
import type { Metadata } from "next";
import FirstMeetingClient from "./FirstMeetingClient"

export const metadata: Metadata = {
  title: "Первая встреча: безопасность, этикет и сценарий | 18+",
  description:
    "Гайд по первой встрече: безопасная локация, тайм-бокс 60–90 минут, темы разговора и чек-лист. Формат взрослых отношений win-win, без интим-услуг.",
  alternates: {
    canonical: "https://kutumba.ru/pervaya-vstrecha-checklist",
  },
  openGraph: {
    type: "article",
    title: "Первая встреча: безопасность, этикет и сценарий",
    description: "Пошаговый сценарий и безопасность на первой встрече. 18+.",
    url: "https://kutumba.ru/pervaya-vstrecha-checklist",
  },
  twitter: {
    card: "summary",
    title: "Первая встреча: безопасность, этикет и сценарий | 18+",
    description:
      "Чек-лист: локация, тайм-бокс 60–90 минут, темы разговора и безопасность.",
  },
};

export default function Page() {
  return <FirstMeetingClient />;
}
