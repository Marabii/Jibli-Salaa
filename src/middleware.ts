import { NextRequest, NextResponse } from "next/server";
import { ROLE } from "./interfaces/userInfo/userRole";
import apiServer from "./utils/apiServer";
import { UserInfo } from "./interfaces/userInfo/userInfo";
import { ApiResponse } from "./interfaces/Apis/ApiResponse";

interface IVerifyUser {
  success: boolean;
}

export async function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken")?.value;
  if (!jwtToken) {
    const originalUrl = request.nextUrl.clone();
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set(
      "redirect",
      originalUrl.pathname + originalUrl.search
    );
    return Response.redirect(loginUrl, 302);
  }

  try {
    const verifyUserResponse: ApiResponse<IVerifyUser> = await apiServer(
      "/api/protected/verifyUser"
    );

    const success = verifyUserResponse.data.success || false;

    if (!success) {
      const originalUrl = request.nextUrl.clone();
      const loginUrl = new URL("/login", request.nextUrl.origin);
      loginUrl.searchParams.set(
        "redirect",
        originalUrl.pathname + originalUrl.search
      );
      return Response.redirect(loginUrl, 302);
    }

    // Check if the requested path is either /traveler or /buyer
    const pathname = request.nextUrl.pathname;
    const isRoleFreeRoute = pathname === "/traveler" || pathname === "/buyer";

    if (isRoleFreeRoute) {
      // Allow access without a role check
      return NextResponse.next();
    }

    // Fetch user info to get the role
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      `/api/protected/getUserInfo`
    );
    const userInfo = userInfoResponse.data;
    // Determine the required role for other paths
    let requiredRole: ROLE | null = null;

    if (pathname.startsWith("/buyer")) {
      requiredRole = ROLE.BUYER;
    } else if (pathname.startsWith("/traveler")) {
      requiredRole = ROLE.TRAVELER;
    }

    // Check if the user has the required role
    if (
      requiredRole &&
      userInfo.role !== requiredRole &&
      userInfo.role !== ROLE.TRAVELER_AND_BUYER
    ) {
      // Redirect to home page if the user lacks the required role
      return Response.redirect(new URL("/", request.nextUrl.origin), 302);
    }

    // Proceed to the requested route
    return NextResponse.next();
  } catch (error) {
    console.log("Error:", error);
    const originalUrl = request.nextUrl.clone();
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set(
      "redirect",
      originalUrl.pathname + originalUrl.search
    );
    return Response.redirect(loginUrl, 302);
  }
}

export const config = {
  matcher: [
    "/traveler",
    "/traveler/manage-orders",
    "/traveler/select-trip",
    "/traveler/select-trip/accept-orders",
    "/buyer",
    "/buyer/buyer-pay/:orderId",
    "/buyer/buyer-pay/confirmDelivery/:orderId",
    "/buyer/buyer-pay/error",
    "/buyer/buyer-pay/success",
    "/buyer/manage-orders",
    "/contact",
    "/negotiate",
    "/negotiate/validate-negotiations",
  ],
};
