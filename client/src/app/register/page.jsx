"use client"; // Ensure the component runs on the client side
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Register = () => {
  const serverURL = process.env.NEXT_PUBLIC_SERVERURL; // Use NEXT_PUBLIC_ for environment variables in Next.js
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "", // Added phone field
  });
  const router = useRouter();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverURL}/api/register`, formData);
      if (response.data.success) {
        alert("Registered Successfully");
        router.push("/login"); // Use router.push for navigation
      } else {
        throw new Error(response.data.msg);
      }
    } catch (e) {
      alert("Unable To Register");
      console.error(e);
      console.log(e.data);
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    router.push("/login"); // Use router.push for navigation
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="pb-36">
      <div className="flex w-full flex-col items-center bg-white pt-20 text-center">
        <h1 className="font-playfair text-6xl font-bold">Create an account</h1>
        <p className="py-5 text-lg text-gray-400">
          Create an account and start using Jibli Salaa
        </p>
        <form
          className="w-full max-w-[550px] space-y-5 px-5"
          onSubmit={handleRegisterSubmit}
        >
          <div>
            <label
              className="mb-2 block font-playfair text-lg font-bold"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full border-2 border-black p-5"
              type="text"
              name="name"
              autoComplete="on"
              id="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="mb-2 block font-playfair text-lg font-bold"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full border-2 border-black p-5"
              type="email" // Use email type for better validation
              name="email"
              autoComplete="on"
              id="email"
              placeholder="Type Your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="mb-2 block font-playfair text-lg font-bold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full border-2 border-black p-5"
              type="password" // Password type for security
              name="password"
              autoComplete="on"
              id="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="mb-2 block font-playfair text-lg font-bold"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              className="w-full border-2 border-black p-5"
              type="tel" // Use tel type for phone numbers
              name="phoneNumber"
              autoComplete="on"
              id="phone"
              placeholder="Enter Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button
            className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
            type="submit"
          >
            Sign Up
          </button>
          <button
            type="button"
            className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
            onClick={() => {
              router.push("http://localhost:3001/auth/google");
            }}
          >
            Sign In With Google
          </button>
          <p className="mt-5 w-full text-start text-gray-800">
            Already Have An Account?{" "}
            <button
              className="ml-5 border-b-2 border-black text-lg font-bold text-black"
              onClick={handleSignInClick}
            >
              Sign-In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
