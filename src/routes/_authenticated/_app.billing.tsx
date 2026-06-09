import { createFileRoute } from "@tanstack/react-router";
import { Plus, FileText, Download, Send, Printer } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currency, recentInvoices } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/billing")({
  head: () => ({ meta: [{ title: "Billing — BizPilot AI" }] }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        subtitle="GST invoices, payment links, WhatsApp & email sharing"
        actions={<Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> New Invoice</Button>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Invoice History</h3>
          <div className="space-y-2">
            {recentInvoices.map((i) => (
              <div key={i.no} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:bg-secondary/40">
                <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{i.no} · {i.customer}</div>
                  <div className="text-[11px] text-muted-foreground">{i.date} · {currency(i.amount)}</div>
                </div>
                <Badge className={i.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-transparent" : "bg-amber-500/10 text-amber-600 border-transparent"}>{i.status}</Badge>
                <div className="hidden sm:flex gap-1">
                  <Button variant="ghost" size="icon"><Printer className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card space-y-4">
          <h3 className="font-display font-semibold">Quick Tools</h3>
          <Button variant="outline" className="w-full justify-start"><FileText className="h-4 w-4" /> Generate GST Invoice</Button>
          <Button variant="outline" className="w-full justify-start"><Send className="h-4 w-4" /> Share on WhatsApp</Button>
          <Button variant="outline" className="w-full justify-start"><Download className="h-4 w-4" /> Download as PDF</Button>
          <Button variant="outline" className="w-full justify-start"><Printer className="h-4 w-4" /> Print Invoice</Button>
          <div className="rounded-xl bg-secondary/40 p-3 text-xs text-muted-foreground">
            UPI QR & payment link generation activates after Razorpay is connected.
          </div>
        </div>
      </div>
    </div>
  );
}
