"use client";

import usePending from "@/components/Form/usePending";
import SubmitButton from "@/components/SubmitButton";
import { useTranslations } from "next-intl";

export default function FormSubmissionButton() {
  const t = useTranslations(
    "BuyerPage.ManageOrders.EditOrder.OrderId.Form.FormSubmissionButton"
  );
  const pending = usePending();

  return (
    <div className="mt-6 w-full flex justify-center">
      <SubmitButton
        className="w-fit border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        defaultText={t("updateOrder")}
        pendingText={t("updatingOrder")}
        pending={pending}
      />
    </div>
  );
}
