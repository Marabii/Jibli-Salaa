import { Errors } from "@/interfaces/Errors/errors";
import { RegisterFormInputs, RegisterResponse } from "./handleRegisterAction";
import { ApiResponse, ApiStatus } from "@/interfaces/Apis/ApiResponse";

export const handleRegisterSubmit = async (
  data: RegisterFormInputs
): Promise<RegisterResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const responseData: ApiResponse<RegisterResponse> = await response.json();

    if (!response.ok) {
      const errorMessage = responseData?.message || "An unknown error occurred";
      const errorsArray = responseData?.errors || [];
      const formattedErrors = errorsArray
        .map((error) => `● ${error}`)
        .join(",\n");

      throw new Error(errorMessage + "\n" + formattedErrors);
    }

    if (responseData.status !== ApiStatus.SUCCESS) {
      throw new Error(`Registering unsuccessful: ${responseData.message}`);
    }

    return responseData.data;
  } catch (error) {
    throw error;
  }
};

export const getRegisterForm = (formData: FormData): RegisterFormInputs => {
  return {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    phoneNumber: formData.get("phoneNumber")?.toString() || "",
    userBankCurrency: formData.get("userBankCurrency")?.toString() || "",
    userCountry: formData.get("userCountry")?.toString() || "",
    role: formData.get("role")?.toString().toUpperCase() || "",
  };
};

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<RegisterFormInputs>;
};

export const validateForm = (
  {
    name,
    email,
    password,
    phoneNumber,
    userBankCurrency,
    userCountry,
    role,
  }: RegisterFormInputs,
  t: (key: string) => string
): ValidateFormResponse => {
  const errors: Errors<RegisterFormInputs> = {};

  const emailRegexGrp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegexGrp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const nameRegexGrp = /^[\p{L} ]+$/u;
  // E.164 format: starts with a '+' followed by 1 to 15 digits,
  // where the first digit (after '+') cannot be 0.
  const phoneRegexGrp = /^\+[1-9]\d{1,14}$/;

  // Validate name
  if (!name) {
    errors.name = t("error.nameMissing");
  } else if (!nameRegexGrp.test(name)) {
    errors.name = t("error.nameInvalid");
  }

  // Validate email
  if (!email) {
    errors.email = t("error.emailMissing");
  } else if (!emailRegexGrp.test(email)) {
    errors.email = t("error.emailInvalid");
  }

  // Validate password
  if (!password) {
    errors.password = t("error.passwordMissing");
  } else if (!passwordRegexGrp.test(password)) {
    errors.password = t("error.passwordInvalid");
  }

  // Validate phoneNumber (E.164 format)
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

  if (!role) {
    errors.role = t("error.roleMissing");
  }

  const isError = Object.keys(errors).length > 0;

  return {
    isError,
    errors,
  };
};
