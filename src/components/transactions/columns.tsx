"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/types/transaction";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "transaction_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.transaction_id}</div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => <div className="text-left">{row.original.username}</div>,
  },
  {
    accessorKey: "lunch_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full"
        >
          Lunch Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.lunch_price} VND</div>
    ),
  },

  {
    accessorKey: "transaction_confirmed",
    header: "Confirmed",
    cell: ({ row }) => (
      <div className="text-left pl-4">
        {row.original.transaction_confirmed ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.transaction_date;
      return (
        <div>
          {new Date(date).toString() !== "Invalid Date"
            ? new Date(date).toLocaleString("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Asia/Ho_Chi_Minh",
              })
            : String(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("paid") ? "Yes" : "No"}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

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
                navigator.clipboard.writeText(
                  transaction.transaction_id.toString()
                )
              }
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem
              disabled={!transaction.transaction_image}
              onClick={() => {
                window.open(transaction.transaction_image, "_blank");
              }}
            >
              View image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
