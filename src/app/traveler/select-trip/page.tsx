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
  if (userInfo.role !== ROLE.TRAVELER) {
    throw new Error(
      "You are not a traveler. Please sign in as a traveler to access this page."
    );
  }

  // Check if Trips Exist
  if (!tripsOfTraveler || tripsOfTraveler.length === 0) {
    redirect("/traveler");
  }

  // Helper function to truncate addresses if they are too long
  const truncateAddress = (address: string, maxLength: number = 50): string =>
    address.length > maxLength ? address.slice(0, maxLength) + "..." : address;

  return (
    <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold mb-8 text-black">
        Select a Trip
      </h1>
      <h2 className="font-semibold mb-3 text-base sm:text-lg">
        You are scheduled for {tripsOfTraveler.length} trip
        {tripsOfTraveler.length > 1 ? "s" : ""}
      </h2>
      <div>
        <ul className="space-y-4">
          {tripsOfTraveler.map((trip) => (
            <li
              key={trip._id}
              className="border border-black p-4 sm:p-6 rounded-3xl hover:shadow-lg transition flex flex-col"
            >
              <div className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0">
                <p className="text-sm sm:text-base">
                  From{" "}
                  <span className="italic font-semibold">
                    {truncateAddress(trip.itinerary.from.formatted_address, 50)}
                  </span>{" "}
                  to{" "}
                  <span className="italic font-semibold">
                    {truncateAddress(trip.itinerary.to.formatted_address, 50)}
                  </span>
                </p>
                <Link
                  className="text-center w-[180px] font-semibold items-center bg-purple-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg hover:bg-purple-600 transition"
                  href={`/traveler/select-trip/accept-orders?latStart=${trip.itinerary.from.lat}&lngStart=${trip.itinerary.from.lng}&latEnd=${trip.itinerary.to.lat}&lngEnd=${trip.itinerary.to.lng}`}
                >
                  Select this trip
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {tripsOfTraveler.length === 0 && (
        <div className="text-center mt-6">
          <p className="mb-4">You haven&apos;t registered any trips yet.</p>
          <Link
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 inline-block"
            href={"/traveler"}
          >
            Register a trip
          </Link>
        </div>
      )}
    </div>
  );
}
