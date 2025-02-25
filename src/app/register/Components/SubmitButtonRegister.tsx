"use client";
import SubmitButton from "@/components/SubmitButton";
import usePending from "@/components/Form/usePending";
import Link from "next/link";

export default function SubmitButtonRegister() {
  const pending = usePending();

  return (
    <div className="flex flex-col gap-3">
      <SubmitButton
        defaultText="Register"
        pendingText="Processing request..."
        className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        pending={pending}
      />
      {/* <Link
        className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        href="/register/signup-with-google"
      >
        Sign Up With Google
      </Link> */}
    </div>
  );
}
