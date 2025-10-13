import type { Metadata } from "next";
import MenBenefitsArticleClient from "./MenBenefitsArticleClient"

export const metadata: Metadata = {
  title: "Содержанки: выгода для мужчин и как устроен формат win-win",
  description:
    "Какие выгоды даёт формат «содержанка—спонсор» для мужчин: прозрачные ожидания, экономия времени, совместные активности, имидж и безопасность. 18+.",
  alternates: {
    canonical: "https://kutumba.ru/soderzhanki-vygoda-dlya-muzhchin",
  },
  openGraph: {
    type: "article",
    title: "Содержанки: выгода для мужчин и как устроен формат win-win",
    description:
      "Прозрачные ожидания, экономия времени, совместные активности, имидж и безопасность. 18+.",
    url: "https://kutumba.ru/soderzhanki-vygoda-dlya-muzhchin",
  },
  twitter: {
    card: "summary",
    title: "Содержанки: выгода для мужчин и как устроен формат win-win",
    description:
      "Почему формат win-win удобен мужчинам: прозрачность, время, комфорт, статус и наставничество.",
  },
};

export default function Page() {
  return <MenBenefitsArticleClient />;
}
