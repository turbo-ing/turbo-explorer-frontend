"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Session } from '../turbo-explorer'
import Link from "next/link";
import { Eye } from "lucide-react";

function formatShortDate(date: Date): string {
    // Ensure date is a valid Date object
    const validDate = typeof date === 'string' ? new Date(date) : date;

    if (!(validDate instanceof Date) || isNaN(validDate.getTime())) {
        throw new Error("Invalid date provided");
    }

    const userLocale = navigator.language || 'en-US';
    const month = (validDate.getMonth() + 1).toString();
    const day = validDate.getDate().toString()
    const year = (validDate.getFullYear() % 100).toString().padStart(2, '0'); // Last two digits of the year
    const hours = validDate.getHours().toString().padStart(2, '0');
    const minutes = validDate.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

export const columns: ColumnDef<Session>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <div className="text-center">
                {row.original.interaction_count}
            </div>
        ),
    },
    {
        accessorKey: "topic",
        header: "Topic ID",
    },
    {
        accessorKey: "created_at",
        header: "Timestamp",
        cell: ({ row }) => formatShortDate(row.original.created_at),
    },
    {
        accessorKey: "interaction_count",
        header: "Interactions",
        cell: ({ row }) => (
            <div className="text-center">
                {row.original.interaction_count}
            </div>
        ),
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Link href={`/session/${row.original.id}`} className="text-indigo-600 hover:text-indigo-900 flex justify-center">
                <Eye className="w-5 h-5" />
            </Link>
        ),
    },
]