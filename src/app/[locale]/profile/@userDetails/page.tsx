import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import apiServer from "@/utils/apiServer";
import UserDetailsForm from "./components/UserDetailsForm";

export default async function UserDetails() {
  const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
    "/api/protected/getUserInfo"
  );
  const userInfo = userInfoResponse.data;

  return <UserDetailsForm userInfo={userInfo} />;
}
