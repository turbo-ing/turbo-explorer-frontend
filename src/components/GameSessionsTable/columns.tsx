"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Session } from '../turbo-explorer'
import Link from "next/link";
import { Eye } from "lucide-react";

// Helper function to display "X time "
function formatTimeAgo(date: Date | string): string {
  // Convert incoming date (possibly string) to a Date object
  const validDate = typeof date === 'string' ? new Date(date) : date

  if (!(validDate instanceof Date) || isNaN(validDate.getTime())) {
    throw new Error("Invalid date provided")
  }

  const now = new Date()
  const seconds = Math.floor((now.getTime() - validDate.getTime()) / 1000)

  if (seconds < 60) {
    return "just now"
  }
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""}`
  }
  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""}`
  }
  const weeks = Math.floor(days / 7)
  if (weeks < 5) {
    return `${weeks} week${weeks > 1 ? "s" : ""}`
  }
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""}`
  }
  const years = Math.floor(months / 12)
  return `${years} year${years > 1 ? "s" : ""}`
}

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "topic",
    header: "Topic ID",
    // should remove domain part from topic id i think would shorten and
    // remove repetition
    cell: ({ row }) => row.original.topic.split("#")[2],
  },
  {
    accessorKey: "created_at",
    header: "Age",
    cell: ({ row }) => formatTimeAgo(row.original.created_at),
  },
  {
    accessorKey: "interaction_count",
    header: "Interactions",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <Link 
        href={`/session/${row.original.id}`} 
        className="text-indigo-600 hover:text-indigo-900 flex justify-center lg:justify-normal"
      >
        <Eye className="w-5 h-5" />
      </Link>
    ),
  },
]