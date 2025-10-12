import type { Metadata } from "next";
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  // по умолчанию закрываем личный кабинет от индексации
  robots: { index: false, follow: true },
};

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // серверный layout: НЕТ "use client"
  return <ClientLayout>{children}</ClientLayout>;
}