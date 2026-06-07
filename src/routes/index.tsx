import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import {
  SocialProof, HowItWorks, Industries, Features, AIEmployee,
  Benefits, Testimonials, Pricing, Security, FAQ, FinalCTA, SiteFooter,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BizPilot AI — Your First AI Employee" },
      { name: "description", content: "Automate billing, inventory, payments and reports for your small business. BizPilot AI works like a full-time employee — for bakeries, salons, restaurants, clinics and more." },
      { property: "og:title", content: "BizPilot AI — Your First AI Employee" },
      { property: "og:description", content: "Automate daily operations for your small business with AI." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://rsms.me" },
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Industries />
        <Features />
        <AIEmployee />
        <Benefits />
        <Testimonials />
        <Pricing />
        <Security />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
