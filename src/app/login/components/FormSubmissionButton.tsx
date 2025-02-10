"use client";

import usePending from "@/components/Form/usePending";
import SubmitButton from "@/components/SubmitButton";

export default function FormSubmissionButton() {
  const pending = usePending();

  return (
    <SubmitButton
      className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
      defaultText="Log In"
      pendingText="Logging in..."
      pending={pending}
    />
  );
}
