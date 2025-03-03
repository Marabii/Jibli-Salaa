import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Login - Jeebware",
  description: "Login page for the website Jeebware",
};

export default async function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations("LoginPage.Layout");

  return (
    <div
      dir="auto"
      className="px-2 text-center pb-36 flex w-full flex-col items-center pt-20"
    >
      <h1 className="font-playfair text-6xl font-bold">{t("title")}</h1>
      <p className="py-5 text-lg text-gray-400">{t("subheading")}</p>
      {children}
    </div>
  );
}
