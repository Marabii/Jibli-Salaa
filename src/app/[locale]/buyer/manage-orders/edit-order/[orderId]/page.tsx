import FormWrapper from "@/components/Form/FormWrapper";
import Tetromino from "@/components/Loading/Tetromino/Tetromino";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder, Dimensions } from "@/interfaces/Order/order";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import apiServer from "@/utils/apiServer";
import FormUsualInputs from "./Form/FormUsualInputs";
import FormMapInput from "./Form/FormMapinput";
import FormImagesInput from "./Form/FormImagesInput";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import FormSubmissionButton from "./Form/FormSubmissionButton";
import { editOrderAction } from "./Utilis/editOrderAction";
import { AddressObject } from "@/interfaces/Map/AddressObject";

export interface EditOrderI {
  description?: string;
  deliveryInstructions?: string;
  productName?: string;
  newImagesFiles?: File[];
  removeImages?: string[];
  dimensions?: Dimensions;
  estimatedValue?: number;
  initialDeliveryFee?: number;
  productURL?: string;
  quantity?: number;
  preferredPickupPlace?: AddressObject;
  orderId: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  let orderInfo: CompletedOrder | null = null;
  let userInfo: UserInfo | null = null;

  try {
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo",
      { cache: "no-store" }
    );
    userInfo = userInfoResponse.data;
  } catch (error) {
    console.error("Error fetching user info", error);
  }

  try {
    const orderResponse: ApiResponse<CompletedOrder> = await apiServer(
      `/api/getOrderById/${orderId}`,
      { cache: "no-store" }
    );
    orderInfo = orderResponse.data;
  } catch (error) {
    console.error("Failed to fetch order info:", error);
  }

  if (!orderInfo || !userInfo) {
    return <Tetromino />;
  }

  if (orderInfo.buyerId !== userInfo._id) {
    throw new Error("You are not authorized to view this page");
  }

  return (
    <FormWrapper<EditOrderI>
      className="relative z-0 my-5 mx-auto w-full max-w-screen-2xl p-6 bg-white rounded-lg shadow-md"
      action={editOrderAction}
      redirectTo="/buyer/manage-orders"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormUsualInputs orderInfoOrg={orderInfo} />
        <div className="flex w-full flex-col mx-auto">
          <FormMapInput orderInfoOrg={orderInfo} />
          <FormImagesInput orderInfoOrg={orderInfo} />
        </div>
      </div>
      <FormErrorHandler />
      <FormSubmissionButton />
    </FormWrapper>
  );
}
