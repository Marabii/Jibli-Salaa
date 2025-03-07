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

export default function RoleAndCurrencySelectors() {
  const t = useTranslations("RegisterPage.RoleAndCurrencySelectors");
  const [userRole, setUserRole] = useState<ROLE | "">("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  console.log("userRole: ", userRole);
  console.log("selectedCurrency: ", selectedCurrency);

  // Role options for the Select component
  const roleOptions = [
    {
      label: t("buyerOption"),
      value: ROLE.BUYER,
    },
    {
      label: (
        <>
          {t("travelerOption")}{" "}
          <em className="text-xs">({t("travelerSub")})</em>
        </>
      ),
      value: ROLE.TRAVELER,
    },
  ];

  const currencies = useMemo(() => {
    return userRole === ROLE.TRAVELER
      ? stripeConnectPayoutCurrencies
      : userRole === ROLE.BUYER
      ? stripeConnectPayinCurrencies
      : [];
  }, [userRole]);

  // Map the currencies to a label/value structure
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
    <>
      {/* Role Selection using Select Component */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          {t("roleLabel")}
        </label>
        <Select
          name="role"
          value={userRole}
          key={userRole}
          onValueChange={(value) => setUserRole(value as ROLE)}
        >
          <SelectTrigger className="rounded-none h-[67.7px] w-full border-2 border-black p-5">
            <SelectValue placeholder={t("rolePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Currency Select */}
      <div className="mt-6">
        <label
          className="mb-2 block font-playfair text-lg font-bold"
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
    </>
  );
}
