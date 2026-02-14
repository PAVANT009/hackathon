// import { SidebarTrigger } from "@/components/ui/sidebar"

// export function Navbar() {
//   return (
//     <header className="h-14 w-full border-b flex items-center gap-4 px-4">
//       <h1 className="font-semibold">My App</h1>
//     </header>
//   )
// }
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon, PanelRightIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "@/modules/dashboard/ui/components/dashboard-command";
import { ModeToggle } from "@/components/toggle-btn";

export const PageNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
    <DashboardCommand open={commandOpen} setOpen={setCommandOpen}/>
    <nav className="sticky top-0 z-40 h-14 w-full shrink-0 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-none flex items-center justify-between"> 
      <div className="text-3xl">SnapFix</div>
      {/* <Button className="size-9" variant="outline" onClick={toggleSidebar}>
        {state === "collapsed" || isMobile ? (
          <PanelLeftIcon className="size-4" />
        ) : ( 
          <PanelRightIcon className="size-4" />
        )}
      </Button> */}

      <Button
                className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground" 
                variant={"outline"}
                size={"sm"}
                onClick={() => setCommandOpen((open) => !open)}
            >
                <SearchIcon/>
                Search
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-secondary px-1.5 font-mono text-[10px] font-medium text-secondary-foreground">
                    <span>&#8984;</span>k
                </kbd>
            </Button>

      <div className="flex flex-row justify-end gap-x-2">
        <ModeToggle/>
      </div>
    </nav>
    </>
  );
};
