import { Errors } from "@/interfaces/Errors/errors";
import { Itinerary } from "@/interfaces/Traveler/Traveler";

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<Itinerary>;
};

const validateForm = (
  itinerary: Itinerary,
  t: (key: string) => string
): ValidateFormResponse => {
  const errors: Errors<Itinerary> = {};

  // Helper function to check if a value is empty
  const isEmpty = (value: any): boolean =>
    value === undefined || value === null || value === "";

  // Validate 'from' AddressObject
  if (!itinerary.from) {
    errors["from"] = t("Validation.fromAddressRequired");
  } else {
    if (isEmpty(itinerary.from.formatted_address)) {
      errors["from.formatted_address"] = t("Validation.fromAddressRequired");
    }
    if (isEmpty(itinerary.from.lat)) {
      errors["from.lat"] = t("Validation.fromLatitudeRequired");
    }
    if (isEmpty(itinerary.from.lng)) {
      errors["from.lng"] = t("Validation.fromLongitudeRequired");
    }
  }

  // Validate 'to' AddressObject
  if (!itinerary.to) {
    errors["to"] = t("Validation.toAddressRequired");
  } else {
    if (isEmpty(itinerary.to.formatted_address)) {
      errors["to.formatted_address"] = t("Validation.toAddressRequired");
    }
    if (isEmpty(itinerary.to.lat)) {
      errors["to.lat"] = t("Validation.toLatitudeRequired");
    }
    if (isEmpty(itinerary.to.lng)) {
      errors["to.lng"] = t("Validation.toLongitudeRequired");
    }
  }

  // Validate 'departure' date
  if (!itinerary.departure) {
    errors["departure"] = t("Validation.departureRequired");
  } else {
    const departureDate = new Date(itinerary.departure);
    const now = new Date();
    if (isNaN(departureDate.getTime())) {
      errors["departure"] = t("Validation.departureInvalid");
    } else if (departureDate <= now) {
      errors["departure"] = t("Validation.departureFuture");
    }
  }

  // Validate 'arrival' date
  if (!itinerary.arrival) {
    errors["arrival"] = t("Validation.arrivalRequired");
  } else {
    const arrivalDate = new Date(itinerary.arrival);
    const now = new Date();
    if (isNaN(arrivalDate.getTime())) {
      errors["arrival"] = t("Validation.arrivalInvalid");
    } else if (arrivalDate <= now) {
      errors["arrival"] = t("Validation.arrivalFuture");
    }
  }

  // Check if departure is before arrival
  if (itinerary.departure && itinerary.arrival) {
    const departureDate = new Date(itinerary.departure);
    const arrivalDate = new Date(itinerary.arrival);
    if (
      !isNaN(departureDate.getTime()) &&
      !isNaN(arrivalDate.getTime()) &&
      departureDate >= arrivalDate
    ) {
      errors["departure"] = t("Validation.departureBeforeArrival");
      errors["arrival"] = t("Validation.arrivalAfterDeparture");
    }
  }

  const isError = Object.keys(errors).length > 0;

  return { isError, errors };
};

export default validateForm;
