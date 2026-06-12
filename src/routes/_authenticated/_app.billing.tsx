import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { currency, db, fmtDate, getUserId, type Sale } from "@/lib/data";
import { downloadInvoicePDF, type InvoiceLine } from "@/lib/exports";

export const Route = createFileRoute("/_authenticated/_app/billing")({
  head: () => ({ meta: [{ title: "Billing — BizPilot AI" }] }),
  component: BillingPage,
});

function BillingPage() {
  const { data: sales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("sales").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const downloadInvoice = async (sale: Sale) => {
    try {
      const uid = await getUserId();
      const [{ data: items }, { data: biz }, { data: cust }] = await Promise.all([
        db.from("sale_items").select("*").eq("sale_id", sale.id),
        supabase.from("businesses").select("business_name,phone,address,gst_number").eq("owner_id", uid).maybeSingle(),
        sale.customer_id
          ? db.from("customers").select("name,phone,address").eq("id", sale.customer_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      const lines: InvoiceLine[] = (items || []).map((it: any) => ({
        name: it.product_name, qty: Number(it.quantity), price: Number(it.unit_price),
      }));
      downloadInvoicePDF({
        invoiceNo: sale.invoice_no,
        date: fmtDate(sale.sale_date),
        business: {
          name: biz?.business_name || "Your Business",
          phone: biz?.phone, address: biz?.address, gstin: biz?.gst_number,
        },
        customer: {
          name: (cust as any)?.name || sale.customer_name || "Walk-in",
          phone: (cust as any)?.phone, address: (cust as any)?.address,
        },
        lines,
        subtotal: Number(sale.subtotal),
        tax: Number(sale.tax),
        total: Number(sale.total),
        paymentMethod: sale.payment_method,
        status: sale.status,
      });
      toast.success("Invoice PDF downloaded");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        subtitle="GST invoices & PDF downloads"
        actions={
          <Button asChild className="bg-gradient-primary text-primary-foreground">
            <Link to="/sales"><Plus className="h-4 w-4" /> New Invoice</Link>
          </Button>
        }
      />

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-4">Invoice History</h3>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
        ) : sales.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">
            No invoices yet. Create a sale to generate one.
          </div>
        ) : (
          <div className="space-y-2">
            {sales.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:bg-secondary/40">
                <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.invoice_no} · {s.customer_name || "Walk-in"}</div>
                  <div className="text-[11px] text-muted-foreground">{fmtDate(s.sale_date)} · {currency(s.total)} · {s.payment_method || "—"}</div>
                </div>
                <Badge className={s.status === "Paid"
                  ? "bg-emerald-500/10 text-emerald-600 border-transparent"
                  : "bg-amber-500/10 text-amber-600 border-transparent"}>{s.status}</Badge>
                <Button variant="outline" size="sm" onClick={() => downloadInvoice(s)}>
                  <Download className="h-4 w-4" /> PDF
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
