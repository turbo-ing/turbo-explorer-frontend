import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface BackButtonProps {
    href: string,
    children?: ReactNode
}

export default function BackButton({ href, children }: BackButtonProps) {
    return (
        <Link href={href} className="inline-flex items-center text-turbo-red hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {children}
        </Link>
    )
}