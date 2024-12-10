"use client";

import { fetchUsers } from "@/lib/data";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../transactions/table-skeleton";
import { columns } from "./columns";
import { UserDataTable } from "./user-data-table";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) {
    return <TableSkeleton />;
  }

  return <UserDataTable columns={columns} data={users} />;
}
