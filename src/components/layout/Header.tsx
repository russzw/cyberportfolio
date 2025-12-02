"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FireExtinguisher, Flame } from "lucide-react";
import React from "react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <a href="#home" className="mr-auto flex items-center gap-2 font-bold text-lg">
          dev<Flame className="h-5 w-5 text-primary" />russ
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Button key={link.name} variant="ghost" asChild>
              <a href={link.href}>{link.name}</a>
            </Button>
          ))}
        </nav>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
