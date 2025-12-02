import { PortfolioPage } from "@/components/PortfolioPage";
import { Contact } from "@/components/sections/Contact";
import { submitContactForm } from "@/app/actions";

export default function Home() {
  return (
    <PortfolioPage 
      contactSection={<Contact contactFormAction={submitContactForm} />} 
    />
  );
}
