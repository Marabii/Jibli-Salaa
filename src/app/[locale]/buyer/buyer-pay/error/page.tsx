"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PaymentCancelled() {
  const t = useTranslations("BuyerPage.BuyerPay.Error.Page");

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("header")}</h1>
        <p className="text-gray-600 mb-6">{t("message")}</p>
        <Link
          href="/"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
        >
          {t("returnHome")}
        </Link>
      </div>
    </div>
  );
}
