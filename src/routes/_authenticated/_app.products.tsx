import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Package } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { currency, demoProducts } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/products")({
  head: () => ({ meta: [{ title: "Products — BizPilot AI" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Catalog, pricing, SKU & barcode"
        actions={<Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Add Product</Button>}
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search product or SKU…" className="pl-9 h-9" />
          </div>
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Cakes</Button>
          <Button variant="outline" size="sm">Pastries</Button>
          <Button variant="outline" size="sm">Low Stock</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoProducts.map((p) => {
            const low = p.stock <= p.min;
            return (
              <div key={p.id} className="rounded-xl border border-border/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0"><Package className="h-4 w-4" /></span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.category} · SKU {p.sku}</div>
                  </div>
                  {low && <Badge className="bg-amber-500/10 text-amber-600 border-transparent">Low</Badge>}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-sm font-semibold">{currency(p.price)}</div><div className="text-[10px] text-muted-foreground">Selling</div></div>
                  <div><div className="text-sm font-semibold">{currency(p.cost)}</div><div className="text-[10px] text-muted-foreground">Cost</div></div>
                  <div><div className={`text-sm font-semibold ${low ? "text-amber-600" : ""}`}>{p.stock} {p.unit}</div><div className="text-[10px] text-muted-foreground">Stock</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
