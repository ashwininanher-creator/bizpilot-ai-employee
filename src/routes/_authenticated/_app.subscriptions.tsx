import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlans, currency } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — BizPilot AI" }] }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" subtitle="Pick a plan that grows with your business" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {subscriptionPlans.map((p) => (
          <div key={p.id} className={`relative rounded-2xl border p-5 shadow-card ${p.popular ? "border-primary bg-gradient-to-br from-primary/5 to-transparent" : "border-border/60 bg-card"}`}>
            {p.popular && (
              <Badge className="absolute -top-2 right-4 bg-gradient-primary text-primary-foreground border-transparent">
                <Sparkles className="h-3 w-3" /> Popular
              </Badge>
            )}
            <div className="font-display font-semibold">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.blurb}</div>
            <div className="mt-3"><span className="text-3xl font-semibold">{p.price === 0 ? "Free" : currency(p.price)}</span>{p.price > 0 && <span className="text-xs text-muted-foreground"> /mo</span>}</div>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}</li>
              ))}
            </ul>
            <Button className={`w-full mt-5 ${p.popular ? "bg-gradient-primary text-primary-foreground" : ""}`} variant={p.popular ? "default" : "outline"}>
              {p.price === 0 ? "Current plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card text-sm text-muted-foreground">
        Razorpay (UPI, GPay, PhonePe, cards, net banking) activates after you connect your keys.
      </div>
    </div>
  );
}
