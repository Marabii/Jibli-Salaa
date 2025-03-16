export default function ProfileLayout({
  userDetails,
}: {
  userDetails: React.ReactNode;
}) {
  return (
    <div className="flex px-2 pb-36 w-full flex-col items-center pt-20 text-center">
      <h1 className="font-playfair text-6xl font-bold">Your Profile</h1>
      <>{userDetails}</>
    </div>
  );
}
