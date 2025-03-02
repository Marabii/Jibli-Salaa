"use client";

import usePending from "@/components/Form/usePending";
import SubmitButton from "@/components/SubmitButton";
import { useTranslations } from "next-intl";

export default function FormSubmissionButton() {
  const t = useTranslations("Negotiate.Components.NegotiationForm");
  const pending = usePending();

  return (
    <div className="mt-6 w-full z-10 flex justify-center">
      <SubmitButton
        className="w-fit border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        defaultText={t("finalizeNegotiation")}
        pendingText={t("finalizingNegotiation")}
        pending={pending}
      />
    </div>
  );
}
