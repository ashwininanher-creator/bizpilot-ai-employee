import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, LogOut, TrendingUp, Package, Receipt, Users } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — BizPilot AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: profile } = await supabase
        .from("profiles").select("full_name").eq("id", u.user.id).maybeSingle();
      const { data: biz } = await supabase
        .from("businesses").select("business_name, is_onboarding_completed")
        .eq("owner_id", u.user.id).maybeSingle();
      if (biz && !biz.is_onboarding_completed) {
        navigate({ to: "/business-setup" });
        return;
      }
      setName(profile?.full_name || u.user.email || "there");
      setBusinessName(biz?.business_name || "your business");
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  const stats = [
    { label: "Today's Sales", value: "₹0", icon: TrendingUp },
    { label: "Inventory Items", value: "0", icon: Package },
    { label: "Bills Generated", value: "0", icon: Receipt },
    { label: "Customers", value: "0", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 glass sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display font-semibold tracking-tight">BizPilot <span className="text-gradient">AI</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Welcome back, <span className="text-gradient">{name.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's a snapshot of {businessName}.</p>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-elegant"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-8 text-center">
          <Sparkles className="h-8 w-8 mx-auto text-primary" />
          <h2 className="mt-3 font-display text-xl font-semibold">Your AI Employee is online</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Start by adding products and customers — BizPilot AI will handle the rest.
          </p>
        </div>
      </main>
    </div>
  );
}
