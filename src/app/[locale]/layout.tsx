import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { ReactNode } from "react";
import Footer from "@/components/Footer";
import ReduxProvider from "@/store/ReduxProvider";
import ToastWrapper from "../../components/ToastWrapper";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers"; // needed import
import { notFound } from "next/navigation"; // needed import

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
});

interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Jeebware",
  description:
    "Welcome to Jeebware, the ultimate platform that connects savvy travelers with buyers seeking affordable or hard-to-find products across borders. Jeebware empowers travelers to earn money while on the move by delivering requested items, offering a faster and more cost-effective alternative to traditional shipping services.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ReduxProvider>
      <html lang={locale}>
        <body className={`${poppins.className} bg-gray-50`}>
          <NextIntlClientProvider messages={messages}>
            <ToastWrapper>
              <Header />
              <div className="min-h-screen w-full flex flex-col justify-between">
                <>{children}</>
                <Footer />
              </div>
            </ToastWrapper>
          </NextIntlClientProvider>
        </body>
      </html>
    </ReduxProvider>
  );
}
