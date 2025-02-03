"use client"

import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SearchButton() {
    const pathname = usePathname()
    
    return (
        pathname !== "/" && pathname !== "/search" && (
            <div className="flex items-center">
                <Link href="/search" className="flex items-center bg-stone-900 text-white py-2 px-4 hover:bg-transparent hover:text-stone-900 border border-stone-900 rounded-md transition-colors">

                    <SearchIcon className="size-4 mr-2" />
                    <span className="text-sm">Search</span>
                </Link>
            </div>
        )
    )
}