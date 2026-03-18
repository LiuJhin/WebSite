import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { FloatingThemeSwitcher } from "../components";
import "../globals.css";

export const metadata: Metadata = {
  title: "Editorial — Archive",
  description: "Warm editorial archive layout inspired by print aesthetics.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <FloatingThemeSwitcher />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
