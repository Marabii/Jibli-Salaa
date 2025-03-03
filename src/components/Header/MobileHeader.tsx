"use client";

import { useState, useRef } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import NotificationsDropdown from "./NotificationsDropdown";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { FaBars, FaTimes } from "react-icons/fa";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import useOutsideClick from "@/hooks/useOutsideClick";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

interface MobileHeaderProps {
  userInfo: UserInfo | null;
  isUserAuthenticated: boolean;
  handleLogout: () => void;
}

interface CreateAccountLinkResponse {
  url: string;
}

export default function MobileHeader({
  userInfo,
  isUserAuthenticated,
  handleLogout,
}: MobileHeaderProps) {
  const t = useTranslations("Header");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
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
    <>
      {/* Mobile Header (Top Bar) */}
      <header
        ref={headerRef}
        className="md:hidden sticky top-0 left-0 z-50 bg-gray-800 shadow-md px-4 py-3 flex items-center justify-between"
      >
        <Link href="/">
          <h1 className="text-xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors">
            {t("brand")}
          </h1>
        </Link>
        <div className="flex relative items-center gap-4">
          {isUserAuthenticated && <NotificationsDropdown />}

          {isUserAuthenticated && userInfo?.profilePicture && (
            <div className="relative">
              <Image
                src={userInfo.profilePicture}
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
          )}
          <LocaleSwitcher />
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900 text-white h-screen w-full overflow-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <h1
                className="text-2xl font-bold cursor-pointer hover:text-indigo-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("brand")}
              </h1>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              <FaTimes size={28} />
            </button>
          </div>
          <nav>
            <ul className="flex flex-col space-y-6 text-lg font-medium">
              {userInfo?.role === ROLE.TRAVELER && (
                <>
                  <li>
                    <Link href="/traveler/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        {t("travelerOrders")}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler/select-trip">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        {t("trips")}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
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
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        {t("buyerOrder")}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        {t("buyerOrders")}
                      </span>
                    </Link>
                  </li>
                </>
              )}

              {userInfo && (
                <li>
                  <Link href="/contact">
                    <span
                      onClick={() => setMobileMenuOpen(false)}
                      className="cursor-pointer hover:text-indigo-400 transition-colors"
                    >
                      {t("contact")}
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="sm:mt-10">
            {!isUserAuthenticated && (
              <Link href="/login">
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg cursor-pointer hover:text-indigo-400 transition-colors"
                >
                  {t("login")}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
