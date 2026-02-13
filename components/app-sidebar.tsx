"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bolt, ChevronDown, Home, Plus, Search, User2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ModeToggle } from "./toggle-btn"
import MenuSVG from "@/components/MenuSVG"
import { User } from "@/src/generated/prisma"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"



// export function AppSidebar() {
//   return (
//     <Sidebar className="h-64 bg-amber-200  ">
//       <SidebarHeader className="bg-red-400">
//         <SidebarMenu className="">
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton>
//                   Select Workspace
//                   <ChevronDown className="ml-auto" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
//                 <DropdownMenuItem>
//                   <span>Acme Inc</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton>
//               <User2 /> Username
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }
interface sidebarProps {
  user?: User & { phoneNumber?: string | null }
}


export function AppSidebar({user}: sidebarProps) {
    const router = useRouter();

   const recentChats = [
    { id: 1, title: "Project ideas" },
    { id: 2, title: "React bugs" },
    { id: 3, title: "Job board app" },
  ]

const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in"); 
        },
      },
    });
  };


return (
  <Sidebar className=" dark:border-none">
    <SidebarContent className="ml-1.5">
      <SidebarGroup>
        <div className="h-10 w-[70%]  my-2.5 flex items-center justify-center bg-primary gap-2 px-2 py-1 rounded-lg">
          <button className="flex items-center gap-2 text-sm font-medium" onClick={() => router.push("/")}>
            <Plus className="h-4 w-4 bg-primary-foreground p-0.5 rounded-full" size={28} />
            <span className="text-primary-foreground">
            New Chat
            </span> 
          </button>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground"><Home/> Home</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground"><MenuSVG/> Categories</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground"><Bolt/> Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            {recentChats.map((chat,i) => (
              <SidebarMenuItem key={chat.id}>
                { i !== 0 ? <SidebarMenuButton className="bg-sidebar-accent/20">{chat.title}</SidebarMenuButton> :
                  <SidebarMenuButton className="bg-sidebar-accent/90">
                  <div className="w-2 h-6 bg-primary rounded-sm"></div>
                    {chat.title}
                  </SidebarMenuButton>
                }
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

    </SidebarContent>

    <SidebarFooter className="mb-6">
      <SidebarMenu className="flex flex-row">
        <SidebarMenuItem>
          <SidebarMenuButton>
            <User2 /> {user?.name}
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleSignOut}>Logout</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
)
}
