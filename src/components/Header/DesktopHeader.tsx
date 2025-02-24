"use client";

import Link from "next/link";
import Image from "next/image";
import NotificationsDropdown from "./NotificationsDropdown";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useRef } from "react";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { toast } from "react-toastify";

interface DesktopHeaderProps {
  userInfo: UserInfo | null;
  isUserAuthenticated: boolean;
  handleLogout: () => void;
}

export default function DesktopHeader({
  userInfo,
  isUserAuthenticated,
  handleLogout,
}: DesktopHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => setShowProfileDropdown((prev) => !prev);

  const checkBalance = async () => {
    try {
      const result: ApiResponse<string> = await apiClient(
        "/api/protected/payment/hosted-payout-link"
      );
      window.open(result.data, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error("Can't check balance, contact support");
    }
  };

  const headerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(headerRef, () => setShowProfileDropdown(false));

  return (
    <header
      ref={headerRef}
      className="hidden md:flex sticky top-0 left-0 z-50 bg-gray-800 shadow-md px-10 py-4 items-center justify-between"
    >
      {/* Logo / Brand */}
      <Link href="/">
        <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors">
          Jeebware
        </h1>
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-6 items-center text-base font-medium">
          {userInfo?.role === ROLE.TRAVELER_AND_BUYER && (
            <>
              <li>
                <Link href="/traveler/select-trip">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Trips
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/traveler/manage-orders">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Traveler Orders
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/buyer/manage-orders">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Buyer Orders
                  </span>
                </Link>
              </li>
            </>
          )}

          {userInfo?.role === ROLE.TRAVELER && (
            <>
              <li>
                <Link href="/traveler/manage-orders">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Orders
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/traveler/select-trip">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Trips
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/buyer">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Buyer Mode
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/traveler">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Plan Trip
                  </span>
                </Link>
              </li>
            </>
          )}

          {userInfo?.role === ROLE.BUYER && (
            <>
              <li>
                <Link href="/buyer">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Order
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/buyer/manage-orders">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Orders
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/traveler">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Traveler Mode
                  </span>
                </Link>
              </li>
            </>
          )}

          {(!userInfo || userInfo?.role === ROLE.NEITHER) && (
            <>
              <li>
                <Link href="/traveler">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Join as Traveler
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/buyer">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    Join as Buyer
                  </span>
                </Link>
              </li>
            </>
          )}

          {userInfo && (
            <li>
              <Link href="/contact">
                <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                  Contact
                </span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Auth, Notifications, and Profile Section */}
      <div className="flex gap-6 items-center relative">
        {!isUserAuthenticated && (
          <Link href="/login">
            <span className="text-base text-white hover:text-indigo-400 transition-colors">
              Log In
            </span>
          </Link>
        )}
        {isUserAuthenticated && (
          <>
            <NotificationsDropdown />

            <div className="relative">
              <Image
                src={userInfo?.profilePicture || ""}
                alt="Profile"
                className="rounded-full cursor-pointer"
                onClick={toggleProfileDropdown}
                width={32}
                height={32}
              />
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                  {(userInfo?.role === ROLE.TRAVELER ||
                    userInfo?.role === ROLE.TRAVELER_AND_BUYER) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        checkBalance();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Check Balance
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
