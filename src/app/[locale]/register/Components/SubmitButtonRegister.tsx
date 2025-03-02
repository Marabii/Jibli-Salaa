"use client";
import SubmitButton from "@/components/SubmitButton";
import usePending from "@/components/Form/usePending";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SubmitButtonRegister() {
  const t = useTranslations("RegisterPage.SubmitButton");
  const pending = usePending();

  return (
    <div className="flex flex-col gap-3">
      <SubmitButton
        defaultText={t("defaultText")}
        pendingText={t("pendingText")}
        className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        pending={pending}
      />
      {/* Uncomment the following block if you wish to enable Google sign-up */}
      {/*
      <Link
        className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        href="/register/signup-with-google"
      >
        {t("googleButton")}
      </Link>
      */}
    </div>
  );
}
