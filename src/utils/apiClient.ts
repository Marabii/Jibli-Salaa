interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

interface ApiErrorResponse {
  message: string;
}

const apiClient = async (
  pathname: string,
  options: RequestOptions = {},
  shouldThrowError: boolean = true
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

    if (!response.ok && shouldThrowError) {
      const error: ApiErrorResponse = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  } catch (error) {
    if (shouldThrowError) {
      throw new Error("Network error: Unable to reach the server");
    }
    return Promise.reject(error);
  }
};

export default apiClient;
