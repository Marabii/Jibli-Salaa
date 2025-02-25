"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";

export default function PhoneNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");

  return (
    <div>
      <label
        className="mb-2 block font-playfair text-lg font-bold"
        htmlFor="phoneNumber"
      >
        Phone Number
      </label>
      <PhoneInput
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        numberInputProps={{ className: "bg-gray-50 focus:outline-none" }}
        className="w-full border-2 border-black p-5"
        defaultCountry="MA"
      />
      {/* Hidden field to actually submit phoneNumber */}
      <input type="hidden" name="phoneNumber" value={phoneNumber || ""} />
    </div>
  );
}
