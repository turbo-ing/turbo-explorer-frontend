"use client"
import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState<FilterType>(FilterType.ALL);

    const handleSubmit = () => {
        const searchParams = new URLSearchParams({
            query,
            filter,
        }).toString();
        console.log(`/search?${searchParams}`);
        router.push(`/search?${searchParams}`);
    };

    return (
        <div className="flex-inline flex-row flex">
            <Selector filter={filter} setFilter={setFilter} />
            <Input
                className="bg-white rounded-none"
                placeholder="Search for "
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit();
                    }
                }}
            />
            <Button 
            onClick={handleSubmit}
            className="rounded-l-none hover:bg-white border border-l-0 z-10 hover:text-stone-900 bg-stone-900 text-white">
                <SearchIcon className="text-inherit" />
            </Button>
        </div>
    )
}

interface SelectorProps {
    filter: string;
    setFilter: (value: FilterType) => void;
}

enum FilterType {
    ALL = "all",
    USER = "user",
    GAMES = "games",
    SESSIONS = "sessions",
    INTERACTIONS = "interactions",
}

function Selector({ filter, setFilter }: SelectorProps) {
    return (
        <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[125px] rounded-r-none border-r-none bg-white">
                <SelectValue placeholder="All filters" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={FilterType.ALL}>All filters</SelectItem>
                    <SelectItem value={FilterType.USER}>User</SelectItem>
                    <SelectItem value={FilterType.GAMES}>Games</SelectItem>
                    <SelectItem value={FilterType.SESSIONS}>Sessions</SelectItem>
                    <SelectItem value={FilterType.INTERACTIONS}>Interactions</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
