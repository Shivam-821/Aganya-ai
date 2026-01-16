"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

// Ideally these should be in .env
const SERVICE_ID = "service_x5suzsk"; 
const TEMPLATE_ID = "R3aStD0tR0FAHyy2m";
const PUBLIC_KEY = "R3aStD0tR0FAHyy2m";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setStatus("idle");

    try {
      // NOTE: User needs to replace with actual keys or use env variables
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      setStatus("success");
      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Get in touch</h1>
          <p className="text-muted-foreground">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="user_name" className="text-sm font-medium leading-none">Name</label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user_email" className="text-sm font-medium leading-none">Email</label>
                <input
                  id="user_email"
                  name="user_email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium leading-none">Message</label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="How can we help you?"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2",
                loading && "opacity-70 cursor-wait"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>

            {status === "success" && (
              <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm text-center border border-green-500/20">
                Message sent successfully! We&apos;ll get back to you soon.
              </div>
            )}
            
            {status === "error" && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center border border-destructive/20">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
