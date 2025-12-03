"use client";

import React from "react";
import Link from "next/link";
import { Flame, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Tech Stacks", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center">
        <Link
          href="#home"
          className="mr-auto flex items-center gap-2 font-bold text-lg"
        >
          dev<Flame className="h-5 w-5 text-primary" />russ
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Button key={link.name} variant="ghost" asChild>
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-4">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex flex-col gap-4 p-4">
                  <Link
                    href="#home"
                    className="mr-auto flex items-center gap-2 font-bold text-lg"
                    onClick={closeMobileMenu}
                  >
                    dev<Flame className="h-5 w-5 text-primary" />russ
                  </Link>
                  <nav className="flex flex-col items-start gap-2">
                    {navLinks.map((link) => (
                      <Button
                        key={link.name}
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href={link.href} onClick={closeMobileMenu}>
                          {link.name}
                        </Link>
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
