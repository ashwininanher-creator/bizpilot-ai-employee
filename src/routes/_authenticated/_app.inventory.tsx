import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Boxes, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currency, demoProducts } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/inventory")({
  head: () => ({ meta: [{ title: "Inventory — BizPilot AI" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const total = demoProducts.length;
  const lowCount = demoProducts.filter(p => p.stock <= p.min).length;
  const value = demoProducts.reduce((s, p) => s + p.stock * p.cost, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" subtitle="Stock levels, alerts & adjustments" />
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Total SKUs", value: total, icon: Boxes, tone: "from-violet-500 to-indigo-500" },
          { label: "Low Stock", value: lowCount, icon: AlertTriangle, tone: "from-amber-500 to-orange-500" },
          { label: "Inventory Value", value: currency(value), icon: TrendingDown, tone: "from-emerald-500 to-green-500" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.label}</span>
              <span className={`grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br ${c.tone} text-white`}><c.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-2 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Stock Levels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="text-left">
                <th className="px-2 py-2">Product</th><th className="px-2 py-2">SKU</th>
                <th className="px-2 py-2">Stock</th><th className="px-2 py-2">Min</th>
                <th className="px-2 py-2">Status</th><th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {demoProducts.map((p) => {
                const low = p.stock <= p.min;
                return (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="px-2 py-3 font-medium">{p.name}</td>
                    <td className="px-2 py-3 text-muted-foreground">{p.sku}</td>
                    <td className="px-2 py-3">{p.stock} {p.unit}</td>
                    <td className="px-2 py-3 text-muted-foreground">{p.min} {p.unit}</td>
                    <td className="px-2 py-3">
                      <Badge className={low ? "bg-amber-500/10 text-amber-600 border-transparent" : "bg-emerald-500/10 text-emerald-600 border-transparent"}>
                        {low ? "Low Stock" : "In Stock"}
                      </Badge>
                    </td>
                    <td className="px-2 py-3 text-right"><Button variant="outline" size="sm">Adjust</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
