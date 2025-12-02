import { PortfolioPage } from "@/components/PortfolioPage";
import { submitContactForm } from "@/app/actions";

export default function Home() {
  return <PortfolioPage contactFormAction={submitContactForm} />;
}
