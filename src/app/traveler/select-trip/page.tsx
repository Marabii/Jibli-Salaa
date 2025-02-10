// app/traveler/select-trip/page.tsx
export const dynamic = "force-dynamic";

import "server-only";
import Link from "next/link";
import apiServer from "@/utils/apiServer";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { Trip } from "@/interfaces/Traveler/Traveler";
import { redirect } from "next/navigation";

export default async function SelectTrip() {
  let userInfo: UserInfo;
  let tripsOfTraveler: Trip[] = [];

  // Fetch User Information
  try {
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );
    if (userInfoResponse.status === "SUCCESS" && userInfoResponse.data) {
      userInfo = userInfoResponse.data;
    } else {
      throw new Error(
        userInfoResponse.message || "Failed to fetch user information."
      );
    }
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An unexpected error occurred while fetching user information."
    );
  }

  // Fetch Traveler's Trips
  try {
    const tripsOfTravelerResponse: ApiResponse<Trip[]> = await apiServer(
      "/api/protected/getOwnTrips"
    );

    if (
      tripsOfTravelerResponse.status === "SUCCESS" &&
      tripsOfTravelerResponse.data
    ) {
      tripsOfTraveler = tripsOfTravelerResponse.data;
    } else {
      throw new Error(
        tripsOfTravelerResponse.message || "Failed to fetch trips."
      );
    }
  } catch (error: any) {
    throw new Error(
      error.message || "An unexpected error occurred while fetching trips."
    );
  }

  // Validate User Role
  if (
    userInfo.role !== ROLE.TRAVELER &&
    userInfo.role !== ROLE.TRAVELER_AND_BUYER
  ) {
    throw new Error(
      "You are not a traveler. Please sign in as a traveler to access this page."
    );
  }

  // Check if Trips Exist
  if (!tripsOfTraveler || tripsOfTraveler.length === 0) {
    redirect("/traveler");
  }

  return (
    <div className="mx-auto max-w-4xl mt-10 p-5">
      <h1 className="text-4xl text-center font-bold mb-8 text-black">
        Select a Trip
      </h1>
      <h2 className="font-semibold mb-3">
        You are scheduled for {tripsOfTraveler.length} trip
        {tripsOfTraveler.length > 1 ? "s" : ""}
      </h2>
      <div>
        <ul className="space-y-2">
          {tripsOfTraveler.map((trip) => (
            <li
              key={trip._id}
              className="border-2 border-black p-6 rounded-3xl hover:shadow-2xl transition flex flex-col w-full h-full"
            >
              <div className="flex items-center space-x-4">
                <div className="flex w-full items-center justify-between">
                  <p className="w-fit align-middle mr-5">
                    From{" "}
                    <span className="italic font-semibold">
                      {trip.itinerary.from.formatted_address}
                    </span>{" "}
                    to{" "}
                    <span className="italic font-semibold">
                      {trip.itinerary.to.formatted_address}
                    </span>
                  </p>
                  <Link
                    className="inline-flex font-semibold items-center bg-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
                    href={`/traveler/select-trip/accept-orders?latStart=${trip.itinerary.from.lat}&lngStart=${trip.itinerary.from.lng}&latEnd=${trip.itinerary.to.lat}&lngEnd=${trip.itinerary.to.lng}`}
                  >
                    Select this trip
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {tripsOfTraveler.length === 0 && (
        <div className="text-center">
          <p>You haven&apos;t registered any trips yet.</p>
          <Link
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            href={"/traveler"}
          >
            Register a trip
          </Link>
        </div>
      )}
    </div>
  );
}
