import "../globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
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

  return (
    <html lang="en">
      <body className="bg-sidebar">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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