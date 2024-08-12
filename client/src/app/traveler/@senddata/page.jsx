"use client";

import { useSelector } from "react-redux";
import apiClient from "@/components/apiClient";

export default function sendData() {
  const travelerTrip = useSelector((state) => state.travelerTrip.value);

  const handleData = async () => {
    console.log("sending data: ", travelerTrip);

    await apiClient(
      "/api/createTraveler",
      {
        method: "POST",
        body: JSON.stringify(travelerTrip),
      },
      travelerTrip
    );
  };

  return <button onClick={handleData}>Save Trip</button>;
}
