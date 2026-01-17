import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: "Aganya AI", // Replaces "Sign in to My Application"
            subtitle:
              "Welcome back! Predict Demand. Minimize Waste. Master the Market.", // Replaces "Welcome back!..."
          },
        },
        signUp: {
          start: {
            title: "Aganya AI", // Replaces "Sign in to My Application"
            subtitle:
              "Join Aganya AI today and take control of your business with intelligent demand forecasting.", // Replaces "Welcome back!..."
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${oswald.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
        >
          <ThemeProvider defaultTheme="light" storageKey="techsprint-theme">
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-24 pb-20">{children}</main>
              <DisclaimerBanner />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
