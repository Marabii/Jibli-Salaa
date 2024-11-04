"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTravelerTrip } from "@/store/TravelerTripSlice/slice";
import type { TravelerTripState } from "@/interfaces/Traveler/TravelerTripState";

export default function TripDate() {
  const dispatch = useAppDispatch();
  const travelerTrip: TravelerTripState["value"] = useAppSelector(
    (state) => state.travelerTrip.value
  );
  const [departureDate, setDepartureDate] = useState<string>("");
  const [arrivalDate, setArrivalDate] = useState<string>("");

  // Initialize with existing values from travelerTrip
  useEffect(() => {
    if (travelerTrip.departure) {
      setDepartureDate(travelerTrip.departure);
    }
    if (travelerTrip.arrival) {
      setArrivalDate(travelerTrip.arrival);
    }
  }, [travelerTrip]);

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const departureDate = new Date(dateValue);
    const now = new Date();

    // Check if departure date is in the future
    if (departureDate <= now) {
      alert("Departure date must be later than the current date and time.");
      e.target.value = ""; // Clear the invalid input
      return;
    }

    // Update local state and dispatch to Redux
    setDepartureDate(dateValue);
    dispatch(setTravelerTrip({ departure: dateValue }));
  };

  const handleArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const arrivalDate = new Date(dateValue);
    const currentDepartureDate = new Date(travelerTrip.departure || "");

    // Check if arrival date is after the departure date
    if (!travelerTrip.departure || arrivalDate <= currentDepartureDate) {
      alert("Arrival date must be later than the departure date.");
      e.target.value = ""; // Clear the invalid input
      return;
    }

    // Update local state and dispatch to Redux
    setArrivalDate(dateValue);
    dispatch(setTravelerTrip({ arrival: dateValue }));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Enter the departure date and time of your trip
      </h2>
      <input
        type="datetime-local"
        value={departureDate}
        onChange={handleDepartureChange}
        className="w-full p-2 text-gray-700 border rounded-md shadow-sm mb-4"
      />

      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Enter the arrival date and time of your trip
      </h2>
      <input
        type="datetime-local"
        value={arrivalDate}
        onChange={handleArrivalChange}
        className="w-full p-2 text-gray-700 border rounded-md shadow-sm mb-4"
      />
    </div>
  );
}
