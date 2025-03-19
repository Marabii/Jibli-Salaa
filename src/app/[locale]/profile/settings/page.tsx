import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import apiServer from "@/utils/apiServer";
import UserDetailsForm from "./components/UserDetailsForm";

export default async function UserDetails() {
  const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
    "/api/protected/getUserInfo"
  );
  const userInfo = userInfoResponse.data;

  return (
    <div className="flex px-2 pb-36 w-full flex-col items-center pt-10 text-center">
      <h1 className="font-playfair text-5xl mb-10 font-bold">Your Profile</h1>
      <UserDetailsForm userInfo={userInfo} />
    </div>
  );
}
