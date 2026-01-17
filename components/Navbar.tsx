"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-13 h-12.5 rounded-xl bg-gradient-to-tr from-primary to-primary/50 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="Logo"
                width={24}
                height={22}
                className="w-13 h-[51px] rounded-lg hover:border hover:border-teal-300"
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Aganya AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 shadow-xl">
          <NavLinks mobile />
          <div className="h-px bg-border my-2" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Theme
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full py-3 text-center rounded-lg border border-border font-medium hover:bg-muted transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full py-3 text-center rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex justify-center py-2">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ mobile }: { mobile?: boolean }) {
  const links = [
    { name: "Dashboard", href: "/dashboard", protected: true },
    { name: "Simulations", href: "/simulations", protected: true },
    { name: "Features", href: "/#features", protected: false },
    { name: "Policy Impact", href: "/#policy", protected: false },
    { name: "How it works", href: "/#how-it-works", protected: false },
  ];

  const baseStyles = mobile
    ? "text-lg py-2 border-b border-border/50 text-foreground w-full text-left"
    : "text-sm text-muted-foreground hover:text-primary hover:scale-105 transform duration-200";

  return (
    <>
      {links.map((link) => (
        <div key={link.name}>
          {link.protected ? (
            <>
              <SignedIn>
                <Link href={link.href} className={baseStyles}>
                  {link.name}
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className={baseStyles}>{link.name}</button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <Link href={link.href} className={baseStyles}>
              {link.name}
            </Link>
          )}
        </div>
      ))}
    </>
  );
}
