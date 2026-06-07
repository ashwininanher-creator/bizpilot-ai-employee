import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/business-setup")({
  head: () => ({ meta: [{ title: "Set up your business — BizPilot AI" }] }),
  component: BusinessSetupPage,
});

const TYPES = [
  "Bakery", "Cake Shop", "Salon", "Grocery Store",
  "Restaurant", "Clinic", "Medical Store", "Gym", "Other",
];

function BusinessSetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", business_type: "", phone: "", gst_number: "", address: "",
  });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: biz } = await supabase.from("businesses")
        .select("*").eq("owner_id", u.user.id).maybeSingle();
      if (biz?.is_onboarding_completed) {
        navigate({ to: "/dashboard" });
      } else if (biz) {
        setForm({
          business_name: biz.business_name || "",
          business_type: biz.business_type || "",
          phone: biz.phone || "",
          gst_number: biz.gst_number || "",
          address: biz.address || "",
        });
      }
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim() || !form.business_type) {
      toast.error("Please fill business name and type.");
      return;
    }
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setLoading(false); return; }
    const { error } = await supabase.from("businesses")
      .update({ ...form, is_onboarding_completed: true })
      .eq("owner_id", u.user.id);
    setLoading(false);
    if (error) { toast.error("Could not save", { description: error.message }); return; }
    toast.success("Business set up — welcome aboard!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-grid grid place-items-center px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            BizPilot <span className="text-gradient">AI</span>
          </span>
        </div>
        <div className="glass rounded-2xl border border-border/60 shadow-elegant p-6 sm:p-10">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Set up your business
          </h1>
          <p className="text-muted-foreground mt-1">
            Tell us a bit about your business so your AI Employee can get to work.
          </p>

          <form onSubmit={submit} className="mt-8 grid sm:grid-cols-2 gap-4">
            <Field label="Business name" required>
              <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="e.g. Sunrise Bakery" className="h-11" />
            </Field>
            <Field label="Business type" required>
              <Select value={form.business_type} onValueChange={(v) => setForm({ ...form, business_type: v })}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Choose type" /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91…" className="h-11" />
            </Field>
            <Field label="GST number (optional)">
              <Input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} placeholder="22AAAAA0000A1Z5" className="h-11" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Shop no., street, city" className="h-11" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-elegant">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue to dashboard <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground/80">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
