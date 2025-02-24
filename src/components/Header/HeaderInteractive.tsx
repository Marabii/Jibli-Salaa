"use client";

import { useRouter } from "next/navigation";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

interface HeaderInteractiveProps {
  userInfo: UserInfo | null;
  isUserAuthenticated: boolean;
}

export default function HeaderInteractive({
  userInfo,
  isUserAuthenticated,
}: HeaderInteractiveProps) {
  const router = useRouter();

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
      <DesktopHeader
        userInfo={userInfo}
        isUserAuthenticated={isUserAuthenticated}
        handleLogout={handleLogout}
      />

      <MobileHeader
        userInfo={userInfo}
        isUserAuthenticated={isUserAuthenticated}
        handleLogout={handleLogout}
      />
    </>
  );
}
