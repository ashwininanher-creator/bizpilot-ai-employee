import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { currency, demoSales } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/sales")({
  head: () => ({ meta: [{ title: "Sales — BizPilot AI" }] }),
  component: SalesPage,
});

function SalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        subtitle="Every sale, every payment, in one place"
        actions={<Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> New Sale</Button>}
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search invoice or customer…" className="pl-9 h-9" />
          </div>
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Paid</Button>
          <Button variant="outline" size="sm">Pending</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="text-left">
                <th className="px-2 py-2">Invoice</th><th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Amount</th><th className="px-2 py-2">Payment</th>
                <th className="px-2 py-2">Status</th><th className="px-2 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {demoSales.map((s) => (
                <tr key={s.no} className="border-t border-border/60">
                  <td className="px-2 py-3 font-medium">{s.no}</td>
                  <td className="px-2 py-3">{s.customer}</td>
                  <td className="px-2 py-3">{currency(s.amount)}</td>
                  <td className="px-2 py-3 text-muted-foreground">{s.payment}</td>
                  <td className="px-2 py-3">
                    <Badge className={s.status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-600 border-transparent"
                      : "bg-amber-500/10 text-amber-600 border-transparent"}>{s.status}</Badge>
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
