"use client";

import { useRouter } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export type SidebarRecentItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export default function SidebarRecent({ items }: { items: SidebarRecentItem[] }) {
  const router = useRouter();

  if (!items.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton className="text-muted-foreground">
          No recent chats
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            className="bg-sidebar-accent/20"
            onClick={() => router.push(`/chat/${item.id}`)}
          >
            {item.title}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
