"use server";

import { ActionReturn } from "@/interfaces/Form/Form";
import {
  getLoginForm,
  handleLoginSubmit,
  validateForm,
  ValidateFormResponse,
} from "./helperFunctions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export interface LoginFormInputs {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export async function handleLoginAction(
  actionReturn: ActionReturn<LoginFormInputs>,
  formData: FormData
): Promise<ActionReturn<LoginFormInputs>> {
  const t = await getTranslations("LoginPage");
  const loginForm: LoginFormInputs = getLoginForm(formData);
  const result: ValidateFormResponse = validateForm(loginForm, t);

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: loginForm,
    };
  }

  try {
    const loginResponse = await handleLoginSubmit(loginForm, t);
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

    // Revalidate the path to reflect the updated state
    revalidatePath("/");
    return { status: "success", data: loginForm };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: "failure",
        errors: { global: error.message },
        data: loginForm,
      };
    } else {
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: loginForm,
      };
    }
  }
}
