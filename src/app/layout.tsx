import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { hankenGrotesk } from "@/lib/fonts";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { UserHydrator } from "@/providers/UserHydrator";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glimmers · Admin & Moderator",
  description: "The Glimmers Safety Platform — admin and moderator console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <UserHydrator />
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
