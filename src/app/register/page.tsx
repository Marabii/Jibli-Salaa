import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import {
  handleRegisterAction,
  RegisterFormInputs,
} from "./Utilis/handleRegisterAction";
import Link from "next/link";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import "react-phone-number-input/style.css";
import SubmitButtonRegister from "./Components/SubmitButtonRegister";
import CountrySelector from "./Components/CountrySelector";
import RoleAndCurrencySelectors from "./Components/RoleAndCurrencySelectors";
import PhoneNumberInput from "./Components/PhoneNumberInput";

const Register = () => {
  return (
    <>
      <p className="py-5 text-lg text-gray-400">
        Create an account and start using Jeebware
      </p>

      <FormWrapper<RegisterFormInputs>
        className="w-full max-w-[550px] space-y-5 px-5"
        action={handleRegisterAction}
        redirectTo="/"
      >
        {/* Name */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="name"
          >
            Name
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            name="name"
            label="Type your name"
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
            name="email"
            label="Type Your Email"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
            errorMessage="Invalid email address"
          />
        </div>

        {/* Password */}
        <div>
          <label
            className="mb-2 block font-playfair text-lg font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            className="w-full border-2 border-black p-5"
            type="password"
            name="password"
            label="Enter Your Password"
            labelBgColor="rgb(249 250 251)"
            required
            pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
            errorMessage="Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit."
          />
        </div>

        {/* Phone Number */}
        <PhoneNumberInput />

        {/* Country Select */}
        <CountrySelector />

        {/* Role and Currency Selectors */}
        <RoleAndCurrencySelectors />

        {/* Error handler */}
        <FormErrorHandler />

        <SubmitButtonRegister />

        <p className="mt-5 w-full text-start text-gray-800">
          Already Have An Account?
          <Link
            href="/login"
            className="ml-5 border-b-2 border-black text-lg font-bold text-black"
          >
            Sign-In
          </Link>
        </p>
      </FormWrapper>
    </>
  );
};

export default Register;
