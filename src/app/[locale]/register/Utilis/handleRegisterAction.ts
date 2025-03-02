"use server";

import { ActionReturn } from "@/interfaces/Form/Form";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  getRegisterForm,
  handleRegisterSubmit,
  validateForm,
  ValidateFormResponse,
} from "./helperFunctions";
import { getTranslations } from "next-intl/server";

export interface RegisterResponse {
  token: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userBankCurrency: string;
  userCountry: string;
  role: string;
}

export async function handleRegisterAction(
  actionReturn: ActionReturn<RegisterFormInputs>,
  formData: FormData
): Promise<ActionReturn<RegisterFormInputs>> {
  // Retrieve translations from your i18n file for the register page.
  const t = await getTranslations("RegisterPage");

  const registerForm: RegisterFormInputs = getRegisterForm(formData);

  // Pass the translation function to your validator.
  const result: ValidateFormResponse = validateForm(registerForm, t);

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: registerForm,
    };
  }

  try {
    const loginResponse = await handleRegisterSubmit(registerForm);
    const IS_PRODUCTION = JSON.parse(
      process.env.NEXT_PUBLIC_IS_PRODUCTION || "false"
    );

    // Parse and validate COOKIES_MAX_AGE
    let cookiesMaxAge = parseInt(process.env.COOKIES_MAX_AGE || "3600", 10);
    if (isNaN(cookiesMaxAge)) {
      console.warn("Invalid COOKIES_MAX_AGE. Defaulting to 3600 seconds.");
      cookiesMaxAge = 3600;
    }

    // Determine sameSite based on environment
    const sameSiteValue = IS_PRODUCTION ? "none" : "lax";

    // Set the cookie
    (await cookies()).set({
      name: "jwtToken",
      value: loginResponse.token,
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: sameSiteValue,
      domain: IS_PRODUCTION ? ".jeebware.com" : undefined,
      path: "/",
      maxAge: cookiesMaxAge,
    });

    revalidatePath("/");
    return { status: "success", data: registerForm };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: "failure",
        errors: { global: error.message },
        data: registerForm,
      };
    } else {
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: registerForm,
      };
    }
  }
}
