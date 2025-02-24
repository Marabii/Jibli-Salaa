"use client";

import { useState } from "react";
import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import {
  handleRegisterAction,
  RegisterFormInputs,
} from "./Utilis/handleRegisterAction";
import Link from "next/link";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  stripeConnectPayinCurrencies,
  stripeConnectPayoutCurrencies,
  currencyToCountry,
} from "@/utils/constants";
import emojiFlags from "emoji-flags";
import SubmitButtonRegister from "./SubmitButtonRegister";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [userCountry, setUserCountry] = useState<string | undefined>("");
  const [userBankCurrency, setUserBankCurrency] = useState<string | undefined>(
    ""
  );
  const [userRole, setUserRole] = useState<"buyer" | "traveler">("buyer");

  // Determine the list of currencies based on user role.
  const currencies =
    userRole === "traveler"
      ? stripeConnectPayoutCurrencies
      : stripeConnectPayinCurrencies;

  // Generate options for the currency select element
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

  return (
    <>
      <p className="py-5 text-lg text-gray-400">
        Create an account and start using Jeebware
      </p>

      <FormWrapper<RegisterFormInputs>
        className="w-full max-w-[550px] space-y-5 px-5"
        action={handleRegisterAction}
        redirectTo="/"
      >
        {/* Name */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="name"
          >
            Name
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            name="name"
            label="Type your name"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[\p{L} ]+$"
            errorMessage="Name can only contain letters and spaces"
          />
        </div>

        {/* Email */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="email"
          >
            Email Address
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="email"
            name="email"
            label="Type Your Email"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
            errorMessage="Invalid email address"
          />
        </div>

        {/* Password */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="password"
            name="password"
            label="Enter Your Password"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
            errorMessage="Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit."
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
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
          {/* Hidden field to actually submit phoneNumber */}
          <input type="hidden" name="phoneNumber" value={phoneNumber || ""} />
        </div>

        {/* Country Select */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="userCountry"
          >
            What country do you live in?
          </label>
          <select
            name="userCountry"
            className="w-full border-2 border-black p-5"
            required
            value={userCountry}
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
          <div className="flex w-full justify-between space-x-8">
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
                Be a Traveler <em className="text-xs">(Earn extra income)</em>
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
            What currency does your bank support?
          </label>
          <select
            name="userBankCurrency"
            className="w-full border-2 border-black p-5"
            required
            value={userBankCurrency}
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

        <FormErrorHandler />

        <SubmitButtonRegister />
        <p className="mt-5 w-full text-start text-gray-800">
          Already Have An Account?
          <Link
            href="/login"
            className="ml-5 border-b-2 border-black text-lg font-bold text-black"
          >
            Sign-In
          </Link>
        </p>
      </FormWrapper>
    </>
  );
};

export default Register;
