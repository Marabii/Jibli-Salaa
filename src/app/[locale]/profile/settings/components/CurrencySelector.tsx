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
import { UserInfo } from "@/interfaces/userInfo/userInfo";

export default function CurrencySelector({ userInfo }: { userInfo: UserInfo }) {
  const t = useTranslations("RegisterPage.RoleAndCurrencySelectors");

  // Initialize using uppercase to match option values (e.g., "EUR")
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    userInfo.userBankCurrency ? userInfo.userBankCurrency.toUpperCase() : ""
  );
  const userRole = userInfo.role;

  // Get the list of currencies based on the user's role.
  const currencies = useMemo(() => {
    return userRole === ROLE.TRAVELER
      ? stripeConnectPayoutCurrencies
      : userRole === ROLE.BUYER
      ? stripeConnectPayinCurrencies
      : [];
  }, [userRole]);

  // Build the options, showing the currency and flag.
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

  // If the user doesn't have a set currency, use the first available option.
  useEffect(() => {
    if (!userInfo.userBankCurrency && currencyOptions.length > 0) {
      setSelectedCurrency(currencyOptions[0].value);
    }
  }, [currencyOptions, userInfo.userBankCurrency]);

  return (
    <div className="mt-6">
      <label
        className="mb-2 block font-playfair text-lg font-bold"
        htmlFor="userBankCurrency"
      >
        {t("currencyLabel")}
      </label>
      <Select
        name="userBankCurrency"
        value={selectedCurrency}
        onValueChange={setSelectedCurrency}
      >
        <SelectTrigger
          className={`rounded-none h-[67.7px] w-full border-2 border-black p-5 ${
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
