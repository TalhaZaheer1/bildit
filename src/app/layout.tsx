import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/providers/ModalProvider";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bildit",
  description: "All in one agency solution",
  icons:{
    icon:"/assets/plura-logo.svg"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
          {children}
          <Toaster />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
