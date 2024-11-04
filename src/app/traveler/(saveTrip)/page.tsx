import apiServer from "@/utils/apiServer";
import SpokenLanguagesForm from "./spokenlanguages/SelectSpokenLanguages";

export default async function TravelerPage() {
  let userInfo;
  try {
    userInfo = await apiServer("/api/protected/getUserInfo");
    if (!userInfo) throw new Error("No user info returned");
  } catch (error) {
    console.error("Failed to fetch user information:", error);
    // Handle the error case by potentially showing an error message or a retry button
    return <div>Failed to load user information. Please try again later.</div>;
  }

  return (
    <>
      <h2>Hey {userInfo.name}! Welcome back.</h2>
      <img src={userInfo.profilePicture} alt="profile picture" />
    </>
  );
}
