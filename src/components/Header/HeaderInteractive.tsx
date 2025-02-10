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
  const router = useRouter();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleProfileDropdown = () => setShowProfileDropdown((prev) => !prev);

  const handleLogout = async () => {
    try {
      const response = await fetch("/login/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent with the request
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
            Jibli Salaa
          </h1>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 items-center text-base font-medium">
            {/* If user has BOTH traveler and buyer roles */}
            {userInfo?.role === ROLE.TRAVELER_AND_BUYER && (
              <>
                <li>
                  <Link href="/traveler/select-trip">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Select Trip
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/traveler/manage-orders">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Manage Orders As Traveler
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/buyer/manage-orders">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Manage Orders As Buyer
                    </span>
                  </Link>
                </li>
              </>
            )}

            {/* If user is Traveler */}
            {userInfo?.role === ROLE.TRAVELER && (
              <>
                <li>
                  <Link href="/traveler/manage-orders">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Manage Orders
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/traveler/select-trip">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Select Trip
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/buyer">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Switch to Buyer
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/traveler">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Schedule Trip
                    </span>
                  </Link>
                </li>
              </>
            )}

            {/* If user is Buyer */}
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
                      Manage Orders
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/traveler">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Switch to Traveler
                    </span>
                  </Link>
                </li>
              </>
            )}

            {/* If user has neither role or is not logged in */}
            {(!userInfo || userInfo?.role === ROLE.NEITHER) && (
              <>
                <li>
                  <Link href="/traveler">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Become a Traveler
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/buyer">
                    <span className="cursor-pointer text-white hover:text-indigo-400 transition-colors">
                      Become a Buyer
                    </span>
                  </Link>
                </li>
              </>
            )}

            {/* Contact link (if logged in) */}
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
              {/* Profile Picture */}
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
                      <Link
                        href={"/login"}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log in with a different account
                      </Link>
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
        {/* Logo */}
        <Link href="/">
          <h1 className="text-xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors">
            Jibli Salaa
          </h1>
        </Link>
        <div className="flex items-center gap-4">
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
                  <Link
                    href={"/login"}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log in with a different account
                  </Link>
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
                Jibli Salaa
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
                        Select Trip
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Manage Orders As Traveler
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer/manage-orders">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Manage Orders As Buyer
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
                        Manage Orders
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler/select-trip">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Select Trip
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Switch to Buyer
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Schedule tripe
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
                        Manage Orders
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/traveler">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Switch to Traveler
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
                        Become a Traveler
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyer">
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        Become a Buyer
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
          {/* Auth & Notifications Section at Bottom */}
          <div className="mt-10">
            {!isUserAuthenticated ? (
              <Link href="/login">
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg cursor-pointer hover:text-indigo-400 transition-colors"
                >
                  Log In
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <NotificationsDropdown />
                <span className="text-lg">
                  Welcome, {userInfo?.name || "User"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
