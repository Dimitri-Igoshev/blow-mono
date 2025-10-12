import "@/styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Script from "next/script";
import ResetOverflowOnRouteChange from "@/components/ResetOverflowOnRouteChange";

export const metadata: Metadata = {
  metadataBase: new URL("https://blow.ru"),
  title: {
    default: `${siteConfig.name} — знакомства содержанок и спонсоров`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["blow", "содержанки", "спонсоры", "мужчины", "знакомства", "девушки", "провести вечер", "совместные путешествия", "содержанки москвы", "содержанки питера" ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://blow.ru",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — знакомства содержанок и спонсоров`,
    description:
      "Платформа для знакомств содержанок и спонсоров: анкеты, встречи, общение.",
    images: ["https://blow.ru/logo.png"],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — знакомства`,
    description:
      "Знакомства для содержанок и спонсоров. Найди пару для приятного вечера.",
    images: ["https://blow.ru/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: { width: "device-width", initialScale: 1 },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="ru">
      <head>
        <meta name="yandex-verification" content="01806652c99b810c" />
        {/* Яндекс.Метрика */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) return;
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(103211586, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true
              });
            `,
          }}
        />
      </head>
      <body
        className={clsx(
          "bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col  bg-gray dark:bg-black">
            <Navbar />
            <ResetOverflowOnRouteChange />
            {/* <main className="container mx-auto max-w-full pt-16 px-6 flex-grow"> */}
            <main className="">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
