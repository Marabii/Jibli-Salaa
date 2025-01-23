"use server";

import { Itinerary } from "@/interfaces/Traveler/Traveler";
import { getItineraryDetails, handleSubmit } from "./helperfunctions";
import validateForm, { ValidateFormResponse } from "./validateForm";
import { revalidatePath } from "next/cache";
import { ActionReturn } from "@/interfaces/Form/Form";

export async function saveItinerary(
  actionReturn: ActionReturn<Itinerary>,
  formData: FormData
): Promise<ActionReturn<Itinerary>> {
  const itineraryDetails: Itinerary = getItineraryDetails(formData);
  const result: ValidateFormResponse = validateForm(itineraryDetails);

  if (result.isError) {
    return {
      status: "failure",
      errors: result.errors,
      data: itineraryDetails,
    };
  }

  try {
    console.log("Submitting itinerary details:", itineraryDetails);
    return { status: "failure", data: itineraryDetails };
    await handleSubmit(itineraryDetails);
    revalidatePath("/");
    return { status: "success", data: itineraryDetails };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: "failure",
        errors: { global: error.message },
        data: itineraryDetails,
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: { global: "An unknown error occurred." },
        data: itineraryDetails,
      };
    }
  }
}
