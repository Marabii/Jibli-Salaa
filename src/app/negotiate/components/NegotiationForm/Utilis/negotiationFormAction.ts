"use server";

import { ActionReturn } from "@/interfaces/Form/Form";
import { handleSubmit } from "./helperFunctions";
import { IFinalizeNegotiations } from "../NegotiationForm";
import {
  getFinalizeNegotiationsDetails,
  validateForm,
  ValidateFormResponse,
} from "./helperFunctions";
import { revalidatePath, revalidateTag } from "next/cache";

export async function negotiationFormAction(
  actionReturn: ActionReturn<IFinalizeNegotiations>,
  formData: FormData
): Promise<ActionReturn<IFinalizeNegotiations>> {
  const finilizeNegotiationsDetails: IFinalizeNegotiations =
    getFinalizeNegotiationsDetails(formData);
  const result: ValidateFormResponse = validateForm(
    finilizeNegotiationsDetails
  );

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: finilizeNegotiationsDetails,
    };
  }

  try {
    await handleSubmit(finilizeNegotiationsDetails);
    revalidateTag("fetchOrderInfoTag");
    return { status: "success", data: finilizeNegotiationsDetails };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: "failure",
        errors: { global: error.message },
        data: finilizeNegotiationsDetails,
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: finilizeNegotiationsDetails,
      };
    }
  }
}
