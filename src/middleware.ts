import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ROLE } from "./interfaces/userInfo/userRole";
import apiServer from "./utils/apiServer";
import { UserInfo } from "./interfaces/userInfo/userInfo";
import { ApiResponse } from "./interfaces/Apis/ApiResponse";

interface IVerifyUser {
  success: boolean;
}

const protectedPaths = [
  "/traveler",
  "/traveler/manage-orders",
  "/traveler/select-trip",
  "/traveler/select-trip/accept-orders",
  "/buyer",
  "/buyer/buyer-pay",
  "/buyer/buyer-pay/confirmDelivery",
  "/buyer/buyer-pay/error",
  "/buyer/buyer-pay/success",
  "/buyer/manage-orders",
  "/contact",
  "/negotiate",
  "/negotiate/validate-negotiations",
];

const nextIntlMiddleware = createMiddleware(routing);

async function runAuthCheck(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken")?.value;
  if (!jwtToken) {
    return redirectToLogin(request);
  }
  try {
    const verifyUserResponse: ApiResponse<IVerifyUser> = await apiServer(
      "/api/protected/verifyUser"
    );
    const success = verifyUserResponse?.data?.success || false;
    if (!success) {
      return redirectToLogin(request);
    }
    const pathname = request.nextUrl.pathname;
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );
    const userInfo = userInfoResponse?.data;
    let requiredRole: ROLE | null = null;
    if (pathname.includes("/buyer")) {
      requiredRole = ROLE.BUYER;
    } else if (pathname.includes("/traveler")) {
      requiredRole = ROLE.TRAVELER;
    }
    if (requiredRole && userInfo?.role !== requiredRole) {
      return NextResponse.redirect(new URL("/", request.nextUrl.origin), 302);
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in authCheck:", error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search
  );
  return NextResponse.redirect(loginUrl, 302);
}

export async function middleware(request: NextRequest) {
  let i18nResponse = nextIntlMiddleware(request);
  // If next-intl triggered a redirect, manually preserve the search params
  if (i18nResponse.headers.has("Location")) {
    const location = new URL(
      i18nResponse.headers.get("Location")!,
      request.url
    );
    // This line is the key: set the location's query to the incoming query
    location.search = request.nextUrl.searchParams.toString();

    // Recreate the redirect response, preserving status & new location
    i18nResponse = NextResponse.redirect(location, i18nResponse.status);
  }

  if (i18nResponse && i18nResponse.status >= 300 && i18nResponse.status < 400) {
    return i18nResponse;
  }
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((route) => pathname.includes(route));
  if (!isProtected) {
    return i18nResponse || NextResponse.next();
  }
  const authResponse = await runAuthCheck(request);
  if (authResponse.status >= 300 && authResponse.status < 400) {
    return authResponse;
  }
  return i18nResponse || authResponse;
}

export const config = {
  matcher: [
    "/",
    "/(en|fr|ar)/:path*",
    "/buyer/:path*",
    "/contact/:path*",
    "/contact-us/:path*",
    "/login/:path*",
    "/negotiate/:path*",
    "/register/:path*",
    "/traveler/:path*",
  ],
};
