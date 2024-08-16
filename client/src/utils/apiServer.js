import { cookies } from "next/headers";

const apiServer = async (pathname, options = {}) => {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get("jwtToken")?.value;

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

  return response.json();
};

export default apiServer;
