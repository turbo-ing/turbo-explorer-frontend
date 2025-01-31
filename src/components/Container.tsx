import { cn } from "@/lib/utils";
export default function Container({ children, color, className, ...props }: { children: React.ReactNode, color?: string, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("size-full max-w-[100vw]", color)}>
            <div className={cn("container mx-auto px-4 max-w-[1000px]", className)} {...props}>
                {children}
            </div>
        </div>
    );
}
