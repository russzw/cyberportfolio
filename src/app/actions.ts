
"use server";

import { z } from "zod";
import { collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  } | null;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }
  
  const { firestore } = initializeFirebase();
  const submissionsCollection = collection(firestore, "contact_form_submissions");
  
  // The promise is intentionally not awaited to avoid blocking.
  // Error handling is managed within addDocumentNonBlocking via the global error emitter.
  addDocumentNonBlocking(submissionsCollection, {
    ...validatedFields.data,
    createdAt: serverTimestamp(),
  });

  return {
    success: true,
    message: "Thank you for your message! I'll get back to you soon.",
    errors: null,
  };
}
