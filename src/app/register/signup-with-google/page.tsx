"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import {
  stripeConnectPayinCurrencies,
  stripeConnectPayoutCurrencies,
  currencyToCountry,
} from "@/utils/constants";
import emojiFlags from "emoji-flags";

export default function FinishSigningUp() {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [userCountry, setUserCountry] = useState<string | undefined>("");
  const [userBankCurrency, setUserBankCurrency] = useState<string | undefined>(
    ""
  );
  const [userRole, setUserRole] = useState<"buyer" | "traveler">("buyer");

  // 1. Pick which currency array to use (payin vs. payout) based on role.
  //    Each entry (e.g. "mad") is a valid ISO 4217 currency code.
  const currencies =
    userRole === "traveler"
      ? stripeConnectPayoutCurrencies // e.g. ["aud", "bgn", "cad", ...]
      : stripeConnectPayinCurrencies; // e.g. ["usd", "aed", "afn", ...]

  // 2. Build currencyOptions: user sees "MAD 🇲🇦" but we store "mad" as value.
  const currencyOptions = currencies.map((currencyCode) => {
    const countryCode = currencyToCountry[currencyCode]; // e.g. "MA" for "mad"
    const flagEmoji = countryCode
      ? emojiFlags.countryCode(countryCode)?.emoji || ""
      : "";
    return {
      label: `${currencyCode.toUpperCase()} ${flagEmoji}`, // "MAD 🇲🇦"
      value: currencyCode, // "mad"
    };
  });

  // 3. Build countryOptions: user sees "🇲🇦 Morocco" but we store "MA"
  //    because that is an ISO 3166-1 alpha-2 country code.
  const countryOptions = emojiFlags.data
    .filter((country) => country.name.toUpperCase() !== "ISRAEL")
    .map((country) => ({
      label: `${country.emoji} ${country.name}`, // e.g. "🇲🇦 Morocco"
      value: country.code, // e.g. "MA"
    }));

  // 4. Form validation
  const isFormValid =
    phoneNumber &&
    phoneNumber.trim() !== "" &&
    userBankCurrency &&
    userBankCurrency.trim() !== "" &&
    userCountry &&
    userCountry.trim() !== "";

  // 5. Prepare the OAuth state that will be sent to your backend.
  const googleOAuthState = {
    originPage: "/register",
    redirectTo: "/",
    userBankCurrency, // e.g. "mad"
    phoneNumber, // e.g. "+212612345678"
    userCountry, // e.g. "MA"
  };

  // 6. Initiate Google OAuth
  const initiateGoogleOAuth = async () => {
    if (!isFormValid) return;

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${
      process.env.NEXT_PUBLIC_SERVERURL
    }/google/callback&response_type=code&client_id=1028629889843-gjkff6ielpualsk4cu1700vbp08ggacj.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline&state=${encodeURIComponent(
      JSON.stringify(googleOAuthState)
    )}`;

    window.location.href = oauthUrl;
  };

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-gray-800">
        Please specify your details
      </h1>
      <form
        className="w-full max-w-[550px] space-y-5 px-5"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Phone Number */}
        <div>
          <label
            className="mb-2 block text-lg font-semibold text-gray-700"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <PhoneInput
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            numberInputProps={{ className: "bg-gray-50 focus:outline-none" }}
            className="w-full border-2 border-black p-5"
            defaultCountry="MA" // +212
          />
          <input type="hidden" name="phoneNumber" value={phoneNumber || ""} />
        </div>

        {/* Country Select (ISO 3166) */}
        <div>
          <label
            className="mb-2 block text-lg font-semibold text-gray-700"
            htmlFor="userCountry"
          >
            Country
          </label>
          <select
            name="userCountry"
            className="w-full border border-gray-300 p-3 focus:outline-none"
            required
            defaultValue=""
            onChange={(e) => setUserCountry(e.target.value)}
          >
            <option value="" disabled>
              Select your country
            </option>
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            How do you plan to use Jeebware?
          </label>
          <div className="flex justify-between space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="userRole"
                value="buyer"
                checked={userRole === "buyer"}
                onChange={() => setUserRole("buyer")}
                className="form-radio text-blue-500"
              />
              <span className="text-gray-600">Buy Products</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="userRole"
                value="traveler"
                checked={userRole === "traveler"}
                onChange={() => setUserRole("traveler")}
                className="form-radio text-blue-500"
              />
              <span className="text-gray-600">
                Be a Traveler{" "}
                <span className="text-xs">(Earn extra income)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Currency Select (ISO 4217) */}
        <div>
          <label
            className="mb-2 block text-lg font-semibold text-gray-700"
            htmlFor="userBankCurrency"
          >
            Bank Currency
          </label>
          <select
            name="userBankCurrency"
            className="w-full border border-gray-300 p-3 focus:outline-none"
            required
            defaultValue=""
            onChange={(e) => setUserBankCurrency(e.target.value)}
          >
            <option value="" disabled>
              Select a currency
            </option>
            {currencyOptions.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`w-full bg-black border-2 border-black py-4 font-playfair font-bold text-white transition-all duration-300 ${
            isFormValid
              ? "hover:bg-white hover:text-black cursor-pointer"
              : "cursor-not-allowed"
          }`}
          type="submit"
          onClick={initiateGoogleOAuth}
          disabled={!isFormValid}
        >
          Sign Up With Google
        </button>
      </form>
    </>
  );
}
