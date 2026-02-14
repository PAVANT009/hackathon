import { Folder } from 'lucide-react';
import React from 'react'

const quickAccessItems = [
  { id: 1, label: "Plumbing", chats: 23 },
  { id: 2, label: "Electrical", chats: 12 },
  { id: 3, label: "Cleaning", chats: 8 },
  { id: 4, label: "Carpenter", chats: 5 },
];
export default function QuickStart() {
  return (
<section className="w-full rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base bg-secondary text-secondary-foreground px-2.5 py-1 font-semibold tracking-tight md:text-lg rounded-md">Quick Access</h2>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Categories</span>
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
  )
}
