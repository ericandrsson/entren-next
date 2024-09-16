import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export function SidebarToggle() {
  const { isOpen, setIsOpen } = useSidebarToggle();

  return (
    <div className="absolute top-4 -right-6 z-[60]"> {/* Increased z-index */}
      <button
        onClick={setIsOpen}
        className="bg-white text-gray-700 border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <ChevronLeft
          className={cn(
            "h-6 w-6 transition-transform ease-in-out duration-700",
            isOpen ? "rotate-0" : "rotate-180"
          )}
        />
      </button>
    </div>
  );
}