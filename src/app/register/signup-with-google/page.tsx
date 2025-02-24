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

  // Choose currency list based on user role
  const currencies =
    userRole === "traveler"
      ? stripeConnectPayoutCurrencies
      : stripeConnectPayinCurrencies;

  const currencyOptions = currencies.map((currency) => {
    const countryCode = currencyToCountry[currency];
    const flagEmoji = countryCode
      ? emojiFlags.countryCode(countryCode)?.emoji || ""
      : "";
    return {
      label: `${currency.toUpperCase()} ${flagEmoji}`,
      value: currency,
    };
  });

  // Generate options for the country select element using emoji-flags
  const countryOptions = emojiFlags.data
    .filter(
      (country: { name: string; emoji: string; code: string }) =>
        country.name.toUpperCase() !== "ISRAEL"
    )
    .map((country: { name: string; emoji: string; code: string }) => ({
      label: `${country.emoji} ${country.name}`,
      value: country.code,
    }));

  // Determine if the form is valid
  const isFormValid =
    phoneNumber &&
    phoneNumber.trim() !== "" &&
    userBankCurrency &&
    userBankCurrency.trim() !== "" &&
    userCountry &&
    userCountry.trim() !== "";

  // Construct the OAuth state with phoneNumber and other details
  const googleOAuthState = {
    originPage: "/register",
    redirectTo: "/",
    userBankCurrency,
    phoneNumber,
    userCountry,
    userRole,
  };

  // Function to initiate Google OAuth
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
            defaultCountry="MA"
          />
          <input type="hidden" name="phoneNumber" value={phoneNumber || ""} />
        </div>

        {/* Country Select */}
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

        {/* Currency Select */}
        <div>
          <label
            className="mb-2 block text-lg font-semibold text-gray-700"
            htmlFor="userBankCurrency"
          >
            User Bank Currency
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
