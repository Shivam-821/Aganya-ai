"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center space-y-8 z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full bg-gradient-to-b from-transparent to-background/50 mix-blend-overlay" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Oops! It seems you&apos;ve wandered into the void. The page
            you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-primary/20"
          >
            Return Home
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-full border border-border bg-background text-foreground font-semibold text-lg hover:bg-muted hover:border-primary/50 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
