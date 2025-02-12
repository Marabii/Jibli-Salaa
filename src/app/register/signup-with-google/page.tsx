"use client";

import { LanguageOption } from "../Utilis/handleRegisterAction";
import Input from "@/components/Input";
import { useState, ChangeEvent } from "react";
import ISO6391 from "iso-639-1";
import dynamic from "next/dynamic";

// Dynamically import the Select component to prevent hydration issues.
const Select = dynamic(() => import("react-select"), { ssr: false });

interface SelectOption {
  value: string;
  label: string;
}

export default function FinishSigningUp() {
  const [spokenLanguages, setSpokenLanguages] = useState<LanguageOption[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const languageOptions = ISO6391.getAllCodes().map((code) => ({
    value: code,
    label: ISO6391.getName(code),
  }));

  const handleLanguageChange = (newValue: unknown) => {
    const selectedOptions = newValue as SelectOption[] | null;
    if (selectedOptions) {
      const mappedLanguages: LanguageOption[] = selectedOptions.map(
        (option) => ({
          languageCode: option.value,
          languageName: option.label,
        })
      );
      setSpokenLanguages(mappedLanguages);
    } else {
      setSpokenLanguages([]);
    }
  };

  // Handler for phone number changes
  const handlePhoneChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setPhoneNumber(value);

    // Validate phone number: 10 to 15 digits
    const phoneRegex = /^[0-9]{10,15}$/;
    if (value.trim() === "") {
      setPhoneError("Phone number is required.");
    } else if (!phoneRegex.test(value)) {
      setPhoneError("Invalid phone number. It should be 10 to 15 digits.");
    } else {
      setPhoneError(null);
    }
  };

  // Determine if the form is valid
  const isFormValid =
    phoneNumber.trim() !== "" &&
    phoneError === null &&
    spokenLanguages.length > 0;

  // Construct the OAuth state with phoneNumber
  const googleOAuthState = {
    originPage: "/register",
    redirectTo: "/",
    spokenLanguages,
    phoneNumber,
  };

  // Function to initiate Google OAuth
  const initiateGoogleOAuth = async () => {
    if (!isFormValid) {
      return;
    }

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${
      process.env.NEXT_PUBLIC_SERVERURL
    }/google/callback&response_type=code&client_id=1028629889843-gjkff6ielpualsk4cu1700vbp08ggacj.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline&state=${encodeURIComponent(
      JSON.stringify(googleOAuthState)
    )}`;

    // Redirect to the OAuth URL
    window.location.href = oauthUrl;
  };

  return (
    <>
      <h1 className="py-5 text-lg text-gray-400">
        Please specify first the following details about you
      </h1>
      <form
        className="w-full max-w-[550px] space-y-5 px-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="tel"
            name="phoneNumber"
            label="Enter Your Phone Number"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="/^[0-9]{10,15}$/"
            errorMessage="Invalid phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
          />
          {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
        </div>
        <div>
          <label
            htmlFor="languages"
            className="mb-2 block font-playfair text-lg font-bold"
          >
            Languages You Speak
          </label>
          <Select
            id="languages"
            options={languageOptions}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select Languages"
            onChange={handleLanguageChange}
          />
          {spokenLanguages.length === 0 && (
            <p className="text-sm text-red-500">
              Please select at least one language.
            </p>
          )}
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
