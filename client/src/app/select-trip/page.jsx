import Link from "next/link";
import apiServer from "@/utils/apiServer";

export default async function AcceptOrders() {
  const { traveler } = await apiServer("/api/getTraveler");
  const { userInfo } = await apiServer("/api/getUser");

  return (
    <div>
      <h1>Accept Orders</h1>
      {traveler ? (
        <div>
          <div>
            <p>{userInfo.name}</p>
            <p>{userInfo.email}</p>
          </div>
          <div>
            <h2>
              You are scheduled for {traveler.trips.length} trip
              {traveler.trips.length > 1 ? "s" : ""}
            </h2>
            <div>
              <ul>
                {traveler.trips.map((trip) => (
                  <li key={trip._id}>
                    <button>
                      From {trip.departureCity.formatted_address} to{" "}
                      {trip.destinationCity.formatted_address}
                    </button>
                    <Link
                      href={`/select-trip/accept-orders?tripId=${trip._id}&latStart=${trip.departureCity.lat}&lngStart=${trip.departureCity.lng}&latEnd=${trip.destinationCity.lat}&lngEnd=${trip.destinationCity.lng}`}
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
          <p>You haven't registered any trips yet</p>
          <Link href={"/traveler"}>Register a trip</Link>
        </>
      )}
    </div>
  );
}
