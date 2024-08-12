"use client";
import { setTravelerTrip } from "@/store/TravelerTripSlice/slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function TripDate() {
  const dispatch = useDispatch();
  const travelerTrip = useSelector((state) => state.travelerTrip.value);
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  // Initialize with existing values from travelerTrip
  useEffect(() => {
    if (travelerTrip.departureDate) {
      setDepartureDate(travelerTrip.departureDate);
    }
    if (travelerTrip.arrivalDate) {
      setArrivalDate(travelerTrip.arrivalDate);
    }
  }, [travelerTrip]);

  const handleDepartureChange = (e) => {
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
    dispatch(setTravelerTrip({ departureDate: dateValue }));
  };

  const handleArrivalChange = (e) => {
    const dateValue = e.target.value;
    const arrivalDate = new Date(dateValue);
    const departureDate = new Date(travelerTrip.departureDate || departureDate);

    // Check if arrival date is after the departure date
    if (!departureDate || arrivalDate <= departureDate) {
      alert("Arrival date must be later than the departure date.");
      e.target.value = ""; // Clear the invalid input
      return;
    }

    // Update local state and dispatch to Redux
    setArrivalDate(dateValue);
    dispatch(setTravelerTrip({ arrivalDate: dateValue }));
  };

  return (
    <div>
      <h2>Enter the departure date and time of your trip</h2>
      <input
        type="datetime-local"
        value={departureDate}
        onChange={handleDepartureChange}
      />

      <h2>Enter the arrival date and time of your trip</h2>
      <input
        type="datetime-local"
        value={arrivalDate}
        onChange={handleArrivalChange}
      />
    </div>
  );
}
