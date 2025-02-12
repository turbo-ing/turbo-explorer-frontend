"use client";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "./ui/button";

interface PaginationControlsProps {
    className?: string;
    pageIndex: number;
    pageCount: number;
    pageSize: number;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    className,
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    nextPage,
    previousPage,
}) => {
    return (
        pageSize >= 5 && (
            <div className={`flex flex-row border-t justify-between px-2 ${className}`}>
                <div className="flex items-center justify-center space-x-1 p-2">
                    <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(0)}
                    disabled={pageIndex === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={previousPage}
                    disabled={pageIndex === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {pageIndex} of {pageCount}
                </div>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={nextPage}
                    disabled={pageIndex >= pageCount}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(pageCount - 1)}
                    disabled={pageIndex >= pageCount}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center justify-center p-2 space-x-2 text-sm">
                <span>Page Size:</span>
                <select
                    className="border rounded px-2 py-1"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 30].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        )
    );
};

export default PaginationControls;