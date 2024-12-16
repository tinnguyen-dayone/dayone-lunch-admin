import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  email: string;
  imageUrl: string;
}

interface UserDashboardProps {
  users: User[];
}

export function UserDashboard({ users }: UserDashboardProps) {
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="w-[80px]">
                <Avatar>
                  <Image
                    src={user.imageUrl}
                    alt={user.email}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Avatar>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{/* Add your custom actions here */}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
