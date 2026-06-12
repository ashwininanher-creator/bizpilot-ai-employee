import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, TrendingDown } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { currency, db, fmtDate, getUserId, type Product } from "@/lib/data";

type Movement = {
  id: string;
  product_id: string;
  change: number;
  reason: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/_app/inventory")({
  head: () => ({ meta: [{ title: "Inventory — BizPilot AI" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Product | null>(null);
  const [change, setChange] = useState("");
  const [reason, setReason] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("products").select("*").eq("user_id", uid).order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: movements = [] } = useQuery<Movement[]>({
    queryKey: ["inventory_movements"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db
        .from("inventory_movements")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const productById = Object.fromEntries(products.map(p => [p.id, p]));

  const adjust = useMutation({
    mutationFn: async () => {
      if (!target) return;
      const delta = Number(change);
      if (!delta) throw new Error("Enter a non-zero amount");
      const uid = await getUserId();
      const newStock = Number(target.stock) + delta;
      const { error } = await db.from("products").update({ stock: newStock }).eq("id", target.id);
      if (error) throw error;
      await db.from("inventory_movements").insert({
        user_id: uid, product_id: target.id, change: delta,
        reason: (reason || "Manual adjustment"),
      });
    },
    onSuccess: () => {
      toast.success("Stock adjusted");
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["inventory_movements"] });
      setOpen(false); setChange(""); setReason(""); setTarget(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const total = products.length;
  const lowCount = products.filter(p => Number(p.stock) <= Number(p.min_stock)).length;
  const value = products.reduce((s, p) => s + Number(p.stock) * Number(p.cost), 0);

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
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
        ) : products.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">No products yet. Add products to manage stock.</div>
        ) : (
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
                {products.map((p) => {
                  const low = Number(p.stock) <= Number(p.min_stock);
                  return (
                    <tr key={p.id} className="border-t border-border/60">
                      <td className="px-2 py-3 font-medium">{p.name}</td>
                      <td className="px-2 py-3 text-muted-foreground">{p.sku || "—"}</td>
                      <td className="px-2 py-3">{p.stock} {p.unit}</td>
                      <td className="px-2 py-3 text-muted-foreground">{p.min_stock} {p.unit}</td>
                      <td className="px-2 py-3">
                        <Badge className={low ? "bg-amber-500/10 text-amber-600 border-transparent" : "bg-emerald-500/10 text-emerald-600 border-transparent"}>
                          {low ? "Low Stock" : "In Stock"}
                        </Badge>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => { setTarget(p); setOpen(true); }}>Adjust</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adjust Stock — {target?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Current: {target?.stock} {target?.unit}</div>
            <div><Label>Change (+ to add, - to remove)</Label><Input type="number" value={change} onChange={e => setChange(e.target.value)} /></div>
            <div><Label>Reason</Label><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Restock, wastage" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => adjust.mutate()} disabled={adjust.isPending} className="bg-gradient-primary text-primary-foreground">
              {adjust.isPending ? "Saving…" : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
