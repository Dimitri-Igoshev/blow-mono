import type { Metadata } from "next";
import StrongSugarProfileClient from "./StrongSugarProfileClient"

export const metadata: Metadata = {
  title: "Сильная анкета содержанки: примеры и шаблоны | 18+",
  description:
    "Как оформить анкету содержанки: фото, описание, ожидания и границы. Шаблоны, анти-ошибки и чек-лист для высокого отклика.",
  alternates: {
    canonical: "https://kutumba.ru/silnaya-anketa-soderzhanki",
  },
  openGraph: {
    type: "article",
    title: "Сильная анкета содержанки: примеры и шаблоны",
    description:
      "Фото, описание, ожидания и верификация: что работает лучше всего. Чек-лист и анти-ошибки.",
    url: "https://kutumba.ru/silnaya-anketa-soderzhanki",
  },
  twitter: {
    card: "summary",
    title: "Сильная анкета содержанки: примеры и шаблоны | 18+",
    description:
      "Шаблоны описаний, советы по фото, ожидания и границы. Чек-лист перед публикацией.",
  },
};

export default function Page() {
  return <StrongSugarProfileClient />;
}
