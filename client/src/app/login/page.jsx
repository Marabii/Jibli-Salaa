"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ searchParams }) {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const redirectTo = searchParams?.redirect || "/";

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/api/login`,
        {
          method: "POST",
          body: JSON.stringify(loginData),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Redirect after login
        router.push(redirectTo);
      } else {
        throw new Error(data.msg || "Login failed");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="mt-20 pb-36">
      <div className="text-center flex w-full flex-col items-center bg-white pt-20">
        <h1 className="font-playfair text-6xl font-bold">Login</h1>
        <p className="py-5 text-lg text-gray-400">
          Please fill your email and password to login
        </p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form
          onSubmit={handleLoginSubmit}
          className="w-full max-w-[550px] space-y-5 px-5"
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
              type="email"
              name="email"
              autoComplete="on"
              id="email"
              placeholder="Type Your Email"
              required
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
              type="password"
              name="password"
              autoComplete="on"
              id="password"
              placeholder="Enter Your Password"
              required
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
            <a
              href="/register"
              className="ml-5 border-b-2 border-black text-lg font-bold text-black"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
