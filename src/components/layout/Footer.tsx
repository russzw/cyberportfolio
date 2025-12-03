import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/russzw" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/russellzw" },
  { name: "Twitter/X", icon: Twitter, href: "https://x.com/russ_zw" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/russzw" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          dev🔥russ — All Rights Reserved © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button key={link.name} variant="ghost" size="icon" asChild>
              <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                <link.icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
