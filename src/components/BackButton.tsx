import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href: string,
    children?: ReactNode
    className?: string
}

export default function BackButton({ href, children, className }: BackButtonProps) {
    return (
        <Link href={href} className={cn("inline-flex items-center text-turbo-red hover:underline sm:mb-4", className)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {children}
        </Link>
    )
}