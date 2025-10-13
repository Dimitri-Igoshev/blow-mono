// app/etiket-i-dolgosrochnye-otnosheniya-win-win/page.tsx
import type { Metadata } from "next";
import EtiquetteLongtermClient from "./EtiquetteLongtermClient"

export const metadata: Metadata = {
  title: "Этикет win-win: долгосрочные отношения без выгорания | 18+",
  description:
    "Роли, обратная связь по методу SBI, границы и конфиденциальность. Планирование совместных активностей и корректное завершение.",
  alternates: {
    canonical: "https://kutumba.ru/etiket-i-dolgosrochnye-otnosheniya-win-win",
  },
  openGraph: {
    type: "article",
    title: "Этикет win-win: долгосрочные отношения",
    description:
      "Как не выгореть и развиваться вместе: правила общения и регулярные сверки.",
    url: "https://kutumba.ru/etiket-i-dolgosrochnye-otnosheniya-win-win",
  },
  twitter: {
    card: "summary",
    title: "Этикет win-win: долгосрочные отношения без выгорания | 18+",
    description:
      "Роли, метод SBI, границы, конфиденциальность и корректное завершение отношений.",
  },
};

export default function Page() {
  return <EtiquetteLongtermClient />;
}
