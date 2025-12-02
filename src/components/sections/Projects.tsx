import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Github, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

export function Projects({ data }: { data: Project[] }) {
  return (
    <Section id="projects" className="bg-secondary/20">
      <AnimatedTitle text="Projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((project) => (
          <Card key={project.name} className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 neon-border">
            <div className="aspect-video overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={project.imageHint}
              />
            </div>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
