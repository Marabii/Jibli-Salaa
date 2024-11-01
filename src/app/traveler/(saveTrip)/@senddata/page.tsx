"use client";

import apiClient from "@/utils/apiClient";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { TravelerTripState } from "@/interfaces/Traveler/TravelerTripState";

export default function sendData() {
  const travelerTrip: TravelerTripState["value"] = useAppSelector(
    (state) => state.travelerTrip.value
  );
  const router = useRouter();

  const handleData = async () => {
    await apiClient("/api/protected/postTravelerTrip", {
      method: "POST",
      body: JSON.stringify(travelerTrip),
    });
    router.replace("/traveler/select-trip");
  };

  return <button onClick={handleData}>Save Trip</button>;
}
