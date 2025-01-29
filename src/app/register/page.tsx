"use client";

import { useState } from "react";
import ISO6391 from "iso-639-1";
import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import {
  handleRegisterAction,
  LanguageOption,
  RegisterFormInputs,
} from "./Utilis/handleRegisterAction";
import SubmitButton from "@/components/SubmitButton";
import usePending from "@/components/Form/usePending";
import dynamic from "next/dynamic";
import Link from "next/link";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
// Dynamically import the Select component to prevent hydration issues.
const Select = dynamic(() => import("react-select"), { ssr: false });

interface SelectOption {
  value: string;
  label: string;
}

const Register = () => {
  const [spokenLanguages, setSpokenLanguages] = useState<LanguageOption[]>([]);
  const pending = usePending();

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

  return (
    <>
      <p className="py-5 text-lg text-gray-400">
        Create an account and start using Jibli Salaa
      </p>
      <FormWrapper<RegisterFormInputs>
        className="w-full max-w-[550px] space-y-5 px-5"
        action={handleRegisterAction}
        redirectTo="/"
      >
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
            pattern="/^[\p{L} ]+$/u"
            errorMessage="Name can only contain letters and spaces"
          />
        </div>
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
            pattern={String(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)}
            errorMessage="Invalid email address"
          />
        </div>
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            className="w-full border-2 rounded-none border-black p-5"
            type="password"
            name="password"
            label="Enter Your Password"
            labelBgColor="rgb(249 250 251)"
            required
            pattern={String(
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/
            )}
            errorMessage="Password must be at least 8 characters long, and include one uppercase letter, one lowercase letter, one digit, and one special character."
          />
        </div>
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
            pattern={String(/^[0-9]{10,15}$/)}
            errorMessage="Invalid phone number"
          />
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
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                height: "68px",
                border: "2px solid black",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                color: state.isFocused || state.isSelected ? "white" : "black", // Ensure text is white when focused/selected
                backgroundColor:
                  state.isFocused || state.isSelected ? "black" : "white", // Black background on hover or selection
                ":active": {
                  backgroundColor: "black", // Active option background
                  color: "white", // Active option text
                },
              }),
              multiValue: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "black", // Background for selected options
                color: "white", // Ensure selected option text is white
              }),
              multiValueLabel: (baseStyles) => ({
                ...baseStyles,
                color: "white", // Selected option label color
              }),
              multiValueRemove: (baseStyles) => ({
                ...baseStyles,
                color: "white",
                ":hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0, // Custom border radius
              colors: {
                ...theme.colors,
                primary25: "black", // Hovered option background
                primary: "black", // Selected option background
              },
            })}
          />
          <input
            type="hidden"
            name="spokenLanguages"
            value={JSON.stringify(spokenLanguages)}
          />
        </div>
        <FormErrorHandler />
        <div className="flex flex-col gap-3">
          <SubmitButton
            defaultText="Register"
            pendingText="Processing request..."
            className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
            pending={pending}
          />
          <Link href="/register/signup-with-google">
            <button
              className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
              type="submit"
            >
              Sign Up With Google
            </button>
          </Link>
        </div>
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
