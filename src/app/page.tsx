// File: app/page.tsx

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { BuyerOrderState } from "@/interfaces/Order/order";
import apiServer from "@/utils/apiServer";
import Link from "next/link";
import { Traveler } from "@/interfaces/Traveler/Traveler";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import Footer from "@/components/Footer/Footer";

export default async function HomePage() {
  const cookieStore = await cookies();

  const jwtTokenUndecoded: string | undefined =
    cookieStore.get("jwtToken")?.value;

  const userEmail: string | undefined =
    jwtTokenUndecoded && jwtDecode(jwtTokenUndecoded)?.sub;

  const orders: BuyerOrderState["value"][] = userEmail
    ? await apiServer("/api/protected/getOwnOrders")
    : [];

  const trips: Traveler[] = userEmail
    ? await apiServer("/api/protected/getOwnTrips")
    : [];

  return (
    <div className="font-sans">
      {/* User Dashboard Section */}
      {(orders?.length > 0 || trips?.length > 0) && (
        <section className="py-20 mt-32">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">
              Your Dashboard
            </h2>

            {/* Corrected Logic for Status Message */}
            {orders?.length > 0 && trips?.length > 0 && (
              <h3 className="text-xl mb-4 text-center">
                You have pending orders and scheduled trips.
              </h3>
            )}
            {orders?.length > 0 && !trips?.length && (
              <h3 className="text-xl mb-4 text-center">
                You have pending orders.
              </h3>
            )}
            {!orders?.length && trips?.length > 0 && (
              <h3 className="text-xl mb-4 text-center">
                You have scheduled trips.
              </h3>
            )}

            {/* Display Orders */}
            {orders?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                  Your Orders ({orders.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((order, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded shadow hover:shadow-lg transition"
                    >
                      <h3 className="text-lg font-medium mb-2">
                        {order.productName}
                      </h3>
                      <img
                        className="w-full h-48 object-cover mb-2"
                        src={order.images[0]}
                        alt={order.productName}
                      />
                      {/* Add more order details as needed */}
                      {order.orderStatus === ORDER_STATUS.ITEM_PAID && (
                        <div>
                          <p className="mb-2">
                            When you receive your product, please confirm
                            delivery.
                          </p>
                          <Link
                            href={`/buyer/buyer-pay/confirmDelivery/${order._id}`}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                          >
                            Confirm Delivery
                          </Link>
                        </div>
                      )}
                      {order.orderStatus === ORDER_STATUS.DELIVERED && (
                        <div>
                          <p className="mb-2">
                            You have successfully gotten your product. Can you
                            please tell us your experience ?
                          </p>
                          <Link
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            href={"mailto:jibli.salaa@gmail.com"}
                          >
                            Send Email
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Trips */}
            {trips?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Your Trips ({trips.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trips.map((trip: Traveler, index: number) => (
                    <div
                      key={index}
                      className="border p-4 rounded shadow hover:shadow-lg transition"
                    >
                      <h3 className="text-lg font-medium mb-2">
                        Trip to {trip.itinerary.to.formatted_address}
                      </h3>
                      <p className="text-gray-600">
                        Departure:{" "}
                        {new Date(
                          trip.itinerary.departure
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        Arrival:{" "}
                        {new Date(trip.itinerary.arrival).toLocaleDateString()}
                      </p>
                      {/* Add more trip details as needed */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Connect with Travelers, Get Products Delivered
          </h1>
          <p className="text-xl mb-8">
            Jibli is a platform that connects buyers with travelers for seamless
            delivery of products, both locally and internationally.
          </p>
          <Link
            href="/how-it-works"
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
          >
            Learn How It Works
          </Link>
        </div>
        {/* Placeholder for Hero Image */}
        <div className="mt-10">
          <img
            src="/HomePage/hero-placeholder.jpg"
            alt="Hero Image"
            className="w-[80%] mx-auto object-cover"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Why Use Jibli?</h2>
          <div className="flex flex-wrap -mx-4">
            {/* Feature 1 */}
            <div className="w-full md:w-1/3 px-4 mb-8">
              {/* Placeholder for Image */}
              <img
                src="/HomePage/feature1-placeholder.jpg"
                alt="Affordable Prices"
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Access Global Products
              </h3>
              <p>
                Get items from around the world that are not available or are
                too expensive in your country.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="w-full md:w-1/3 px-4 mb-8">
              {/* Placeholder for Image */}
              <img
                src="/HomePage/feature2-placeholder.jpg"
                alt="Earn Money Traveling"
                className="w-20 rounded-full h-20 mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Earn While Traveling
              </h3>
              <p>
                Travelers can make extra money by delivering items along their
                route.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="w-full md:w-1/3 px-4 mb-8">
              {/* Placeholder for Image */}
              <img
                src="/HomePage/feature3-placeholder.jpg"
                alt="Eco-Friendly"
                className="w-20 h-20 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Sustainable Deliveries
              </h3>
              <p>
                Reduce carbon emissions by utilizing existing travel routes for
                deliveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">How It Works</h2>
          <div className="flex flex-wrap -mx-4">
            {/* Step 1 */}
            <div className="w-full md:w-1/3 px-4 mb-8">
              {/* Placeholder for Image */}
              <img
                src="/HomePage/step1-placeholder.jpg"
                alt="Post a Request"
                className="w-20 rounded-full h-20 mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Post a Request</h3>
              <p>
                Buyers post requests for products they want, specifying details
                and offering a delivery fee.
              </p>
            </div>
            {/* Step 2 */}
            <div className="w-full md:w-1/3 px-4 mb-8">
              {/* Placeholder for Image */}
              <img
                src="/HomePage/step2-placeholder.jpg"
                alt="Traveler Accepts"
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Traveler Accepts the Order
              </h3>
              <p>
                Travelers browse requests and accept orders that fit their
                itinerary.
              </p>
            </div>
            {/* Step 3 */}
            <div className="w-full md:w-1/3 px-4 mb-8">
              {/* Placeholder for Image */}
              <img
                src="/HomePage/step3-placeholder.jpg"
                alt="Delivery and Payment"
                className="w-20 rounded-full h-20 mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Delivery and Confirmation
              </h3>
              <p>
                The traveler delivers the item, and the buyer confirms receipt.
                Payments are securely processed.
              </p>
            </div>
          </div>
          <Link
            href="/sign-up"
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Completed Deals Section */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">
            Successful Deliveries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {completedDeals.map((deal: any, index: number) => (
              <div
                key={index}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              > */}
      {/* Placeholder for Deal Image */}
      {/* <img
                  src={deal.imageUrl || "/images/deal-placeholder.jpg"}
                  alt="Completed Deal"
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-2xl font-semibold mb-2">
                  {deal.productName}
                </h3>
                <p className="text-gray-600 mb-2">
                  From {deal.origin} to {deal.destination}
                </p>
                <p className="text-green-600 font-semibold">
                  Saved {deal.savings} on retail price!
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-xl mb-8">
            Sign up today to start ordering products or earning money as a
            traveler.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/sign-up"
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
            >
              Sign Up as Buyer
            </Link>
            <Link
              href="/sign-up"
              className="bg-green-500 text-white px-6 py-3 rounded-full text-lg hover:bg-green-600 transition"
            >
              Sign Up as Traveler
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
