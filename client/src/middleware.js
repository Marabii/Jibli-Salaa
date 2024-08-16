export async function middleware(request) {
  const jwtToken = request.cookies.get("jwtToken")?.value;

  if (!jwtToken) {
    console.log("No JWT token found in cookies");

    // Preserve the query string along with the pathname
    const originalUrl = request.nextUrl.clone();
    const loginUrl = new URL("/login", request.nextUrl.origin);

    loginUrl.searchParams.set(
      "redirect",
      originalUrl.pathname + originalUrl.search
    ); // Preserve both pathname and query string
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
      const originalUrl = request.nextUrl.clone();
      const loginUrl = new URL("/login", request.nextUrl.origin);

      loginUrl.searchParams.set(
        "redirect",
        originalUrl.pathname + originalUrl.search
      ); // Preserve both pathname and query string
      return Response.redirect(loginUrl, 302);
    }
  } catch (error) {
    console.log("Error:", error);

    const originalUrl = request.nextUrl.clone();
    const loginUrl = new URL("/login", request.nextUrl.origin);

    loginUrl.searchParams.set(
      "redirect",
      originalUrl.pathname + originalUrl.search
    ); // Preserve both pathname and query string
    return Response.redirect(loginUrl, 302);
  }
}

export const config = {
  matcher: [
    "/traveler",
    "/buyer",
    "/select-trip",
    "/select-trip/accept-orders",
  ],
};
