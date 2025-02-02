import { ReactNode } from "react";

export const metadata = {
  title: "Login - Jibli",
  description: "Login page for the website Jibli",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="text-center pb-36 flex w-full flex-col items-center pt-20">
      <h1 className="font-playfair text-6xl font-bold">Login</h1>
      <p className="py-5 text-lg text-gray-400">
        Please fill your email and password to login
      </p>
      {children}
    </div>
  );
}
