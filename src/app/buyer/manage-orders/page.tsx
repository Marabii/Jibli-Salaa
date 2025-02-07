import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import ImageModalWrapper from "./ImageModal";
import Image from "next/image";
import Link from "next/link";
import apiServer from "@/utils/apiServer";

export default async function ManageOrders() {
  const response: ApiResponse<CompletedOrder[]> = await apiServer(
    "/api/protected/getOwnOrders"
  );

  const orders = response.data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Manage Your Orders
        </h1>
        {orders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {order.images && order.images.length > 0 && (
                  <div className="relative h-48 w-full">
                    <ImageModalWrapper
                      src={order.images[0]}
                      alt={order.productName}
                    >
                      <Image
                        src={order.images[0]}
                        alt={order.productName}
                        sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"
                        fill
                        className="transition-transform duration-300 transform hover:scale-105 rounded-t-lg"
                      />
                    </ImageModalWrapper>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {order.productName}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {order.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-800">
                      <span className="font-medium">Quantity:</span>{" "}
                      {order.quantity}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Value:</span> €
                      {order.actualValue.toFixed(2)}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Delivery Fee:</span> €
                      {order.actualDeliveryFee.toFixed(2)}
                    </p>
                    <p className="text-gray-800 flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          order.orderStatus === "ORDER_FINALIZED"
                            ? "bg-blue-100 text-blue-800"
                            : order.orderStatus === "ITEM_PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </p>
                    {order.placedAt && (
                      <p className="text-gray-600">
                        <span className="font-medium">Placed At:</span>{" "}
                        {new Date(order.placedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  {/* Conditional actions based on orderStatus */}
                  <div className="flex space-x-4">
                    {order.orderStatus === "ORDER_FINALIZED" && (
                      <Link
                        className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        href={`/buyer/buyer-pay/${order._id}`}
                      >
                        Proceed to Payment
                      </Link>
                    )}
                    {order.orderStatus === "ITEM_PAID" && (
                      <Link
                        className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                        href={`/buyer/buyer-pay/confirmDelivery/${order._id}`}
                      >
                        Confirm Delivery
                      </Link>
                    )}
                    {/* Additional actions can be added here based on other statuses */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
