import apiServer from "@/utils/apiServer";
import { IFinalizeNegotiations } from "../NegotiationForm";
import { Errors } from "@/interfaces/Errors/errors";
import {
  MINIMUM_DELIVERY_FEE_IN_USD,
  MINIMUM_PRICE_IN_USD,
} from "@/utils/constants";

export const handleSubmit = async (data: IFinalizeNegotiations) => {
  try {
    await apiServer("/api/protected/finalizeNegotiation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw error;
  }
};

export const getFinalizeNegotiationsDetails = (
  formData: FormData
): IFinalizeNegotiations => {
  return {
    actualValue: parseFloat((formData.get("actualValue") as string) || "0"),
    actualDeliveryFee: parseFloat(
      (formData.get("actualDeliveryFee") as string) || "0"
    ),
    orderId: (formData.get("orderId") as string) || "",
  };
};

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<IFinalizeNegotiations>;
};

export const validateForm = (
  finalizeNegotiationsDetails: IFinalizeNegotiations,
  t: (key: string, params?: Record<string, any>) => string
) => {
  const errors: Errors<IFinalizeNegotiations> = {};

  if (finalizeNegotiationsDetails.actualValue < MINIMUM_PRICE_IN_USD) {
    errors.actualValue = t("error.productValue", {
      minPrice: MINIMUM_PRICE_IN_USD,
    });
  }
  if (
    finalizeNegotiationsDetails.actualDeliveryFee < MINIMUM_DELIVERY_FEE_IN_USD
  ) {
    errors.actualDeliveryFee = t("error.deliveryFee", {
      minFee: MINIMUM_DELIVERY_FEE_IN_USD,
    });
  }
  return { isError: Object.keys(errors).length !== 0, errors };
};
