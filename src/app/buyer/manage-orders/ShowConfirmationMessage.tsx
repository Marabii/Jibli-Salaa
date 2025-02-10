"use client";

import { useSearchParams } from "next/navigation";
export default function ShowConfirmationMessage() {
  const searchParams = useSearchParams();

  const confirmationMessage = searchParams.get("confirmationMessage");

  if (confirmationMessage) {
    alert(confirmationMessage);
  }

  return null;
}
