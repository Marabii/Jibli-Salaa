import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default async function Login({ searchParams }) {
  const serverURL = process.env.NEXT_PUBLIC_SERVERURL;
  const redirectTo = searchParams?.redirect || "/";

  if (searchParams?.redirect !== "/") {
    // If the redirect is not the home page, we assume the session has expired
    console.log("Your session has expired, please log in again.");
  }

  // Handle the form submission on the server
  async function handleLoginSubmit(formData) {
    "use server";

    // Extract email and password from formData
    const email = formData.get("email");
    const password = formData.get("password");

    // Create an object with only the required fields
    const loginData = {
      email,
      password,
    };

    const response = await fetch(`${serverURL}/api/login`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      const token = data.token;
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;

      const cookieStore = cookies();
      cookieStore.set("jwtToken", token, { expires: new Date(expirationTime) });
      cookieStore.set("tokenExpiration", expirationTime, {
        expires: new Date(expirationTime),
      });

      console.log("Logged In Successfully");

      redirect(redirectTo); // Redirect after login
    } else {
      throw new Error("Unable to log in");
    }
  }

  // Render the login form
  return (
    <div className="mt-20 pb-36">
      <div className="text-center flex w-full flex-col items-center bg-white pt-20">
        <h1 className="font-playfair text-6xl font-bold">Login</h1>
        <p className="py-5 text-lg text-gray-400">
          Please fill your email and password to login
        </p>
        <form
          action={handleLoginSubmit}
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
              type="email" // Use email type for better validation
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
              type="password" // Password type for security
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
