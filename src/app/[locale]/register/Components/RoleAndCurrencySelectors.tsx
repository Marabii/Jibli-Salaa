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
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function RoleAndCurrencySelectors() {
  const t = useTranslations("RegisterPage.RoleAndCurrencySelectors");
  const [userRole, setUserRole] = useState<ROLE | "">("");

  const currencies =
    userRole === ROLE.TRAVELER
      ? stripeConnectPayoutCurrencies
      : userRole === ROLE.BUYER
      ? stripeConnectPayinCurrencies
      : [];

  const currencyOptions = currencies.map((currency) => {
    const countryCode = currencyToCountry[currency];
    const flagEmoji = countryCode
      ? emojiFlags.countryCode(countryCode)?.emoji || ""
      : "";
    return {
      label: `${currency.toUpperCase()} ${flagEmoji}`,
      value: currency.toUpperCase(),
    };
  });

  return (
    <>
      {/* Role Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          {t("roleLabel")}
        </label>
        <div className="flex w-full justify-between space-x-8">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="buyer"
              checked={userRole === ROLE.BUYER}
              onChange={() => setUserRole(ROLE.BUYER)}
              className="form-radio text-blue-500"
            />
            <span className="text-gray-600">{t("buyerOption")}</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="traveler"
              checked={userRole === ROLE.TRAVELER}
              onChange={() => setUserRole(ROLE.TRAVELER)}
              className="form-radio text-blue-500"
            />
            <span className="text-gray-600">
              {t("travelerOption")}{" "}
              <em className="text-xs">({t("travelerSub")})</em>
            </span>
          </label>
        </div>
      </div>

      {/* Currency Select */}
      <div>
        <label
          className="mb-2 block font-playfair text-lg font-bold"
          htmlFor="userBankCurrency"
        >
          {t("currencyLabel")}
        </label>
        <Select name="userBankCurrency">
          <SelectTrigger
            className={`rounded-none h-[67.7px] w-full border-2 border-black p-5 ${
              !userRole ? "opacity-50 pointer-events-none" : ""
            }`}
            disabled={!userRole}
          >
            <SelectValue placeholder={t("currencyPlaceholder")} />
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
