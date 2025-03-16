import { Errors } from "@/interfaces/Errors/errors";
import { UpdateUserDetailsI } from "./updateUserDetails";

export function getNewUserDetails(formData: FormData): UpdateUserDetailsI {
  return {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    userBankCurrency: formData.get("userBankCurrency") as string,
    userCountry: formData.get("userCountry") as string,
  };
}

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<UpdateUserDetailsI>;
};

export const validateForm = (
  {
    name,
    email,
    phoneNumber,
    userBankCurrency,
    userCountry,
  }: UpdateUserDetailsI,
  t: (key: string) => string
): ValidateFormResponse => {
  const errors: Errors<UpdateUserDetailsI> = {};

  const emailRegexGrp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const nameRegexGrp = /^[\p{L} ]+$/u;
  const phoneRegexGrp = /^\+[1-9]\d{1,14}$/;

  if (!name) {
    errors.name = t("error.nameMissing");
  } else if (!nameRegexGrp.test(name)) {
    errors.name = t("error.nameInvalid");
  }

  if (!email) {
    errors.email = t("error.emailMissing");
  } else if (!emailRegexGrp.test(email)) {
    errors.email = t("error.emailInvalid");
  }

  if (!phoneNumber) {
    errors.phoneNumber = t("error.phoneMissing");
  } else if (!phoneRegexGrp.test(phoneNumber)) {
    errors.phoneNumber = t("error.phoneInvalid");
  }

  if (!userBankCurrency) {
    errors.userBankCurrency = t("error.bankCurrencyMissing");
  }

  if (!userCountry) {
    errors.userCountry = t("error.countryMissing");
  }

  const isError = Object.keys(errors).length > 0;

  return {
    isError,
    errors,
  };
};

export async function handleSubmit(data: UpdateUserDetailsI) {}
