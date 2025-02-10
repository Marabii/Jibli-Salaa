export const dynamic = "force-dynamic";

import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import OrderDetails from "./components/OrderDetails";
import apiServer from "@/utils/apiServer";
import Link from "next/link";
import { PhoneIcon } from "@heroicons/react/24/solid";

export default async function Contact() {
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
            No Contacts Available
          </h2>
          <p className="text-gray-400 mt-2">
            You currently have no contacts. Start by adding a new contact to
            manage your orders effectively.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 animate-slideIn">
          Your Contacts
        </h1>
        <ul className="flex flex-wrap justify-center gap-8">
          {userInfo.contacts.map((contact) => (
            <li
              key={contact.contactId}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fadeInUp"
            >
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {contact.contactName}
                </h2>
                <OrderDetails orderId={contact.orderId} />
                <Link
                  href={`/negotiate?recipientId=${contact.contactId}&orderId=${contact.orderId}`}
                  className="text-sm items-center bg-purple-500 text-white px-6 py-3 rounded-full flex justify-center hover:bg-purple-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mr-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  Speak to{" "}
                  <span className="ml-1 font-bold">{contact.contactName}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
