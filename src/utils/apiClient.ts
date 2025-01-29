import { ApiResponse } from "@/interfaces/Apis/ApiResponse";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

interface ApiErrorResponse {
  message: string;
}

const apiClient = async (
  pathname: string,
  options: RequestOptions = {}
): Promise<any> => {
  const defaultHeaders: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const requestOptions: RequestOptions = {
    method: "GET",
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

export default apiClient;
