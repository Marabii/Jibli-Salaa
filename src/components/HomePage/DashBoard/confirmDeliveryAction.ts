// actions.ts
"use server";

import { revalidatePath } from "next/cache";
import apiServer from "@/utils/apiServer";

export async function confirmDeliveryAction(orderId: string) {
  try {
    await apiServer(`/api/protected/confirmDelivery/${orderId}`, {
      method: "PUT",
    });
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong, couldn't confirm order");
  }
}
