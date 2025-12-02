
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { type ContactFormState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Send Message
    </Button>
  );
}

interface ContactProps {
  contactFormAction: (prevState: ContactFormState, formData: FormData) => Promise<ContactFormState>;
}

export function Contact({ contactFormAction }: ContactProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const initialState: ContactFormState = { success: false, message: "", errors: null };

  const [state, formAction] = useActionState(contactFormAction, initialState);
  
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  React.useEffect(() => {
    if (state.success) {
      setShowSuccessMessage(true);
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setShowSuccessMessage(false);
    }
  }, [state]);


  return (
    <Section id="contact" className="bg-secondary/20">
      <AnimatedTitle text="Contact Me" />
      <Card className="max-w-xl mx-auto neon-accent-border">
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>
            Have a project in mind or just want to say hello? Drop me a line.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccessMessage ? (
             <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-accent/20">
              <div className="p-3 rounded-full bg-accent text-accent-foreground mb-4">
                <Send className="h-6 w-6"/>
              </div>
              <h3 className="text-xl font-bold text-accent-foreground">Message Sent!</h3>
              <p className="text-muted-foreground">{state.message}</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  required
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
              </div>
              {state.message && !state.success && !state.errors && <p className="text-sm text-destructive">{state.message}</p>}
              <SubmitButton />
            </form>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
