"use client";
import { ROLE } from "@/interfaces/userInfo/userRole";
import {
  stripeConnectPayoutCurrencies,
  stripeConnectPayinCurrencies,
  currencyToCountry,
} from "@/utils/constants";
import emojiFlags from "emoji-flags";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

export default function CurrencySelector({ userRole }: { userRole: ROLE }) {
  const t = useTranslations("RegisterPage.RoleAndCurrencySelectors");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  const currencies = useMemo(() => {
    return userRole === ROLE.TRAVELER
      ? stripeConnectPayoutCurrencies
      : userRole === ROLE.BUYER
      ? stripeConnectPayinCurrencies
      : [];
  }, [userRole]);

  const currencyOptions = useMemo(() => {
    return currencies.map((currency) => {
      const countryCode = currencyToCountry[currency];
      const flagEmoji = countryCode
        ? emojiFlags.countryCode(countryCode)?.emoji || ""
        : "";
      return {
        label: `${currency.toUpperCase()} ${flagEmoji}`,
        value: currency.toUpperCase(),
      };
    });
  }, [currencies]);

  useEffect(() => {
    if (userRole) {
      setSelectedCurrency(currencyOptions[0]?.value || "");
    }
  }, [currencyOptions, userRole]);

  return (
    <div className="mt-6">
      <label
        className="mb-2 block text-2xl font-bold text-gray-700"
        htmlFor="userBankCurrency"
      >
        {t("currencyLabel")}
      </label>
      <Select
        name="userBankCurrency"
        key={selectedCurrency}
        value={selectedCurrency}
        onValueChange={setSelectedCurrency}
      >
        <SelectTrigger
          className={`rounded-lg h-[67.7px] w-full border-2 border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-pink-400 transition ${
            !userRole ? "opacity-50 pointer-events-none" : ""
          }`}
          disabled={!userRole}
        >
          {!userRole && t("currencyPlaceholder")}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {currencyOptions.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
