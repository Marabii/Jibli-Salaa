"use client"; // Ensure the component runs on the client side
import { useSearchParams, useRouter } from "next/navigation"; // Correct hook to use
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // No need for curly braces

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const serverURL = process.env.NEXT_PUBLIC_SERVERURL; // Use NEXT_PUBLIC_ for environment variables in Next.js
  const [formData, setFormData] = useState({ password: "", email: "" });
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const router = useRouter();

  useEffect(() => {
    if (redirect !== "/") {
      alert("Your session has expired, please log in again.");
    }
  }, [redirect]);

  const storeToken = (token) => {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;

    // Delete existing cookies (if they exist)
    document.cookie = "jwtToken=;";
    document.cookie = "tokenExpiration=;";

    // Set new cookies with the new token and expiration time
    document.cookie = `jwtToken=${token}; path=/;`;
    document.cookie = `tokenExpiration=${expirationTime}; path=/;`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverURL}/api/login`, formData);
      if (response.data.success) {
        const { token } = response.data;
        storeToken(token);
        setIsLoggedIn(true);
        alert("Logged In Successfully");
        router.replace(redirect); // Redirect after login
      } else {
        throw new Error("Unable to log in");
      }
    } catch (error) {
      setIsLoggedIn(false);
      alert("Unable to log in");
      console.error(error);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    router.push("/register");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mt-20 pb-36">
      <div className="text-center flex w-full flex-col items-center bg-white pt-20">
        <h1 className="font-playfair text-6xl font-bold">Login</h1>
        <p className="py-5 text-lg text-gray-400">
          Please fill your email and password to login
        </p>
        <form
          className="w-full max-w-[550px] space-y-5 px-5"
          onSubmit={handleLoginSubmit}
        >
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
          <button
            className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
            type="submit"
          >
            Login
          </button>
          <p className="mt-5 w-full text-start text-gray-800">
            Don't Have An Account?{" "}
            <button
              className="ml-5 border-b-2 border-black text-lg font-bold text-black"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
