export async function middleware(request) {
  // Extract the JWT token from cookies
  const jwtToken = request.cookies.get("jwtToken")?.value;
  console.log(jwtToken);

  if (!jwtToken) {
    console.log("No JWT token found in cookies");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await fetch("http://localhost:3001/api/verifyUser", {
      method: "GET",
      credentials: "include", // Include cookies in the request if needed
      headers: {
        Authorization: jwtToken, // Include the JWT token in the Authorization header
        Cookie: request.headers.get("cookie") || "", // Forward the cookies from the incoming request
      },
    });
    const data = await result.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}

export const config = {
  matcher: "/",
};
