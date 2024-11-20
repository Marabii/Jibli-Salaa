"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default async function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        router.replace(redirectTo);
        router.refresh();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="mt-20 pb-36">
      <div className="text-center flex w-full flex-col items-center pt-20">
        <h1 className="font-playfair text-6xl font-bold">Login</h1>
        <p className="py-5 text-lg text-gray-400">
          Please fill your email and password to login
        </p>
        <form
          onSubmit={handleSubmit(handleLoginSubmit)}
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full border-2 border-black p-5"
              type="email"
              id="email"
              placeholder="Type Your Email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              className="mb-2 block font-playfair text-lg font-bold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long, and include one uppercase letter, one lowercase letter, one digit, and one special character.",
                },
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
              className="w-full border-2 border-black p-5"
              type="password"
              id="password"
              placeholder="Enter Your Password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button
              className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
              type="submit"
            >
              Login
            </button>
            <Link
              href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_SERVERURL}/google/callback&response_type=code&client_id=1028629889843-gjkff6ielpualsk4cu1700vbp08ggacj.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline`}
            >
              <button
                className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
                type="submit"
              >
                Sign In With Google
              </button>
            </Link>
          </div>
          <p className="mt-5 w-full text-start text-gray-800">
            Don't Have An Account?{" "}
            <Link
              href="/register"
              className="ml-5 border-b-2 border-black text-lg font-bold text-black"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
