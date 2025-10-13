import type { Metadata } from "next";
import Script from "next/script";
import WomenBenefitsArticlePageClient from "./WomenBenefitsArticlePageClient"

export const metadata: Metadata = {
  title: "Девушки и формат-содержанки: выгоды, безопасность и как всё устроено | 18+",
  description:
    "Гид для девушек: выгоды формата win-win, безопасность, как обсуждать ожидания и поддержку, скрипты диалогов и частые вопросы. 18+.",
  alternates: {
    canonical: "https://kutumba.ru/articles/devushki-v-sugar-dating-vygody",
  },
  openGraph: {
    type: "article",
    title: "Девушки и sugar-формат: выгоды, безопасность и как всё устроено",
    description:
      "Прозрачные ожидания, менторство и развитие, защита данных и границ. Полезные скрипты и FAQ. 18+.",
    url: "https://kutumba.ru/articles/devushki-v-sugar-dating-vygody",
    // можно добавить images при необходимости
  },
  twitter: {
    card: "summary",
    title: "Девушки и формат-содержанки: выгоды, безопасность и как всё устроено",
    description:
      "Гид для девушек: выгоды формата win-win, безопасность, как обсуждать ожидания и поддержку, скрипты и FAQ.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "В чём выгода формата для девушек?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Прозрачные ожидания и границы, безопасность и контроль контактов, доступ к менторству, образованию и культурным мероприятиям, экономия времени и эмоциональная предсказуемость.",
      },
    },
    {
      "@type": "Question",
      name: "Как безопасно знакомиться и встречаться?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Только через чат платформы на старте, публичные места для встреч, делиться маршрутами с доверенным лицом, не передавать личные контакты и реквизиты до доверия.",
      },
    },
    {
      "@type": "Question",
      name: "Как корректно обсуждать поддержку?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Через цели и форматы: обучение, культурные события, путешествия, наставничество. Фиксируйте договорённости в чате, избегайте двусмысленностей и незаконных условий.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      {/* Структурированные данные (JSON-LD) */}
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WomenBenefitsArticlePageClient />
    </>
  );
}
