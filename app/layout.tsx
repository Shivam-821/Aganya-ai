import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const oswald = localFont({
  src: [
    {
      path: "../fonts/static/Oswald-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/static/Oswald-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/static/Oswald-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/static/Oswald-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aganya AI - Intelligent Demand Forecasting",
  description: "Predict Demand. Minimize Waste. Master the Market.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${oswald.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
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
