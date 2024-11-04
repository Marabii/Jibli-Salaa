import { cookies } from "next/headers";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

const apiServer = async (
  pathname: string,
  options: RequestOptions = {},
  shouldThrowError: boolean = true,
  defaultReturn: any = null // Default value as null
): Promise<any> => {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("jwtToken")?.value;

  if (!jwtToken && shouldThrowError) {
    throw new Error("No JWT token found in cookies");
  }

  const defaultOptions: RequestOptions = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: decodeURI(jwtToken || "no token"),
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}${pathname}`,
      requestOptions
    );

    if (!response.ok) {
      if (shouldThrowError) {
        console.error(response);
        throw new Error(`Failed to fetch: ${response.statusText}`);
      } else {
        return defaultReturn; // Return the default value if provided and shouldThrowError is false
      }
    }

    return response.json();
  } catch (error) {
    if (shouldThrowError) {
      throw error;
    } else {
      console.error("error: ", error);
      return defaultReturn;
    }
  }
};

export default apiServer;
