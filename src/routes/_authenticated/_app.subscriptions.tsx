import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlans, currency } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — BizPilot AI" }] }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  // Plan is stored locally until Razorpay is connected.
  const [currentPlanId, setCurrentPlanId] = useState<string>(() => {
    if (typeof window === "undefined") return "starter";
    return localStorage.getItem("bp_plan") || "starter";
  });

  const choose = (planId: string, price: number) => {
    if (planId === currentPlanId) return;
    if (price === 0) {
      setCurrentPlanId(planId);
      localStorage.setItem("bp_plan", planId);
      toast.success("Switched to Starter plan");
      return;
    }
    toast.info("Connect Razorpay to enable paid plans", {
      description: "Go to Settings → Payments to add your Razorpay keys.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" subtitle="Pick a plan that grows with your business" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {subscriptionPlans.map((p) => {
          const isCurrent = p.id === currentPlanId;
          return (
            <div key={p.id} className={`relative rounded-2xl border p-5 shadow-card ${p.popular ? "border-primary bg-gradient-to-br from-primary/5 to-transparent" : "border-border/60 bg-card"}`}>
              {p.popular && (
                <Badge className="absolute -top-2 right-4 bg-gradient-primary text-primary-foreground border-transparent">
                  <Sparkles className="h-3 w-3" /> Popular
                </Badge>
              )}
              {isCurrent && (
                <Badge className="absolute -top-2 left-4 bg-emerald-500 text-white border-transparent">Current</Badge>
              )}
              <div className="font-display font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.blurb}</div>
              <div className="mt-3"><span className="text-3xl font-semibold">{p.price === 0 ? "Free" : currency(p.price)}</span>{p.price > 0 && <span className="text-xs text-muted-foreground"> /mo</span>}</div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Button
                onClick={() => choose(p.id, p.price)}
                disabled={isCurrent}
                className={`w-full mt-5 ${p.popular && !isCurrent ? "bg-gradient-primary text-primary-foreground" : ""}`}
                variant={p.popular && !isCurrent ? "default" : "outline"}
              >
                {isCurrent ? "Current plan" : p.price === 0 ? "Switch to Free" : "Upgrade"}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card text-sm text-muted-foreground">
        Razorpay (UPI, GPay, PhonePe, cards, net banking) activates after you connect your keys.
      </div>
    </div>
  );
}
