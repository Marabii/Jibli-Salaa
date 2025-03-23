export const dynamic = "force-dynamic";

import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiServer from "@/utils/apiServer";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { getTranslations } from "next-intl/server";
import { CompletedOrder } from "@/interfaces/Order/order";
import CurrentOrders from "./components/CurrentOrders";

export interface ContactDetails {
  contactId: string;
  contactName: string;
  orderInfo: CompletedOrder;
}

export default async function Contact() {
  const tContact = await getTranslations("ContactPage");

  let userInfo: UserInfo | null = null;
  try {
    const fetchUserResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );
    userInfo = fetchUserResponse.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }

  if (!userInfo?.contacts || userInfo.contacts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center animate-fadeIn">
          <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="text-3xl font-semibold text-gray-200 mt-4">
            {tContact("noContact")}
          </h2>
          <p className="text-gray-400 mt-2">{tContact("noContactsMessage")}</p>
        </div>
      </div>
    );
  }

  let contactDetails: ContactDetails[] = [];
  try {
    const contactPromises = userInfo.contacts.map(async (contact) => {
      return {
        contactId: contact.contactId,
        contactName: contact.contactName,
        orderInfo: (
          (await apiServer(
            `/api/getOrderById/${contact.orderId}`
          )) as ApiResponse<CompletedOrder>
        ).data as CompletedOrder,
      };
    });

    contactDetails = await Promise.all(contactPromises);
  } catch (error) {
    console.error("Error fetching contact details:", error);
    throw error;
  }

  return (
    <div className="min-h-screen text-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 animate-slideIn">
          {tContact("contactsHeader")}
        </h1>
        <div className="max-h-[80vh] overflow-y-auto">
          <CurrentOrders
            contactDetails={contactDetails}
            userCurrency={userInfo.userBankCurrency}
          />
        </div>
      </div>
    </div>
  );
}
