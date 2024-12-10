"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "user_id",
    enableSorting: true,
    header: "ID",
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.original.userId}</div>;
    },
  },
  {
    accessorKey: "username",
    enableSorting: true,
    header: "Username",
  },
  {
    accessorKey: "totalUnpaid",
    enableSorting: true,
    header: "Total Unpaid",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalUnpaid")) * 1000;
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const a = parseFloat(rowA.getValue("totalUnpaid"));
      const b = parseFloat(rowB.getValue("totalUnpaid"));
      return a - b;
    },
  },
  {
    id: "actions",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(user.userId.toString())
              }
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
