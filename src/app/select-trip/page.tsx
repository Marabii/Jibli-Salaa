import Link from "next/link";
import apiServer from "@/utils/apiServer";
import type { UserInfo } from "@/interfaces/userInfo/userInfo";
import type { Traveler } from "@/interfaces/Traveler/Traveler";

export default async function AcceptOrders() {
  let userInfo: UserInfo | undefined;
  let tripsOfTraveler: Traveler[] | undefined;

  try {
    const userInfoResponse: UserInfo = await apiServer(
      "/api/protected/getUserInfo"
    );
    userInfo = userInfoResponse;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }

  try {
    const travelerResponse: Traveler[] = await apiServer(
      `/api/getTripsOfTraveler/${userInfo?._id}`
    );
    tripsOfTraveler = travelerResponse;
  } catch (error) {
    console.error("Failed to fetch trips of traveler:", error);
  }

  if (!userInfo || !tripsOfTraveler) {
    return (
      <div>
        <h1>Error</h1>
        <p>An error occurred while fetching data.</p>
        <Link href="/">Go to Home</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Accept Orders</h1>
      {tripsOfTraveler.length > 0 ? (
        <div>
          <div>
            <p>{userInfo.name}</p>
            <p>{userInfo.email}</p>
          </div>
          <div>
            <h2>
              You are scheduled for {tripsOfTraveler.length} trip
              {tripsOfTraveler.length > 1 ? "s" : ""}
            </h2>
            <div>
              <ul>
                {tripsOfTraveler.map((trip) => (
                  <li key={trip._id}>
                    <button>
                      From {trip.itinerary.from.formatted_address} to{" "}
                      {trip.itinerary.to.formatted_address}
                    </button>
                    <Link
                      href={`/select-trip/accept-orders?countryStart=${trip.itinerary.from.country}&latStart=${trip.itinerary.from.lat}&lngStart=${trip.itinerary.from.lng}&countryEnd=${trip.itinerary.to.country}&latEnd=${trip.itinerary.to.lat}&lngEnd=${trip.itinerary.to.lng}`}
                    >
                      Select this trip
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p>You haven't registered any trips yet.</p>
          <Link href={"/traveler"}>Register a trip</Link>
        </>
      )}
    </div>
  );
}
