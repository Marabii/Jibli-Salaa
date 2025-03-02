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
import { getTranslations } from "next-intl/server";

function truncateAddress(address: string, maxLength: number = 50): string {
  return address.length > maxLength
    ? address.slice(0, maxLength) + "..."
    : address;
}

export default async function SelectTrip() {
  const t = await getTranslations("TravelerTrip.SelectTrip");

  // Fetch User Information
  let userInfo: UserInfo;
  try {
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );
    if (userInfoResponse.status === "SUCCESS" && userInfoResponse.data) {
      userInfo = userInfoResponse.data;
    } else {
      throw new Error(userInfoResponse.message || t("fetchUserError"));
    }
  } catch (error: any) {
    throw new Error(error.message || t("fetchUserError"));
  }

  // Fetch Traveler's Trips
  let tripsOfTraveler: Trip[] = [];
  try {
    const tripsResponse: ApiResponse<Trip[]> = await apiServer(
      "/api/protected/getOwnTrips"
    );
    if (tripsResponse.status === "SUCCESS" && tripsResponse.data) {
      tripsOfTraveler = tripsResponse.data;
    } else {
      throw new Error(tripsResponse.message || t("fetchTripsError"));
    }
  } catch (error: any) {
    throw new Error(error.message || t("fetchTripsError"));
  }

  // Validate User Role
  if (userInfo.role !== ROLE.TRAVELER) {
    throw new Error(t("accessDenied"));
  }

  // Check if Trips Exist
  if (!tripsOfTraveler || tripsOfTraveler.length === 0) {
    redirect("/traveler");
  }

  return (
    <div
      dir="auto"
      className="container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 mt-10"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold mb-8 text-black">
        {t("pageTitle")}
      </h1>
      <h2 className="font-semibold mb-3 text-base sm:text-lg">
        {t("tripCount", { count: tripsOfTraveler.length })}
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
                  {t("from")}{" "}
                  <span className="italic font-semibold">
                    {truncateAddress(trip.itinerary.from.formatted_address, 50)}
                  </span>{" "}
                  {t("to")}{" "}
                  <span className="italic font-semibold">
                    {truncateAddress(trip.itinerary.to.formatted_address, 50)}
                  </span>
                </p>
                <Link
                  className="text-center w-[180px] font-semibold items-center bg-purple-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg hover:bg-purple-600 transition"
                  href={`/traveler/select-trip/accept-orders?latStart=${trip.itinerary.from.lat}&lngStart=${trip.itinerary.from.lng}&latEnd=${trip.itinerary.to.lat}&lngEnd=${trip.itinerary.to.lng}`}
                >
                  {t("selectTripButton")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {tripsOfTraveler.length === 0 && (
        <div className="text-center mt-6">
          <p className="mb-4">{t("noTrips")}</p>
          <Link
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 inline-block"
            href="/traveler"
          >
            {t("registerTrip")}
          </Link>
        </div>
      )}
    </div>
  );
}
