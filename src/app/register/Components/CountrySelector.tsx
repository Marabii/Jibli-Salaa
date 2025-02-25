import "server-only";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import emojiFlags from "emoji-flags";

interface CountryOption {
  label: string;
  value: string;
}

interface CountryOptionsByLetter {
  [letter: string]: CountryOption[];
}

const countryOptionsByLetter: CountryOptionsByLetter = emojiFlags.data
  .filter(
    (country: { name: string; emoji: string; code: string }) =>
      country.name.toUpperCase() !== "ISRAEL"
  )
  .reduce(
    (
      acc: CountryOptionsByLetter,
      country: { name: string; emoji: string; code: string }
    ) => {
      const letter = country.name.charAt(0).toUpperCase();
      const countryOption: CountryOption = {
        label: `${country.emoji} ${country.name}`,
        value: country.code,
      };
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(countryOption);
      return acc;
    },
    {} as CountryOptionsByLetter
  );

export default function CountrySelector() {
  return (
    <div>
      <label
        className="mb-2 block font-playfair text-lg font-bold"
        htmlFor="userCountry"
      >
        What country do you live in?
      </label>
      <Select name="userCountry">
        <SelectTrigger className="rounded-none h-[67.7px] w-full border-2 border-black p-5">
          <SelectValue placeholder="Select the country you live in" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(countryOptionsByLetter)
            .sort()
            .map((letter) => (
              <SelectGroup key={letter}>
                <SelectLabel className="w-full bg-gray-100">
                  {letter}
                </SelectLabel>
                {countryOptionsByLetter[letter].map((country) => (
                  <SelectItem key={country.label} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
