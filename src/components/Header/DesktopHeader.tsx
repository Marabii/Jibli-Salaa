"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import NotificationsDropdown from "./NotificationsDropdown";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { useState, useRef } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

interface DesktopHeaderProps {
  userInfo: UserInfo | null;
  isUserAuthenticated: boolean;
  handleLogout: () => void;
}

interface CreateAccountLinkResponse {
  url: string;
}

export default function DesktopHeader({
  userInfo,
  isUserAuthenticated,
  handleLogout,
}: DesktopHeaderProps) {
  const t = useTranslations("Header");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => setShowProfileDropdown((prev) => !prev);

  const checkBalance = async () => {
    try {
      const isOnboardingComplete: ApiResponse<boolean> = await apiClient(
        "/api/protected/payment/is-onboarding-complete"
      );

      if (!isOnboardingComplete.data) {
        toast.info(t("infoStripe"));
        await apiClient("/api/protected/payment/account", { method: "POST" });
        const createAccountLinkResult: ApiResponse<CreateAccountLinkResponse> =
          await apiClient("/api/protected/payment/account_link", {
            method: "POST",
            body: JSON.stringify({ prevUrl: window.location.href }),
          });
        window.location.href = createAccountLinkResult.data.url;
        return;
      }

      const result: ApiResponse<string> = await apiClient(
        "/api/protected/payment/hosted-payout-link"
      );
      window.open(result.data, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(t("errorBalance"));
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
          {t("brand")}
        </h1>
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-6 items-center text-base font-medium">
          {userInfo?.role === ROLE.TRAVELER && (
            <>
              <li>
                <Link href="/traveler/manage-orders">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    {t("travelerOrders")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/traveler/select-trip">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    {t("trips")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/traveler">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    {t("planTrip")}
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
                    {t("buyerOrder")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/buyer/manage-orders">
                  <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                    {t("buyerOrders")}
                  </span>
                </Link>
              </li>
            </>
          )}

          {userInfo && (
            <li>
              <Link href="/contact">
                <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                  {t("contact")}
                </span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Auth, Notifications, and Profile Section */}
      <div className="flex gap-6 items-center relative">
        <LocaleSwitcher />
        {!isUserAuthenticated && (
          <Link href="/login">
            <span className="text-base text-white hover:text-indigo-400 transition-colors">
              {t("login")}
            </span>
          </Link>
        )}
        {isUserAuthenticated && (
          <>
            <NotificationsDropdown />

            <div className="relative">
              <Image
                src={userInfo?.profilePicture || ""}
                alt={t("profileAlt")}
                className="rounded-full cursor-pointer"
                onClick={toggleProfileDropdown}
                width={32}
                height={32}
              />
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                  {userInfo?.role === ROLE.TRAVELER && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        checkBalance();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t("checkBalance")}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("logout")}
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
