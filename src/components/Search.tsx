import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"


export default function Search() {
    return (
        <div className="flex-inline flex-row flex">
            <Selector />
            <Input 
            className="bg-white rounded-none" 
            placeholder="Search for "
            
            />
            <Button className="rounded-l-none bg-white border border-l-0 z-10 text-gray-600 hover:bg-gray-600 hover:text-white">
                <SearchIcon className="text-inherit" />
            </Button>
        </div>
    )
}

function Selector() {
    return (
        <Select>
            <SelectTrigger className="w-[125px] rounded-r-none border-r-none bg-white">
                <SelectValue placeholder="All filters" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="apple">All filters</SelectItem>
                    <SelectItem value="pineapple">User</SelectItem>
                    <SelectItem value="banana">Games</SelectItem>
                    <SelectItem value="blueberry">Sessions</SelectItem>
                    <SelectItem value="grapes">Interactions</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
