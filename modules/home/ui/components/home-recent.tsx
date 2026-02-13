import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data for recent chats
const recentChats = [
  {
    id: "chat001",
    category: "Work",
    name: "Project Alpha Discussion",
    createdAt: "2026-02-10",
    lastMessage: "Okay, let's proceed with the proposal.",
  },
  {
    id: "chat002",
    category: "Personal",
    name: "Family Group",
    createdAt: "2026-02-09",
    lastMessage: "Dinner at 7 PM tonight!",
  },
  {
    id: "chat003",
    category: "Development",
    name: "Gemini CLI Feedback",
    createdAt: "2026-02-08",
    lastMessage: "Thanks for the input, team.",
  },
];

export default function HomeRecent() {
  return (
    <section className="w-full min-h-8/12 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-5">
        <div className="mb-4 flex items-center">
          <h2 className="text-base bg-secondary text-secondary-foreground px-2.5 py-1 font-semibold tracking-tight md:text-lg rounded-md">Recent Chats</h2>
        </div>
        <Table><TableCaption>A list of your most recent conversations.</TableCaption> {/* Updated caption */}
        <TableHeader>
            <TableRow>
            <TableHead className="w-[120px]">Category</TableHead> {/* New header */}
            <TableHead>Chat Name</TableHead> {/* New header */}
            <TableHead className="w-[120px]">Created</TableHead> {/* New header */}
            <TableHead className="text-right">Last Message</TableHead> {/* New header */}
            </TableRow>
        </TableHeader>
        <TableBody>
            {recentChats.map((chat) => (
                <TableRow key={chat.id}>
                    <TableCell className="font-medium">{chat.category}</TableCell>
                    <TableCell>{chat.name}</TableCell>
                    <TableCell>{chat.createdAt}</TableCell>
                    <TableCell className="text-right truncate max-w-[200px]">{chat.lastMessage}</TableCell> {/* Added truncate for long messages */}
                </TableRow>
            ))}
        </TableBody>
        </Table>
    </section>
  )
}
