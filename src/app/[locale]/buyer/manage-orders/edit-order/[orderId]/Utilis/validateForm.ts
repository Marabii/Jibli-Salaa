import { Errors } from "@/interfaces/Errors/errors";
import { EditOrderI } from "../page";

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<EditOrderI>;
};

const validateForm = (
  buyerOrder: EditOrderI,
  t: (key: string, params?: Record<string, any>) => string
): ValidateFormResponse => {
  const errors: Errors<EditOrderI> = {};
  const regexProductName = /^[a-zA-Z0-9\s.,'-]{3,100}$/;
  const regexDescription = /^[\s\S]{10,10000}$/;
  const regexDeliveryInstructions = /^[\s\S]{10,10000}$/;

  // Validate productURL (optional but must be valid if provided)
  if (
    buyerOrder.productURL &&
    !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(buyerOrder.productURL)
  ) {
    errors.productURL = t("error.invalidURL");
  }

  // Validate estimatedValue (required and > 10)
  if (!buyerOrder.estimatedValue || buyerOrder.estimatedValue < 10) {
    errors.estimatedValue = t("error.estimatedValue", { min: 10 });
  }

  // Validate productName (required, length 3-100, matches regex)
  if (
    !buyerOrder.productName ||
    !regexProductName.test(buyerOrder.productName)
  ) {
    errors.productName = t("error.productName");
  }

  // Validate description (required, length 10-10000, matches regex)
  if (
    !buyerOrder.description ||
    !regexDescription.test(buyerOrder.description)
  ) {
    errors.description = t("error.description");
  }

  // Validate quantity (must be more than 1)
  if (!buyerOrder.quantity || buyerOrder.quantity < 1) {
    errors.quantity = t("error.quantity");
  }

  // Validate each dimension (must be positive)
  if (buyerOrder.dimensions) {
    if (
      buyerOrder.dimensions.lengthInCm &&
      buyerOrder.dimensions.lengthInCm <= 0
    ) {
      errors["dimensions.lengthInCm"] = t("error.dimension.length");
    }
    if (
      buyerOrder.dimensions.widthInCm &&
      buyerOrder.dimensions.widthInCm <= 0
    ) {
      errors["dimensions.widthInCm"] = t("error.dimension.width");
    }
    if (
      buyerOrder.dimensions.heightInCm &&
      buyerOrder.dimensions.heightInCm <= 0
    ) {
      errors["dimensions.heightInCm"] = t("error.dimension.height");
    }
  }

  // Validate deliveryInstructions (optional but must match regex if provided)
  if (
    buyerOrder.deliveryInstructions &&
    !regexDeliveryInstructions.test(buyerOrder.deliveryInstructions)
  ) {
    errors.deliveryInstructions = t("error.deliveryInstructions");
  }

  // Validate initialDeliveryFee (must be larger than 5)
  if (!buyerOrder.initialDeliveryFee || buyerOrder.initialDeliveryFee < 5) {
    errors.initialDeliveryFee = t("error.initialDeliveryFee", { min: 5 });
  }

  // Validate preferredPickupPlace
  if (
    !buyerOrder.preferredPickupPlace ||
    !buyerOrder.preferredPickupPlace.formatted_address ||
    buyerOrder.preferredPickupPlace.lat === null ||
    buyerOrder.preferredPickupPlace.lng === null
  ) {
    errors.preferredPickupPlace = t("error.preferredPickupPlace");
  }

  // Validate images
  if (
    buyerOrder.newImagesFiles &&
    buyerOrder.newImagesFiles.length !== 0 &&
    buyerOrder.newImagesFiles.some((file) => file.size === 0)
  ) {
    errors.newImagesFiles = t("error.newImagesFiles");
  }

  return { isError: Object.keys(errors).length !== 0, errors };
};

export default validateForm;
