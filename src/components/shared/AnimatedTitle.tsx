import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  text: string;
  className?: string;
}

export function AnimatedTitle({ text, className }: AnimatedTitleProps) {
  return (
    <h2 className={cn("text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-glow mb-12 text-center", className)}>
      <span className="text-primary">{'<'}</span>
      {text}
      <span className="text-primary">{' />'}</span>
    </h2>
  );
}
