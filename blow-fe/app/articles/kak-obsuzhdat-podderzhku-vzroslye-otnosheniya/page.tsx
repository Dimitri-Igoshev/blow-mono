// app/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya/page.tsx
import type { Metadata } from "next";
import SupportTalkClient from "./SupportTalkClient"

export const metadata: Metadata = {
  title: "Как обсуждать поддержку: подарки, обучение, менторство | 18+",
  description:
    "Скрипты разговора о поддержке без неловкости: обучение, культурные мероприятия, путешествия, наставничество. Прозрачные договорённости, 18+.",
  alternates: {
    canonical: "https://kutumba.ru/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya",
  },
  openGraph: {
    type: "article",
    title: "Как обсуждать поддержку: подарки, обучение, менторство",
    description:
      "Этичные формулировки и сценарии обсуждения поддержки в формате win-win.",
    url: "https://kutumba.ru/kak-obsuzhdat-podderzhku-vzroslye-otnosheniya",
  },
  twitter: {
    card: "summary",
    title: "Как обсуждать поддержку: подарки, обучение, менторство | 18+",
    description:
      "Скрипты и формулировки, чтобы говорить о поддержке этично и без неловкости.",
  },
};

export default function Page() {
  return <SupportTalkClient />;
}
