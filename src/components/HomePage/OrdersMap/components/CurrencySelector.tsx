"use client";

import {
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

export default function CurrencySelector({
  setCurrency,
}: {
  setCurrency: (currency: string) => void;
}) {
  // The list of currencies (You can prune or modify this as needed)
  const currencies = stripeConnectPayinCurrencies;

  // Generate the displayed label for each currency option
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
    <div className="space-y-2">
      <label
        className="block font-semibold text-lg text-gray-700 dark:text-gray-200"
        htmlFor="currency"
      >
        What currency do you want to see the order prices in?
      </label>
      <Select
        name="currency"
        onValueChange={(selected) => setCurrency(selected)}
        defaultValue="USD"
      >
        <SelectTrigger className="rounded-lg h-[50px] w-full border-2 border-gray-300 p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
          <SelectValue placeholder="Select your currency" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
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
