import { CompletedOrder } from "@/interfaces/Order/order";
import apiServer from "@/utils/apiServer";

export default async function OrderDetails({ orderId }: { orderId: string }) {
  let orderDetails: CompletedOrder | null;

  try {
    const fetchOrderDetailsResponse = await apiServer(
      `/api/getOrderById/${orderId}`
    );
    orderDetails = fetchOrderDetailsResponse.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return (
      <div className="bg-gray-700 text-red-400 p-3 rounded mt-2 animate-fadeIn">
        Unable to load order details.
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="bg-gray-700 text-yellow-400 p-3 rounded mt-2 animate-fadeIn">
        No order details available.
      </div>
    );
  }

  return (
    <div className="mt-4 animate-fadeIn">
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        <div>
          <span className="text-gray-400 font-medium">Product:</span>{" "}
          <span className="text-white">{orderDetails.productName}</span>
        </div>
        <div>
          <span className="text-gray-400 font-medium">Price:</span>{" "}
          <span className="text-white">${orderDetails.estimatedValue}</span>
        </div>
        <div>
          <span className="text-gray-400 font-medium">Quantity:</span>{" "}
          <span className="text-white">{orderDetails.quantity}</span>
        </div>
        <div>
          <span className="text-gray-400 font-medium">Delivery Fee:</span>{" "}
          <span className="text-white">${orderDetails.initialDeliveryFee}</span>
        </div>
      </div>
    </div>
  );
}
