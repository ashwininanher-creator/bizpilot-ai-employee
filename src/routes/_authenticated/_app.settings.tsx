import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — BizPilot AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", business_type: "", phone: "", gst_number: "", address: "",
  });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: biz } = await supabase.from("businesses").select("*").eq("owner_id", u.user.id).maybeSingle();
      if (biz) setForm({
        business_name: biz.business_name || "", business_type: biz.business_type || "",
        phone: biz.phone || "", gst_number: biz.gst_number || "", address: biz.address || "",
      });
    })();
  }, []);

  const save = async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setLoading(false); return; }
    const { error } = await supabase.from("businesses").update(form).eq("owner_id", u.user.id);
    setLoading(false);
    if (error) toast.error("Could not save", { description: error.message });
    else toast.success("Settings saved");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Business profile & preferences" />
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card max-w-3xl">
        <h3 className="font-display font-semibold mb-4">Business Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label="Business name"><Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></F>
          <F label="Business type"><Input value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })} /></F>
          <F label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></F>
          <F label="GST number"><Input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} /></F>
          <div className="sm:col-span-2"><F label="Address"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></F></div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={save} disabled={loading} className="bg-gradient-primary text-primary-foreground">
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
