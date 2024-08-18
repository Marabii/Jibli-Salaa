import apiServer from "@/utils/apiServer";
import SpokenLanguagesForm from "./spokenlanguages/SelectSpokenLanguages";
export default async function TravelerPage() {
  const { userInfo } = await apiServer("/api/getUser");
  const { traveler } = await apiServer("/api/getTraveler");
  return (
    <>
      <h2>Hey {userInfo.name}! welcome back.</h2>
      <img src={userInfo.profilePicture} alt="profile picture" />
      {traveler && (
        <>
          <p>
            You are {traveler.premiumMember ? "a premium" : "not a premium"}{" "}
            member
          </p>
          <p>
            You are {traveler.verified ? "a verified" : "not a verified"} user
          </p>
          <div>
            <ul>
              {traveler.spokenLanguages.map((language) => (
                <li>{language.name}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      {!traveler && (
        <div>
          <h2>You must select what languages you speak: </h2>
          <SpokenLanguagesForm />
        </div>
      )}
    </>
  );
}
