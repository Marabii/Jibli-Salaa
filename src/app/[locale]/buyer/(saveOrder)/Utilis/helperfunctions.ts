import { AddressObject } from "@/interfaces/Map/AddressObject";
import { InitialOrder, Dimensions } from "@/interfaces/Order/order";
import apiServer from "@/utils/apiServer";

export function getInitialOrderDetails(data: FormData): InitialOrder {
  const result: any = {};

  // Iterate over each key/value pair in the FormData
  data.forEach((value, key) => {
    // First, handle nested keys (with dot notation)
    if (key.includes(".")) {
      const keys = key.split(".");
      let current = result;

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          // Last segment – assign the parsed value.
          // If a value already exists, convert it into an array or push into the array.
          const parsedValue = parseValue(value);
          if (current.hasOwnProperty(k)) {
            // If it's not an array, wrap the current value into an array
            if (!Array.isArray(current[k])) {
              current[k] = [current[k]];
            }
            current[k].push(parsedValue);
          } else {
            current[k] = parsedValue;
          }
        } else {
          // Not at the last segment – ensure the nested object exists.
          if (!current[k]) {
            current[k] = {};
          }
          current = current[k];
        }
      });
    } else {
      // Top-level keys.
      const parsedValue = parseValue(value);
      if (result.hasOwnProperty(key)) {
        // If the key already exists, convert it (or push) to an array.
        if (!Array.isArray(result[key])) {
          result[key] = [result[key]];
        }
        result[key].push(parsedValue);
      } else {
        result[key] = parsedValue;
      }
    }
  });

  // Destructure the expected properties from the result.
  // For selectedFiles, always ensure we end up with an array.
  const {
    description,
    estimatedValue,
    initialDeliveryFee,
    deliveryInstructions,
    productName,
    dimensions,
    productURL,
    quantity,
    preferredPickupPlace,
    selectedFiles,
  } = result;

  return {
    description: description as string,
    estimatedValue: parseFloat(estimatedValue),
    initialDeliveryFee: parseFloat(initialDeliveryFee),
    deliveryInstructions: deliveryInstructions as string | null,
    productName: productName as string,
    dimensions: dimensions as Dimensions,
    productURL: productURL as string | null,
    quantity: parseInt(quantity, 10),
    preferredPickupPlace: preferredPickupPlace as AddressObject,
    selectedFiles: Array.isArray(selectedFiles)
      ? selectedFiles
      : selectedFiles
      ? [selectedFiles]
      : [],
  };
}

// Helper function to parse values
function parseValue(value: FormDataEntryValue): any {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export async function handleSubmit(initialOrderDetails: InitialOrder) {
  const data = new FormData();

  // Append form fields excluding 'images'
  Object.keys(initialOrderDetails).forEach((key) => {
    if (key === "selectedFiles") {
      return; // Skip 'images'
    }

    if (key === "dimensions" || key === "preferredPickupPlace") {
      data.append(
        key,
        JSON.stringify(
          initialOrderDetails[key as keyof typeof initialOrderDetails]
        )
      );
    } else {
      data.append(
        key,
        String(initialOrderDetails[key as keyof typeof initialOrderDetails])
      );
    }
  });

  // Append images
  initialOrderDetails.selectedFiles.forEach((file) => {
    data.append("images", file);
  });

  try {
    await apiServer("/api/protected/postOrder", {
      method: "POST",
      body: data,
      headers: {},
    });
  } catch (error: unknown) {
    throw error;
  }
}
