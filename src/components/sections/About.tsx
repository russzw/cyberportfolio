import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import type { AboutData } from "@/lib/types";

export function About({ data }: { data: AboutData }) {
  return (
    <Section id="about">
      <AnimatedTitle text="About Me" />
      <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed">
        {data.paragraph}
      </p>
    </Section>
  );
}
