// HeaderInteractive.tsx (Client Component)
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import NotificationsDropdown from "./NotificationsDropdown";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { FaBars, FaTimes } from "react-icons/fa";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useOutsideClick from "@/hooks/useOutsideClick";

interface HeaderInteractiveProps {
  userInfo: UserInfo | null;
  isUserAuthenticated: boolean;
}

export default function HeaderInteractive({
  userInfo,
  isUserAuthenticated,
}: HeaderInteractiveProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownMenuRef, () => setShowProfileDropdown(false));
  const router = useRouter();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleProfileDropdown = () => setShowProfileDropdown((prev) => !prev);

  const handleLogout = async () => {
    try {
      const response = await fetch("/login/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Logout failed:", response.statusText);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex sticky top-0 left-0 z-50 bg-gray-800 shadow-md px-10 py-4 items-center justify-between">
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
              {userInfo?.profilePicture && (
                <div className="relative">
                  <Image
                    src={userInfo.profilePicture}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                    onClick={toggleProfileDropdown}
                  />
                  {showProfileDropdown && (
                    <div
                      ref={dropdownMenuRef}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50"
                    >
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* Mobile Header (Top Bar) */}
      <header className="md:hidden sticky top-0 left-0 z-50 bg-gray-800 shadow-md px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors">
            Jeebware
          </h1>
        </Link>
        <div className="flex relative items-center gap-4">
          {isUserAuthenticated && <NotificationsDropdown />}
          {isUserAuthenticated && userInfo?.profilePicture && (
            <div className="relative">
              <Image
                src={userInfo.profilePicture}
                alt="Profile"
                className="rounded-full cursor-pointer"
                onClick={toggleProfileDropdown}
                width={32}
                height={32}
              />
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
                Jeebware
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
              {userInfo?.role === ROLE.TRAVELER_AND_BUYER && (
                <>
                  <li>
                    <Link href="/traveler/select-trip">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Trips
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Traveler Orders
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
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
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Orders
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler/select-trip">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Trips
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Buyer Mode
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
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
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Order
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Orders
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
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
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Join Traveler
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Join Buyer
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
                      Contact
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="mt-10">
            {!isUserAuthenticated && (
              <Link href="/login">
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg cursor-pointer hover:text-indigo-400 transition-colors"
                >
                  Log In
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
