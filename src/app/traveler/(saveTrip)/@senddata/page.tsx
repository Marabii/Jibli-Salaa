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

  return (
    <button
      className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
      onClick={handleData}
    >
      Save Trip
    </button>
  );
}
