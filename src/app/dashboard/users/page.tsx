import { UserTable } from "@/components/users/user-table";

export const dynamic = "force-dynamic";

export default function UsersPage() {
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
      <UserTable />
    </div>
  );
}
