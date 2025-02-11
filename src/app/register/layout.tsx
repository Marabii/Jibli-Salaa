import { ReactNode } from "react";

export const metadata = {
  title: "Create Account - Jibli",
  description: "Registering page for the website Jibli",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex px-2 pb-36 w-full flex-col items-center pt-20 text-center">
      <h1 className="font-playfair text-6xl font-bold">Create an account</h1>
      {children}
    </div>
  );
}
