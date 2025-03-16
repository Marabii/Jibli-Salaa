"use client";
import SubmitButton from "@/components/SubmitButton";
import usePending from "@/components/Form/usePending";

import { useTranslations } from "next-intl";

export default function SubmitButtonProfileUpdate() {
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
    </div>
  );
}
