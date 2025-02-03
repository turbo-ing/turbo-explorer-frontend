import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";

export default function NotFoundElement({ message = "No data found", className }: { message?: string, className?: string }) {
  return (
    <div className={cn("text-center text-stone-600 bg-gray-100 rounded-md p-2 flex items-center justify-center py-6", className)}>
    <FileQuestion className="w-4 h-4 mr-2" />
    <p>{message}</p>
  </div>
  )
}