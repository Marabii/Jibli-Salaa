// Header.tsx
import Link from "next/link";
import NotificationsDropdown from "./NotificationsDropdown";
import apiServer from "@/utils/apiServer";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";

interface IVerifyUserResponse {
  success: boolean;
}

export default async function Header() {
  let userInfo: UserInfo | null = null;
  let isUserAuthenticated = false;

  try {
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );
    userInfo = userInfoResponse.data;
  } catch (error) {}

  try {
    const verifyUserResponse: ApiResponse<IVerifyUserResponse> =
      await apiServer("/api/protected/verifyUser");
    isUserAuthenticated = verifyUserResponse.data.success;
  } catch (error) {}

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md p-5 md:px-10 flex justify-between items-center">
      {/* Logo / Brand */}
      <Link href="/">
        <h1 className="text-xl font-bold text-gray-800 cursor-pointer hover:text-gray-600">
          Jibli Salaa
        </h1>
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-4 md:space-x-8 items-center">
          {/* If user has BOTH traveler and buyer roles */}
          {userInfo?.role === ROLE.TRAVELER_AND_BUYER && (
            <>
              <Link href="/traveler/select-trip">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Manage Trips
                </li>
              </Link>
              <Link href="/manage-orders">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Manage Orders
                </li>
              </Link>
            </>
          )}

          {/* If user is traveler OR buyer */}
          {userInfo?.role === ROLE.TRAVELER && (
            <>
              <Link href="/traveler/manage-orders">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Manage Orders
                </li>
              </Link>
              <Link href="/traveler/select-trip">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Select Trip
                </li>
              </Link>
              <Link href="/buyer">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Switch to Buyer
                </li>
              </Link>
            </>
          )}
          {userInfo?.role === ROLE.BUYER && (
            <>
              <Link href="/buyer/manage-orders">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Manage Orders
                </li>
              </Link>
              <Link href="/traveler">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Switch to Traveler
                </li>
              </Link>
            </>
          )}

          {/* If user has neither role OR not logged in */}
          {(!userInfo || userInfo?.role === ROLE.NEITHER) && (
            <>
              <Link href="/traveler">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Become a Traveler
                </li>
              </Link>
              <Link href="/buyer">
                <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                  Become a Buyer
                </li>
              </Link>
            </>
          )}

          {/* Contact link if user is logged in */}
          {userInfo && (
            <Link href="/contact">
              <li className="cursor-pointer text-sm md:text-base text-gray-700 hover:text-blue-500">
                Contact
              </li>
            </Link>
          )}
        </ul>
      </nav>

      {/* Auth & Notifications Section */}
      <div className="flex gap-5 items-center">
        {!isUserAuthenticated && (
          <Link
            href="/login"
            className="text-sm md:text-base text-gray-700 hover:text-blue-500"
          >
            Log In
          </Link>
        )}
        {isUserAuthenticated && <NotificationsDropdown />}
      </div>
    </header>
  );
}
