const apiClient = async (pathname, options = {}) => {
  const jwtToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwtToken="))
    ?.split("=")[1];

  if (!jwtToken) {
    throw new Error("JWT token not found in cookies");
  }

  const defaultOptions = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: decodeURI(jwtToken),
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
