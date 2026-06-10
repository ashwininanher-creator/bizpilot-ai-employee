import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Package, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { currency, db, getUserId, type Product } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/_app/products")({
  head: () => ({ meta: [{ title: "Products — BizPilot AI" }] }),
  component: ProductsPage,
});

type Form = {
  name: string; category: string; sku: string; unit: string;
  price: string; cost: string; stock: string; min_stock: string;
};
const blank: Form = { name: "", category: "", sku: "", unit: "pcs", price: "", cost: "", stock: "", min_stock: "" };

function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Form>(blank);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("products").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const uid = await getUserId();
      const payload = {
        user_id: uid,
        name: form.name.trim(),
        category: form.category.trim() || null,
        sku: form.sku.trim() || null,
        unit: form.unit.trim() || "pcs",
        price: Number(form.price) || 0,
        cost: Number(form.cost) || 0,
        stock: Number(form.stock) || 0,
        min_stock: Number(form.min_stock) || 0,
      };
      if (!payload.name) throw new Error("Name is required");
      if (editing) {
        const { error } = await db.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await db.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Product updated" : "Product added");
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false); setEditing(null); setForm(blank);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category || "", sku: p.sku || "", unit: p.unit || "pcs",
      price: String(p.price), cost: String(p.cost), stock: String(p.stock), min_stock: String(p.min_stock),
    });
    setOpen(true);
  };

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Products" subtitle="Catalog, pricing, SKU & stock"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                <div><Label>SKU</Label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
                <div><Label>Selling Price (₹)</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Cost (₹)</Label><Input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
                <div><Label>Min Stock</Label><Input type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-gradient-primary text-primary-foreground">
                  {save.isPending ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="relative mb-4 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search product or SKU…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">
            No products yet. Click <span className="font-medium">Add Product</span> to create your first one.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((p) => {
              const low = Number(p.stock) <= Number(p.min_stock);
              return (
                <div key={p.id} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0"><Package className="h-4 w-4" /></span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.category || "—"} · SKU {p.sku || "—"}</div>
                    </div>
                    {low && <Badge className="bg-amber-500/10 text-amber-600 border-transparent">Low</Badge>}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div><div className="text-sm font-semibold">{currency(p.price)}</div><div className="text-[10px] text-muted-foreground">Selling</div></div>
                    <div><div className="text-sm font-semibold">{currency(p.cost)}</div><div className="text-[10px] text-muted-foreground">Cost</div></div>
                    <div><div className={`text-sm font-semibold ${low ? "text-amber-600" : ""}`}>{p.stock} {p.unit}</div><div className="text-[10px] text-muted-foreground">Stock</div></div>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /> Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => { if (confirm("Delete this product?")) del.mutate(p.id); }}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
