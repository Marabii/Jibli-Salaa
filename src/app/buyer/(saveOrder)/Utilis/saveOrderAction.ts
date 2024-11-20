"use server";

import { InitialOrder } from "@/interfaces/Order/order";
import { getInitialOrderDetails, handleSubmit } from "./helperfunctions";
import validateForm, { ValidateFormResponse } from "./validateForm";
import { Errors } from "@/interfaces/Errors/errors";
import { revalidatePath } from "next/cache";

export async function saveOrder(
  state: State,
  formData: FormData
): Promise<State> {
  const initialOrderDetails: InitialOrder = getInitialOrderDetails(formData);
  const result: ValidateFormResponse = validateForm(initialOrderDetails);
  if (result.isError) {
    return { status: "failure", errors: result.errors };
  }

  try {
    await handleSubmit(initialOrderDetails);
    revalidatePath("/");
    return { status: "success" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return { status: "failure", errors: { global: error.message } };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
      };
    }
  }
}

export type State = {
  status: "success" | "failure";
  errors?: Errors<InitialOrder>;
} | null;
