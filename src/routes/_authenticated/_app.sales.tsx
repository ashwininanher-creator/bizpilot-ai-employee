import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { currency, db, fmtDate, getUserId, type Customer, type Product, type Sale } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/_app/sales")({
  head: () => ({ meta: [{ title: "Sales — BizPilot AI" }] }),
  component: SalesPage,
});

type Line = { product_id: string; product_name: string; quantity: number; unit_price: number };

function SalesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Paid" | "Pending">("All");
  const [open, setOpen] = useState(false);

  const [customerId, setCustomerId] = useState<string>("walkin");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState<"Paid" | "Pending">("Paid");
  const [lines, setLines] = useState<Line[]>([]);

  const { data: sales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("sales").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("customers").select("*").eq("user_id", uid).order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("products").select("*").eq("user_id", uid).order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + tax;

  const reset = () => { setCustomerId("walkin"); setPaymentMethod("Cash"); setStatus("Paid"); setLines([]); };

  const addLine = () => {
    if (products.length === 0) { toast.error("Add a product first"); return; }
    const p = products[0];
    setLines([...lines, { product_id: p.id, product_name: p.name, quantity: 1, unit_price: Number(p.price) }]);
  };

  const updateLine = (i: number, patch: Partial<Line>) => {
    setLines(lines.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  };

  const create = useMutation({
    mutationFn: async () => {
      if (lines.length === 0) throw new Error("Add at least one item");
      const uid = await getUserId();
      const customer = customers.find(c => c.id === customerId);
      const invoice_no = "INV-" + Date.now().toString().slice(-6);
      const { data: sale, error } = await db.from("sales").insert({
        user_id: uid,
        invoice_no,
        customer_id: customer?.id || null,
        customer_name: customer?.name || "Walk-in",
        subtotal, tax, total,
        paid: status === "Paid" ? total : 0,
        payment_method: paymentMethod,
        status,
      }).select().single();
      if (error) throw error;
      const items = lines.map(l => ({
        user_id: uid, sale_id: sale.id,
        product_id: l.product_id, product_name: l.product_name,
        quantity: l.quantity, unit_price: l.unit_price,
        line_total: l.quantity * l.unit_price,
      }));
      const { error: iErr } = await db.from("sale_items").insert(items);
      if (iErr) throw iErr;
      // Decrement stock
      for (const l of lines) {
        const p = products.find(pp => pp.id === l.product_id);
        if (p) {
          await db.from("products").update({ stock: Number(p.stock) - l.quantity }).eq("id", p.id);
        }
      }
    },
    onSuccess: () => {
      toast.success("Sale created");
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false); reset();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("sales").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Sale deleted"); qc.invalidateQueries({ queryKey: ["sales"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = sales.filter(s => {
    if (filter !== "All" && s.status !== filter) return false;
    if (search && !s.invoice_no.toLowerCase().includes(search.toLowerCase()) && !(s.customer_name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" subtitle="Every sale, every payment, in one place"
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> New Sale</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>New Sale</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label>Customer</Label>
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Payment</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Items</div>
                    <Button size="sm" variant="outline" onClick={addLine}><Plus className="h-3 w-3" /> Add item</Button>
                  </div>
                  {lines.length === 0 && <div className="text-xs text-muted-foreground py-4 text-center">No items yet</div>}
                  {lines.map((l, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <Select value={l.product_id} onValueChange={(v) => {
                        const p = products.find(pp => pp.id === v);
                        if (p) updateLine(i, { product_id: p.id, product_name: p.name, unit_price: Number(p.price) });
                      }}>
                        <SelectTrigger className="col-span-5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" className="col-span-2" value={l.quantity} onChange={e => updateLine(i, { quantity: Number(e.target.value) || 0 })} />
                      <Input type="number" className="col-span-3" value={l.unit_price} onChange={e => updateLine(i, { unit_price: Number(e.target.value) || 0 })} />
                      <div className="col-span-1 text-xs text-right">{currency(l.quantity * l.unit_price)}</div>
                      <Button size="icon" variant="ghost" className="col-span-1" onClick={() => setLines(lines.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end text-sm space-y-1 flex-col items-end">
                  <div className="flex gap-6"><span className="text-muted-foreground">Subtotal</span><span>{currency(subtotal)}</span></div>
                  <div className="flex gap-6"><span className="text-muted-foreground">GST (18%)</span><span>{currency(tax)}</span></div>
                  <div className="flex gap-6 font-semibold text-base"><span>Total</span><span>{currency(total)}</span></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => create.mutate()} disabled={create.isPending} className="bg-gradient-primary text-primary-foreground">
                  {create.isPending ? "Saving…" : "Create Sale"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search invoice or customer…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {(["All", "Paid", "Pending"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">No sales yet. Click <span className="font-medium">New Sale</span>.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr className="text-left">
                  <th className="px-2 py-2">Invoice</th><th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Amount</th><th className="px-2 py-2">Payment</th>
                  <th className="px-2 py-2">Status</th><th className="px-2 py-2">Date</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-border/60">
                    <td className="px-2 py-3 font-medium">{s.invoice_no}</td>
                    <td className="px-2 py-3">{s.customer_name || "—"}</td>
                    <td className="px-2 py-3">{currency(s.total)}</td>
                    <td className="px-2 py-3 text-muted-foreground">{s.payment_method}</td>
                    <td className="px-2 py-3">
                      <Badge className={s.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-600 border-transparent"
                        : "bg-amber-500/10 text-amber-600 border-transparent"}>{s.status}</Badge>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{fmtDate(s.sale_date)}</td>
                    <td className="px-2 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete sale?")) del.mutate(s.id); }}><Trash2 className="h-3 w-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
