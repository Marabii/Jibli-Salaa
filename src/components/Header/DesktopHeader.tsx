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
import { FloatingDock } from "@/components/floating-dock";
import {
  FiClipboard,
  FiMap,
  FiCompass,
  FiShoppingCart,
  FiPhone,
} from "react-icons/fi";

export interface FloatingDockI {
  title: string;
  icon: React.ReactNode;
  href: string;
}

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

  // Build the floating dock items based on user role
  let floatingDockItems: FloatingDockI[] = [];

  if (userInfo?.role === ROLE.TRAVELER) {
    floatingDockItems = [
      {
        title: t("travelerOrders"),
        icon: <FiClipboard />,
        href: "/traveler/manage-orders",
      },
      { title: t("trips"), icon: <FiMap />, href: "/traveler/select-trip" },
      { title: t("planTrip"), icon: <FiCompass />, href: "/traveler" },
      { title: t("contact"), icon: <FiPhone />, href: "/contact" },
    ];
  } else if (userInfo?.role === ROLE.BUYER) {
    floatingDockItems = [
      { title: t("buyerOrder"), icon: <FiShoppingCart />, href: "/buyer" },
      {
        title: t("buyerOrders"),
        icon: <FiClipboard />,
        href: "/buyer/manage-orders",
      },
      { title: t("contact"), icon: <FiPhone />, href: "/contact" },
    ];
  }

  return (
    <header
      ref={headerRef}
      className="hidden bg-black md:flex sticky w-screen top-0 left-0 z-50 shadow-md px-10 py-4 items-center justify-between"
    >
      {/* Logo / Brand */}
      <Link href="/">
        <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors">
          {t("brand")}
        </h1>
      </Link>

      {/* Floating Dock Navigation replaces the traditional <nav> */}
      {userInfo && (
        <FloatingDock
          items={floatingDockItems}
          desktopClassName="mx-auto bg-neutral-800"
          mobileClassName=""
        />
      )}

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
              <div className="relative">
                <div className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 blur-sm w-10 h-10 flex items-center justify-center rounded-full"></div>
                <Image
                  src={userInfo?.profilePicture || ""}
                  alt={t("profileAlt")}
                  className="rounded-full h-8 w-8 cursor-pointer"
                  onClick={toggleProfileDropdown}
                  width={32}
                  height={32}
                />
              </div>
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
