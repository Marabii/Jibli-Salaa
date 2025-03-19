"use client";

import { UserInfo } from "@/interfaces/userInfo/userInfo";
import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import PhoneNumberInput from "./PhoneNumberInput";
import updateUserDetailsAction, {
  UpdateUserDetailsI,
} from "../utils/updateUserDetails";
import CountrySelector from "./CountrySelector";
import CurrencySelector from "./CurrencySelector";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import SubmitButtonProfileUpdate from "./SubmitButtonProfileUpdate";
import ProfilePictureUploader from "./ProfilePictureUploader";

export default function UserDetailsForm({ userInfo }: { userInfo: UserInfo }) {
  const userInfoCpy: UserInfo = { ...userInfo };
  return (
    <>
      <ProfilePictureUploader initialImage={userInfo.profilePicture} />

      {/* Form */}
      <FormWrapper<UpdateUserDetailsI>
        className="w-full max-w-[550px] space-y-5 px-5"
        action={updateUserDetailsAction}
      >
        {/* Name */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="name"
          >
            Your Name
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            name="name"
            value={userInfoCpy.name}
            label="You can change your name here"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[\p{L} ]+$"
            errorMessage="Name can only contain letters and spaces"
          />
        </div>

        {/* Email */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="email"
          >
            Email Address
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="email"
            value={userInfoCpy.email}
            name="email"
            label="You can change your email here"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
            errorMessage="Invalid email address"
          />
        </div>

        {/* Phone Number */}
        <PhoneNumberInput userInfo={userInfoCpy} />

        {/* Country Selector */}
        <CountrySelector userInfo={userInfoCpy} />

        {/* Currency Selector */}
        <CurrencySelector userInfo={userInfoCpy} />

        {/* Error Handler */}
        <FormErrorHandler />

        {/* Submit Button */}
        <SubmitButtonProfileUpdate />
      </FormWrapper>
    </>
  );
}
