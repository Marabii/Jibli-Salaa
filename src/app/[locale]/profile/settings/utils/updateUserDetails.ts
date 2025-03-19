"use server";

import { ActionReturn } from "@/interfaces/Form/Form";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import {
  getNewUserDetails,
  handleSubmit,
  validateForm,
  ValidateFormResponse,
} from "./helperFunctions";

export interface UpdateUserDetailsI {
  name: string;
  email: string;
  phoneNumber: string;
  userBankCurrency: string;
  userCountry: string;
}

export default async function updateUserDetailsAction(
  actionReturn: ActionReturn<UpdateUserDetailsI>,
  formData: FormData
): Promise<ActionReturn<UpdateUserDetailsI>> {
  const newUserDetails: UpdateUserDetailsI = getNewUserDetails(formData);
  const t = await getTranslations(
    "Profile.UserDetails.UserDetailsForm.ValidateForm"
  );
  const result: ValidateFormResponse = validateForm(newUserDetails, t);

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: newUserDetails,
    };
  }

  try {
    await handleSubmit(newUserDetails);
    revalidatePath("/profile");
    return { status: "success", data: newUserDetails };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: "failure",
        errors: { global: error.message },
        data: newUserDetails,
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: newUserDetails,
      };
    }
  }
}
