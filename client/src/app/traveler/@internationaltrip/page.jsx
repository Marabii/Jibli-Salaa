"use client";

import { useDispatch, useSelector } from "react-redux";
import { setTravelerTrip } from "@/store/TravelerTripSlice/slice";

export default function InternationalTripPage() {
  const dispatch = useDispatch();
  const travelerTrip = useSelector((state) => state.travelerTrip.value);

  const isTripInternational = () => {
    const { start, destination } = travelerTrip;
    const addressPartsStart = start?.formatted_address.split(",");
    const addressPartsDestination = destination?.formatted_address.split(",");
    const startCountry =
      addressPartsStart[addressPartsStart?.length - 1]?.trim();
    const destinationCountry =
      addressPartsDestination[addressPartsDestination?.length - 1]?.trim();
    if (
      startCountry &&
      destinationCountry &&
      startCountry !== destinationCountry
    )
      return true;
    return false;
  };

  console.log("isTripInternational: ", isTripInternational());

  return (
    <>
      {" "}
      {isTripInternational() && (
        <>
          <p>We noticed that you plan to have an international trip</p>
          <p>
            Do you plan on including any import taxes in your personal fee or
            not ?
          </p>
          <input
            type="radio"
            name="areTaxesIncluded"
            id="areTaxesIncluded"
            value={"yes"}
            onClick={(e) =>
              dispatch(
                setTravelerTrip({
                  areTaxesIncluded: true,
                  isInternational: true,
                })
              )
            }
          />
          <label htmlFor="areTaxesIncluded">Yes</label>
          <input
            type="radio"
            name="areTaxesIncluded"
            id="areTaxesIncluded"
            value={"no"}
            onClick={(e) =>
              dispatch(
                setTravelerTrip({
                  areTaxesIncluded: false,
                  isInternational: true,
                })
              )
            }
          />
          <label htmlFor="areTaxesIncluded">No</label>
        </>
      )}
    </>
  );
}
