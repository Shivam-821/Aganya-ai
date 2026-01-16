import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aganya AI - Intelligent Demand Forecasting",
  description: "Predict Demand. Minimize Waste. Master the Market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider defaultTheme="light" storageKey="techsprint-theme">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-24 pb-12">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
