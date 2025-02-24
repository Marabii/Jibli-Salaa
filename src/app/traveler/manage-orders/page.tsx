import apiServer from "@/utils/apiServer";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import Link from "next/link";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import Image from "next/image";

function getOrderStatusDescription(status: ORDER_STATUS): string {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "Order placed, no traveler has accepted it yet";
    case ORDER_STATUS.ORDER_ACCEPTED:
      return "You have accepted the order";
    case ORDER_STATUS.NEGOTIATION_PENDING:
      return "Negotiation in progress.";
    case ORDER_STATUS.ORDER_FINALIZED:
      return "Order details finalized.";
    case ORDER_STATUS.PRICE_FROZEN:
      return "Payment authorized but not yet captured.";
    case ORDER_STATUS.ITEM_BOUGHT:
      return "Item purchased by the traveler.";
    case ORDER_STATUS.EN_ROUTE:
      return "Item is on its way.";
    case ORDER_STATUS.DELIVERED:
      return "Item delivered successfully.";
    case ORDER_STATUS.FUNDS_TRANSFERRED:
      return "Funds have been transferred.";
    default:
      return "Status unknown.";
  }
}

export default async function ManageOrders() {
  const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
    "/api/protected/getUserInfo"
  );
  const userInfo = userInfoResponse.data;
  if (
    userInfo.role !== ROLE.TRAVELER &&
    userInfo.role !== ROLE.TRAVELER_AND_BUYER
  ) {
    throw new Error("Access Denied: You are not authorized to view this page.");
  }

  const response: ApiResponse<CompletedOrder[]> = await apiServer(
    `/api/protected/getOrdersByTravelerId/${userInfo._id}`
  );
  const orders = response.data;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
        <h3 className="text-2xl font-semibold mb-4 text-white">
          No Delivered Orders Yet
        </h3>
        <p className="mb-6 text-gray-300 max-w-xl text-center">
          It seems you haven&apos;t delivered any products so far. To get
          started, schedule a trip, connect with buyers, and accept an order to
          deliver. Once you deliver the product, it will appear here for you to
          claim your payment.
        </p>
        <Link
          href="/traveler/select-trip"
          className="inline-block bg-white text-black py-3 px-6 rounded shadow-md hover:bg-gray-200 transition duration-300"
        >
          Select a Trip
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 text-white">
      <h2 className="text-center text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
        Manage Your Orders
      </h2>
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {orders.map((order, index) => {
          // Show negotiate button only if the order is in a stage where negotiation makes sense.
          const canNegotiate =
            order.orderStatus === ORDER_STATUS.ORDER_ACCEPTED ||
            order.orderStatus === ORDER_STATUS.NEGOTIATION_PENDING;

          return (
            <div
              key={index}
              className="bg-white text-black shadow-xl rounded-lg p-6 transform transition duration-300 hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <Image
                  className="w-20 h-20 object-cover rounded"
                  src={order.images[0]}
                  alt="Product"
                  width={80}
                  height={80}
                />
                <div>
                  <p className="text-xl font-semibold">{order.productName}</p>
                  <p className="text-gray-600">
                    {order.actualDeliveryFee} euros
                  </p>
                  <p className="text-sm font-medium text-blue-700">
                    {getOrderStatusDescription(order.orderStatus)}
                  </p>
                </div>
              </div>
              {canNegotiate && (
                <div className="mt-4 text-right">
                  <Link
                    href={`/negotiate?recipientId=${order.buyerId}&orderId=${order._id}`}
                    className="inline-block bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition duration-300"
                  >
                    Negotiate
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
