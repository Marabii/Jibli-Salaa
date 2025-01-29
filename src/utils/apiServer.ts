import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { cookies } from "next/headers";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

const apiServer = async (
  pathname: string,
  options: RequestOptions = {}
): Promise<any> => {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("jwtToken")?.value;

  if (!jwtToken) {
    throw new Error("No JWT token found in cookies");
  }

  // Initialize default headers
  const defaultHeaders: Record<string, string> = {};

  // Set Content-Type if the body is not FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // Attach Authorization header if JWT token is available
  if (jwtToken) {
    defaultHeaders["Authorization"] = `Bearer ${decodeURI(jwtToken)}`;
  }

  const requestOptions: RequestOptions = {
    method: "GET", // Default method
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}${pathname}`,
      requestOptions
    );

    const responseData: ApiResponse<unknown> = await response.json();

    if (!response.ok) {
      const errorMessage = responseData?.message || "An unknown error occurred";
      const errorsArray = responseData?.errors || [];
      const formattedErrors = errorsArray
        .map((error) => `● ${error}`)
        .join(",\n");

      throw new Error(errorMessage + "\n" + formattedErrors);
    }

    return responseData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Network error: Unable to reach the server";
    throw new Error(errorMessage);
  }
};

export default apiServer;
