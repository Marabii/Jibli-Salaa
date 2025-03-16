"use client";
import { Link } from "@/i18n/navigation";
import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import {
  handleRegisterAction,
  RegisterFormInputs,
} from "./Utilis/handleRegisterAction";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import SubmitButtonRegister from "./Components/SubmitButtonRegister";
import CountrySelector from "./Components/CountrySelector";
import RoleAndCurrencySelectors from "./Components/RoleAndCurrencySelectors";
import PhoneNumberInput from "./Components/PhoneNumberInput";
import { useTranslations } from "next-intl";

export default function Register() {
  const t = useTranslations("RegisterPage.Page");

  return (
    <>
      <p className="py-5 text-lg text-gray-400">{t("introText")}</p>

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
            {t("nameLabel")}
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            name="name"
            label={t("namePlaceholder")}
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[\p{L} ]+$"
            errorMessage={t("nameError")}
          />
        </div>

        {/* Email */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="email"
          >
            {t("emailLabel")}
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="email"
            name="email"
            label={t("emailPlaceholder")}
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
            errorMessage={t("emailError")}
          />
        </div>

        {/* Password */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="password"
          >
            {t("passwordLabel")}
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="password"
            name="password"
            label={t("passwordPlaceholder")}
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
            errorMessage={t("passwordError")}
          />
        </div>

        {/* Phone Number */}
        <PhoneNumberInput />

        {/* Country Selector */}
        <CountrySelector />

        {/* Role and Currency Selectors */}
        <RoleAndCurrencySelectors />

        {/* Error handler */}
        <FormErrorHandler />

        <SubmitButtonRegister />

        <p className="mt-5 w-full text-start text-gray-800">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="ml-5 border-b-2 border-black text-lg font-bold text-black"
          >
            {t("signIn")}
          </Link>
        </p>
      </FormWrapper>
    </>
  );
}
