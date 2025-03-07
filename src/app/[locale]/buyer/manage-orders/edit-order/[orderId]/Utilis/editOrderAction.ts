"use server";

import { getEditOrderDetails, handleSubmit } from "./helperfunctions";
import validateForm, { ValidateFormResponse } from "./validateForm";
import { ActionReturn } from "@/interfaces/Form/Form";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { EditOrderI } from "../page";

export async function editOrderAction(
  actionReturn: ActionReturn<EditOrderI>,
  formData: FormData
): Promise<ActionReturn<EditOrderI>> {
  const editOrderDetails: EditOrderI = getEditOrderDetails(formData);
  const t = await getTranslations(
    "BuyerPage.ManageOrders.EditOrder.OrderId.ValidateForm"
  );
  const result: ValidateFormResponse = validateForm(editOrderDetails, t);

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: editOrderDetails,
    };
  }

  try {
    await handleSubmit(editOrderDetails);
    revalidatePath("/buyer/manage-orders");
    return { status: "success", data: editOrderDetails };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: "failure",
        errors: { global: error.message },
        data: editOrderDetails,
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: editOrderDetails,
      };
    }
  }
}
