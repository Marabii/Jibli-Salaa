const apiClient = async (pathname, options = {}) => {
  const defaultOptions = {
    method: "GET",
    credentials: "include", // Include cookies in the request
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Merge default options with user-provided options
  const requestOptions = {
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
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export default apiClient;
