import "../globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SonnerToaster } from "@/components/ui/sonner"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PageNavbar } from "@/modules/dashboard/ui/components/navbar"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    redirect("/sign-in")
  }

  const recentConversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { messageText: true },
      },
    },
  })

  const recentConversationItems = recentConversations.map((c) => ({
    id: c.id,
    title: c.messages[0]?.messageText?.slice(0, 40) || `Chat ${c.id.slice(0, 8)}`,
    updatedAt: c.updatedAt.toISOString(),
  }))

  return (
    <html lang="en">
      <body className="bg-sidebar">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SonnerToaster />
          <SidebarProvider>
            <div className="flex min-h-svh w-full flex-col">
              <PageNavbar />
              <div className="flex flex-1 overflow-hidden">
                <AppSidebar 
                  user={
                    session?.user
                      ? { ...session.user, phoneNumber: null, image: session.user.image ?? null }
                      : undefined
                  }
                  recentConversations={recentConversationItems}
                />
                <main className="flex-1 overflow-auto bg-background rounded-l-2xl">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
