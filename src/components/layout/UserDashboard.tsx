import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@clerk/backend";
import { UserActions } from "../user-actions";
import { serializeClerkUser } from "@/lib/utils";

export function UserList({ users }: { users: User[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const serializedUser = serializeClerkUser(user);
            return (
              <TableRow key={user.id}>
                <TableCell className="w-[80px]">
                  <Avatar>
                    <Image
                      src={serializedUser.imageUrl}
                      alt={serializedUser.email}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <AvatarFallback>
                      {serializedUser.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {serializedUser.email}
                </TableCell>
                <TableCell>
                  <UserActions user={serializedUser} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
