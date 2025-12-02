import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechIcon } from "@/components/icons/TechIcons";
import type { Skill } from "@/lib/types";

export function Skills({ data }: { data: Skill[] }) {
  return (
    <Section id="skills">
      <AnimatedTitle text="Skills & Tech Stack" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {data.map((skill) => (
          <Card 
            key={skill.name}
            className="group relative overflow-hidden bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:scale-105 neon-border hover:shadow-primary/20 hover:shadow-lg"
          >
             <div className="absolute -top-1 -right-1 bg-primary/20 w-16 h-16 rounded-full blur-2xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-4">
                <TechIcon name={skill.icon} className="w-8 h-8 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="font-semibold text-foreground">{skill.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
