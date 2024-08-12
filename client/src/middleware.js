export async function middleware(request) {
  const jwtToken = request.cookies.get("jwtToken")?.value;

  if (!jwtToken) {
    console.log("No JWT token found in cookies");
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return Response.redirect(loginUrl, 302);
  }

  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/api/verifyUser`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: jwtToken,
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    const response = await result.json();
    const success = response.success;

    if (!success) {
      const loginUrl = new URL("/login", request.nextUrl.origin);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return Response.redirect(loginUrl, 302);
    }
  } catch (error) {
    console.log("Error:", error);
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return Response.redirect(loginUrl, 302);
  }
}

function redirectUser(request) {}

export const config = {
  matcher: "/traveler",
};
