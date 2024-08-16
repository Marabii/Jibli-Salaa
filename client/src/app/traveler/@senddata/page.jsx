"use client";

import { useSelector } from "react-redux";
import apiClient from "@/utils/apiClient";

export default function sendData() {
  const travelerTrip = useSelector((state) => state.travelerTrip.value);

  const handleData = async () => {
    await apiClient("/api/createTraveler", {
      method: "POST",
      body: JSON.stringify(travelerTrip),
    });
  };

  return <button onClick={handleData}>Save Trip</button>;
}
