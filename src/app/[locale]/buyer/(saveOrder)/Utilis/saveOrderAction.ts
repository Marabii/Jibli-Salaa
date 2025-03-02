"use server";

import { InitialOrder } from "@/interfaces/Order/order";
import { getInitialOrderDetails, handleSubmit } from "./helperfunctions";
import validateForm, { ValidateFormResponse } from "./validateForm";
import { ActionReturn } from "@/interfaces/Form/Form";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

export async function saveOrder(
  actionReturn: ActionReturn<InitialOrder>,
  formData: FormData
): Promise<ActionReturn<InitialOrder>> {
  const initialOrderDetails: InitialOrder = getInitialOrderDetails(formData);
  const t = await getTranslations("BuyerPage.SaveOrder.ValidateForm");
  const result: ValidateFormResponse = validateForm(initialOrderDetails, t);

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: initialOrderDetails,
    };
  }

  try {
    await handleSubmit(initialOrderDetails);
    revalidatePath("/buyer/manage-orders");
    return { status: "success", data: initialOrderDetails };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: "failure",
        errors: { global: error.message },
        data: initialOrderDetails,
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: initialOrderDetails,
      };
    }
  }
}
