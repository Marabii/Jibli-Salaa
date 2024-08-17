"use client";

import { useSelector } from "react-redux";
import apiClient from "@/utils/apiClient";
import { useRouter } from "next/navigation";

export default function sendData() {
  const travelerTrip = useSelector((state) => state.travelerTrip.value);
  const router = useRouter();

  const handleData = async () => {
    await apiClient("/api/createTraveler", {
      method: "POST",
      body: JSON.stringify(travelerTrip),
    });
    router.replace("/select-trip");
  };

  return <button onClick={handleData}>Save Trip</button>;
}
