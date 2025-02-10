// Header.tsx (Server Component)
import HeaderInteractive from "./HeaderInteractive";
import apiServer from "@/utils/apiServer";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";

interface IVerifyUserResponse {
  success: boolean;
}

export default async function Header() {
  let userInfo: UserInfo | null = null;
  let isUserAuthenticated = false;

  try {
    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );
    userInfo = userInfoResponse.data;
  } catch (error) {
    // handle error or leave userInfo as null
  }

  try {
    const verifyUserResponse: ApiResponse<IVerifyUserResponse> =
      await apiServer("/api/protected/verifyUser");
    isUserAuthenticated = verifyUserResponse.data.success;
  } catch (error) {
    // handle error or default to false
  }

  return (
    <HeaderInteractive
      userInfo={userInfo}
      isUserAuthenticated={isUserAuthenticated}
    />
  );
}
