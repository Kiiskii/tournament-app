import { Inter } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import "./globals.css";
import { getTranslations } from "next-intl/server";
import { UserContextProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {},
    twitter: {
      card: "summary",
    },
  };
}

type LocaleProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleProps) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <UserContextProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
