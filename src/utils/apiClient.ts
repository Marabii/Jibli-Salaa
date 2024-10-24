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
  const defaultOptions: RequestOptions = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Merge default options with user-provided options
  const requestOptions: RequestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVERURL}${pathname}`,
    requestOptions
  );

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export default apiClient;
