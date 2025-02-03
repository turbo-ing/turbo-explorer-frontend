'use client'
import { useEffect, useState } from "react";
import Search, { FilterType } from "./Search";
import { fetchSearch, SearchQueryResult } from "@/util/fetchSearch";
import { ChevronDown } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

interface SearchPanelProps {
    initialQuery: string;
    initialFilter: FilterType;
    initialResults: SearchQueryResult[];
}

enum SortType {
    NEWEST = "newest",
    OLDEST = "oldest",
}

export default function SeachPanel({ initialQuery, initialFilter, initialResults }: SearchPanelProps) {
    const [results, setResults] = useState<SearchQueryResult[]>(initialResults)
    const [sort, setSort] = useState<SortType>(SortType.NEWEST)

    const handleSearch = async (query: string, filter: FilterType) => {
        const result = await fetchSearch(query, filter);
        setResults(result);

        const url = new URL(window.location.href);
        url.searchParams.delete('query');
        url.searchParams.delete('filter');
        if (query !== "") {
            url.searchParams.set('query', query);
        }
        if (filter !== FilterType.ALL) {
            url.searchParams.set('filter', filter);
        }
        window.history.pushState({}, '', url);
    }

    // TODO: Implement sorting
    // useEffect(() => {
    //     const sortedResults = [...results].sort((a, b) => {
    //         if (sort === SortType.NEWEST) {
    //             return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    //         } else {
    //             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    //         }
    //     });
    //     setResults(sortedResults);
    // },[sort])

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Search initialQuery={initialQuery} initialFilter={initialFilter} overrideHandleSubmit={handleSearch} />
                <div className="flex justify-between items-center">
                    <Selector sort={sort} setSort={setSort} />
                    <div className="text-center text-stone-500 text-sm mb-2 font-bold">
                        This is a work in progress
                    </div>
                    <p className="text-stone-600 text-sm">Showing {results.length} results</p>
                </div>
            </div>
            <div className="space-y-1 bg-white p-4 rounded-lg">
                {results.map((result) => (
                    <div className="p-2 border-b" key={result.id}>{result.title}</div>
                ))}
            </div>
        </div>
    )
}

interface SelectorProps {
    sort: SortType;
    setSort: (sort: SortType) => void;
}

function Selector({ sort, setSort }: SelectorProps) {
    return (
        <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px] text-stone-900 bg-white">
                <SelectValue placeholder="All filters" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={SortType.NEWEST}>Sort by: Newest</SelectItem>
                    <SelectItem value={SortType.OLDEST}>Sort by: Oldest</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
