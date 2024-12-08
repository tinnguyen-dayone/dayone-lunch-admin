import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="mx-auto py-10">
    <UserProfile path="/dashboard/profile" />
  </div>
);

export default UserProfilePage;
