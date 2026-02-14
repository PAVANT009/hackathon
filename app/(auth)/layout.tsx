import "../globals.css"; 
import { ThemeProvider } from "@/components/theme-provider"; // Re-use ThemeProvider
import { SonnerToaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SonnerToaster />
          <div className="flex min-h-svh min-w-svw items-center justify-center">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
