import { cn } from "@/lib/utils";
import { PanelsTopLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/app/(map)/_components/SidebarToggle";

export function Sidebar() {
  const { isOpen } = useSidebarToggle();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-800 text-black dark:text-white transition-[width] ease-in-out duration-300 shadow-lg",
        isOpen ? "w-72" : "w-[90px]"
      )}
    >
      <SidebarToggle />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 justify-start",
            isOpen ? "translate-x-0" : "translate-x-1"
          )}
          variant="ghost"
        >
          <PanelsTopLeft className="w-6 h-6 mr-1" />
          <h1
            className={cn(
              "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
              isOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-96 opacity-0 hidden"
            )}
          >
            Map Explorer
          </h1>
        </Button>
        {/* Add your sidebar content here */}
      </div>
    </aside>
  );
}
