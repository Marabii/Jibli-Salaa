import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { BuyerOrderState } from "@/interfaces/Order/order";
import apiServer from "@/utils/apiServer";
import Link from "next/link";
import { Traveler } from "@/interfaces/Traveler/Traveler";

export default async function Header() {
  const cookieStore = cookies();

  const jwtTokenUndecoded: string | undefined =
    cookieStore.get("jwtToken")?.value;

  const userEmail: string | undefined =
    jwtTokenUndecoded && jwtDecode(jwtTokenUndecoded)?.sub;

  const orders: BuyerOrderState["value"][] | undefined =
    userEmail && (await apiServer("/api/protected/getOwnOrders"));

  const trips: Traveler[] | undefined =
    userEmail && (await apiServer("/api/protected/getOwnTrips"));

  return (
    <div>
      <header className="flex justify-between mb-20">
        <Link href="/">
          <h1 className="w-16 cursor-pointer">Jibli Salaa</h1>
        </Link>
        <nav>
          <ul className="flex space-x-5">
            {/* Handle navigation based on user role or absence thereof */}
            {trips && trips.length > 0 && orders && orders.length > 0 ? (
              <>
                <Link href="/select-trip">
                  <li className="cursor-pointer">Manage Trips</li>
                </Link>
                <Link href="/manage-orders">
                  <li className="cursor-pointer">Manage Orders</li>
                </Link>
              </>
            ) : (
              <>
                {trips && trips.length > 0 && (
                  <>
                    <Link href="/select-trip">
                      <li className="cursor-pointer">Manage Trips</li>
                    </Link>
                    <Link href="/buyer">
                      <li className="cursor-pointer">Switch to Buyer</li>
                    </Link>
                  </>
                )}
                {orders && orders.length > 0 && (
                  <>
                    <Link href="/manage-orders">
                      <li className="cursor-pointer">Manage Orders</li>
                    </Link>
                    <Link href="/traveler">
                      <li className="cursor-pointer">Switch to Traveler</li>
                    </Link>
                  </>
                )}
              </>
            )}
            {/* Provide options to become a traveler or buyer if neither */}
            {(!trips || trips.length === 0) &&
              (!orders || orders.length === 0) && (
                <>
                  <Link href="/traveler">
                    <li className="cursor-pointer">Become a Traveler</li>
                  </Link>
                  <Link href="/buyer">
                    <li className="cursor-pointer">Become a Buyer</li>
                  </Link>
                </>
              )}
            <Link href="/latest-deals">
              <li className="cursor-pointer">Latest Deals</li>
            </Link>
          </ul>
        </nav>
        <Link href="/login">Log In</Link>
      </header>
    </div>
  );
}
