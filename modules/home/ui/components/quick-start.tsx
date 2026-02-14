import { Folder } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const serviceTypes = ["PLUMBING", "ELECTRICAL", "CLEANING", "CARPENTRY", "OTHER"] as const;

export default async function QuickStart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return null;

  const grouped = await prisma.booking.groupBy({
    by: ["serviceType"],
    where: {
      userId: session.user.id,
      serviceType: { not: null },
    },
    _count: {
      _all: true,
    },
  });

  const countMap = new Map(grouped.map((g) => [g.serviceType, g._count._all]));
  const quickAccessItems = serviceTypes.map((label, idx) => ({
    id: idx + 1,
    label,
    chats: countMap.get(label) ?? 0,
  }));

  return (
    <section className="w-full rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base bg-secondary text-secondary-foreground px-2.5 py-1 font-semibold tracking-tight md:text-lg rounded-md">
          Quick Access
        </h2>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          Services
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {quickAccessItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="group flex min-h-28 w-full flex-col justify-between rounded-lg border border-border bg-muted/50 p-3 text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Folder className="h-5 w-5" />
            </div>

            <div>
              <p className="truncate text-sm font-medium text-card-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.chats} chats</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
