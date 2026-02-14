import Link from "next/link";
import { headers } from "next/headers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HomeRecent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const recentChats = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: {
      booking: {
        select: {
          serviceType: true,
          bookingStatus: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          messageText: true,
        },
      },
    },
  });

  return (
    <section className="w-full min-h-7/12 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-5">
        <div className="mb-4 flex items-center">
          <h2 className="text-base bg-secondary text-secondary-foreground px-2.5 py-1 font-semibold tracking-tight md:text-lg rounded-md">Recent Chats</h2>
        </div>
        <Table><TableCaption>A list of your most recent conversations.</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[220px]">UUID</TableHead>
            <TableHead className="w-[140px]">Service</TableHead>
            <TableHead>Chat</TableHead>
            <TableHead className="w-[180px]">Updated</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="text-right">Last Message</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {recentChats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No chats yet.
                </TableCell>
              </TableRow>
            ) : (
              recentChats.map((chat) => {
                const lastMessage = chat.messages[0]?.messageText ?? "-";
                const chatName = `Chat ${chat.id.slice(0, 8)}`;
                return (
                  <TableRow key={chat.id}>
                    <TableCell className="font-mono text-xs">{chat.id}</TableCell>
                    <TableCell className="font-medium">{chat.booking?.serviceType ?? "N/A"}</TableCell>
                    <TableCell>
                      <Link className="underline underline-offset-2" href={`/chat/${chat.id}`}>
                        {chatName}
                      </Link>
                    </TableCell>
                    <TableCell>{chat.updatedAt.toLocaleString()}</TableCell>
                    <TableCell>{chat.booking?.bookingStatus ?? "N/A"}</TableCell>
                    <TableCell className="text-right truncate max-w-[280px]">{lastMessage}</TableCell>
                  </TableRow>
                );
              })
            )}
        </TableBody>
        </Table>
    </section>
  )
}
