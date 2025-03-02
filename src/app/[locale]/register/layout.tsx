import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Create Account - Jeebware",
  description: "Signing up page for the website Jeebware",
};

export default async function RegisterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations("RegisterPage.Layout");

  return (
    <div
      dir="auto"
      className="flex px-2 pb-36 w-full flex-col items-center pt-20 text-center"
    >
      <h1 className="font-playfair text-6xl font-bold">{t("title")}</h1>
      {children}
    </div>
  );
}
