import "server-only";
import apiServer from "@/utils/apiServer";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";
import { getTranslations } from "next-intl/server";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { Link } from "@/i18n/navigation";
import NegotiatePageClient from "./components/NegotiatePageClient";

interface ErrorCardProps {
  title: string;
  message: string;
  showLink?: boolean;
}

const ErrorCard = ({ title, message, showLink = false }: ErrorCardProps) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="max-w-md w-full bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="mb-4">{message}</p>
      {showLink && <Link href="/">Go Home</Link>}
    </div>
  </div>
);

export default async function NegotiatePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; recipientId?: string }>;
}) {
  const t = await getTranslations("Negotiate.Page");
  const { orderId, recipientId } = await searchParams;

  // Validate required search parameters
  if (!orderId) {
    throw new Error(
      t("missingOrderId") || "Order ID is missing. Please try again."
    );
  }

  let userInfo: UserInfo | null = null;
  let recipientInfo: UserInfo | null = null;
  let orderInfo: CompletedOrder | null = null;
  let messages: ChatMessage[] | null = null;

  // Fetch the current user's info and order details in parallel
  try {
    const [userResponse, orderResponse] = await Promise.all([
      apiServer("/api/protected/getUserInfo") as Promise<ApiResponse<UserInfo>>,
      apiServer(`/api/getOrderById/${orderId}`, {
        next: { tags: ["orderInfo"] },
      }) as Promise<ApiResponse<CompletedOrder>>,
    ]);
    userInfo = userResponse.data;
    orderInfo = orderResponse.data;
  } catch (error: unknown) {
    console.error("Error fetching initial data:", error);
    if (error instanceof Error) {
      throw new Error(
        t("fetchError", { error: error.message }) ||
          `An error occurred while fetching data: ${error.message}`
      );
    }
    throw new Error("An unexpected error occurred. Please contact support.");
  }

  // For pending orders, ensure that the recipient ID is provided and valid
  if (orderInfo.orderStatus === ORDER_STATUS.PENDING) {
    if (!recipientId) {
      return (
        <ErrorCard
          title="Missing Information"
          message="Recipient details are missing. We cannot load the negotiation page without them."
          showLink={true}
        />
      );
    }
    if (userInfo._id === recipientId) {
      return (
        <ErrorCard
          title="Invalid Role"
          message={`It appears you placed the order for "${orderInfo.productName}". You cannot act as both buyer and traveler.`}
          showLink={true}
        />
      );
    }
  }

  // Fetch recipient info and chat history based on the order status and user's role
  try {
    if (orderInfo.orderStatus === ORDER_STATUS.PENDING) {
      // For pending orders, use the provided recipientId
      const recipientResponse = (await apiServer(
        `/api/protected/getUserInfo/${recipientId}`
      )) as ApiResponse<UserInfo>;
      recipientInfo = recipientResponse.data;
      const chatResponse = (await apiServer(
        `/api/protected/getUserChatHistory/${recipientId}`
      )) as ApiResponse<ChatMessage[]>;
      messages = chatResponse.data;
    } else {
      // For active orders, determine the negotiation partner based on the current user role
      if (orderInfo.buyerId === userInfo._id) {
        const recipientResponse = (await apiServer(
          `/api/protected/getUserInfo/${orderInfo.travelerId}`
        )) as ApiResponse<UserInfo>;
        recipientInfo = recipientResponse.data;
        const chatResponse = (await apiServer(
          `/api/protected/getUserChatHistory/${orderInfo.travelerId}`
        )) as ApiResponse<ChatMessage[]>;
        messages = chatResponse.data;
      } else if (orderInfo.travelerId === userInfo._id) {
        const recipientResponse = (await apiServer(
          `/api/protected/getUserInfo/${orderInfo.buyerId}`
        )) as ApiResponse<UserInfo>;
        recipientInfo = recipientResponse.data;
        const chatResponse = (await apiServer(
          `/api/protected/getUserChatHistory/${orderInfo.buyerId}`
        )) as ApiResponse<ChatMessage[]>;
        messages = chatResponse.data;
      } else {
        throw new Error(
          "User role mismatch: you are neither the buyer nor the traveler for this order."
        );
      }
    }
  } catch (error: unknown) {
    console.error("Error fetching negotiation data:", error);
    if (error instanceof Error) {
      throw new Error(
        t("fetchError", { error: error.message }) ||
          `An error occurred while fetching negotiation data: ${error.message}`
      );
    }
    throw new Error("An unexpected error occurred. Please contact support.");
  }

  // Render the negotiation page client with the fetched data
  return (
    <NegotiatePageClient
      userInfo={userInfo}
      recipientInfo={recipientInfo}
      orderInfo={orderInfo}
      chatHistory={messages}
    />
  );
}
