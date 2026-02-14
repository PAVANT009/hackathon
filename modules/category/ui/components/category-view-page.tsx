

// "use client"

// import React, { useState } from "react"
// import {
//   DndContext,
//   closestCenter,
// } from "@dnd-kit/core"
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"

// function SortableItem({ id }: { id: string }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id })

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="flex items-center justify-between p-3 border rounded mb-2 bg-white"
//     >
//       <span>Category {id}</span>

//       {/* 🔥 Drag Handle */}
//       <button
//         {...attributes}
//         {...listeners}
//         className="cursor-grab px-2"
//       >
//         ⠿
//       </button>
//     </div>
//   )
// }

// export default function CategoryViewPage() {
//   const [items, setItems] = useState(["1", "2", "3", "4"])

//   return (
//     <div className="p-10 max-w-md mx-auto">
//       <DndContext
//         collisionDetection={closestCenter}
//         onDragEnd={(event) => {
//           const { active, over } = event

//           if (over && active.id !== over.id) {
//             setItems((items) => {
//               const oldIndex = items.indexOf(active.id as string)
//               const newIndex = items.indexOf(over.id as string)
//               return arrayMove(items, oldIndex, newIndex)
//             })
//           }
//         }}
//       >
//         <SortableContext
//           items={items}
//           strategy={verticalListSortingStrategy}
//         >
//           {items.map((id) => (
//             <SortableItem key={id} id={id} />
//           ))}
//         </SortableContext>
//       </DndContext>
//     </div>
//   )
// }
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingServiceType } from "@/src/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const serviceTypes: BookingServiceType[] = [
  "PLUMBING",
  "ELECTRICAL",
  "CLEANING",
  "CARPENTRY",
  "OTHER",
];

function toTitle(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

export default async function CategoryViewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [groupedByService, recentBookings] = await Promise.all([
    prisma.booking.groupBy({
      by: ["serviceType"],
      where: {
        userId: session.user.id,
        serviceType: { not: null },
      },
      _count: { _all: true },
    }),
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        conversation: {
          select: {
            id: true,
            updatedAt: true,
          },
        },
      },
    }),
  ]);

  const countMap = new Map(groupedByService.map((item) => [item.serviceType, item._count._all]));

  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-4 p-4 md:p-6">
      <section className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-5">
        <h1 className="text-lg font-semibold tracking-tight md:text-xl">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Booking volume grouped by service type.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {serviceTypes.map((type) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{toTitle(type)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{countMap.get(type) ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total chats</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* <section className="w-full rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight md:text-lg">Recent Category Activity</h2>
        </div> */}
        {/* <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[170px]">Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[220px]">Created</TableHead>
              <TableHead className="w-[220px]">Updated</TableHead>
              <TableHead className="text-right">Chat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.serviceType ? toTitle(booking.serviceType) : "N/A"}
                  </TableCell>
                  <TableCell>{booking.bookingStatus}</TableCell>
                  <TableCell>{booking.createdAt.toLocaleString()}</TableCell>
                  <TableCell>{booking.conversation.updatedAt.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/chat/${booking.conversationId}`}
                      className="underline underline-offset-2"
                    >
                      Open chat
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table> */}
      {/* </section> */}
    </div>
  );
}
