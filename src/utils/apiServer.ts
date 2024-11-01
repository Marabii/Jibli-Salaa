import { cookies } from "next/headers";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

const apiServer = async (
  pathname: string,
  options: RequestOptions = {},
  shouldThrowError: boolean = true
): Promise<any> => {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("jwtToken")?.value;

  if (!jwtToken) {
    throw new Error("No JWT token found in cookies");
  }

  const defaultOptions: RequestOptions = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: decodeURI(jwtToken),
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

  if (!response.ok && shouldThrowError) {
    console.error(response);
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
};

export default apiServer;
