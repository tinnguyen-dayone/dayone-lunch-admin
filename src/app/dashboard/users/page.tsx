import { UserList } from "@/components/layout/UserDashboard";
import { getUsers } from "@/lib/user";
import { clerkClient } from "@clerk/nextjs/server";

export default async function Page() {
  const client = await clerkClient();
  const data = await client.users.getUserList();
  if (!data) {
    return <div>Error</div>;
  }
  const users = data.data;

  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User List</h2>
          <p className="text-muted-foreground">
            Manage your users and their roles here.
          </p>
        </div>
      </div>
      <UserList users={users} />
    </div>
  );
}
