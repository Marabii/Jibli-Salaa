import { Errors } from "@/interfaces/Errors/errors";
import { LoginFormInputs, LoginResponse } from "./handleLoginAction";
import { ApiResponse, ApiStatus } from "@/interfaces/Apis/ApiResponse";

export const handleLoginSubmit = async (
  data: LoginFormInputs,
  t: (key: string) => string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const responseData: ApiResponse<LoginResponse> = await response.json();

    if (!response.ok || responseData.status === ApiStatus.FAILURE) {
      const errorMessage =
        responseData?.message || t("Validation.unknownError");
      const errorsArray = responseData?.errors || [];
      const formattedErrors = errorsArray
        .map((error) => `● ${error}`)
        .join(",\n");

      throw new Error(errorMessage + "\n" + formattedErrors);
    }

    // Return the data if login is successful
    return responseData.data;
  } catch (error) {
    throw error;
  }
};

export const getLoginForm = (formData: FormData): LoginFormInputs => {
  return {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  };
};

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<LoginFormInputs>;
};

export const validateForm = (
  { email, password }: LoginFormInputs,
  t: (key: string) => string
): ValidateFormResponse => {
  const errors: Errors<LoginFormInputs> = {};

  const emailRegexGrp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegexGrp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  // Validate email
  if (!email) {
    errors.email = t("Validation.emailMissing");
  } else if (!emailRegexGrp.test(email)) {
    errors.email = t("Validation.emailInvalid");
  }

  // Validate password
  if (!password) {
    errors.password = t("Validation.passwordMissing");
  } else if (!passwordRegexGrp.test(password)) {
    errors.password = t("Validation.passwordInvalid");
  }

  const isError = Object.keys(errors).length > 0;

  return {
    isError,
    errors,
  };
};
