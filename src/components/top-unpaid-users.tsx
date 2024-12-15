"use client";

import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchUnpaidUsers } from "@/lib/data";
import { useEffect, useState } from "react";
import { formatVND } from "@/lib/utils";
import { UnpaidTransactionsDialog } from "./unpaid-transactions-dialog";

interface UnpaidUser {
  id: string;
  name: string;
  image: string | null;
  total_unpaid: number;
  last_order: string;
  order_count: number;
}

export function TopUnpaidUsers() {
  const [users, setUsers] = useState<UnpaidUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnpaidUsers = async () => {
      try {
        const data = await fetchUnpaidUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch unpaid users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUnpaidUsers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Unpaid Users</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Top Unpaid Users
        </CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>USER</TableHead>
              <TableHead>ORDERS</TableHead>
              <TableHead>LAST ORDER</TableHead>
              <TableHead className="text-right">UNPAID AMOUNT</TableHead>
              <TableHead className="w-[50px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </TableCell>
                <TableCell>{user.order_count}</TableCell>
                <TableCell>
                  {new Date(user.last_order).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-medium text-red-600">
                  {formatVND(user.total_unpaid * 1000)}
                </TableCell>
                <TableCell>
                  <UnpaidTransactionsDialog
                    userId={user.id}
                    userName={user.name}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
