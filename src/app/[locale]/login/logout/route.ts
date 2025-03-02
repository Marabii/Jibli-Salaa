import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  const IS_PRODUCTION = JSON.parse(
    process.env.NEXT_PUBLIC_IS_PRODUCTION || "false"
  );

  // Determine sameSite based on environment
  const sameSiteValue = IS_PRODUCTION ? "none" : "lax";

  response.cookies.set({
    name: "jwtToken",
    value: "",
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: sameSiteValue,
    domain: IS_PRODUCTION ? ".jeebware.com" : undefined,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
