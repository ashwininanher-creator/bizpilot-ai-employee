import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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
import { currency, db, fmtDate, getUserId, type Expense } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/_app/expenses")({
  head: () => ({ meta: [{ title: "Expenses — BizPilot AI" }] }),
  component: ExpensesPage,
});

const CATEGORIES = ["Raw Materials", "Salary", "Rent", "Electricity", "Marketing", "Transport", "Misc"];

function ExpensesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("expenses").select("*").eq("user_id", uid).order("expense_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!amount || Number(amount) <= 0) throw new Error("Enter an amount");
      const uid = await getUserId();
      const { error } = await db.from("expenses").insert({
        user_id: uid, category, amount: Number(amount), note: note || null, expense_date: date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Expense added");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      setOpen(false); setAmount(""); setNote("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["expenses"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const byCat = Object.values(expenses.reduce<Record<string, { name: string; value: number }>>((acc, e) => {
    acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
    acc[e.category].value += Number(e.amount);
    return acc;
  }, {}));

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses" subtitle="Track every rupee leaving the business"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Amount (₹) *</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div>
                <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>Note</Label><Input value={note} onChange={e => setNote(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => create.mutate()} disabled={create.isPending} className="bg-gradient-primary text-primary-foreground">
                  {create.isPending ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</div>
          <div className="mt-1 text-3xl font-semibold">{currency(total)}</div>
          <div className="mt-1 text-xs text-muted-foreground">Across {expenses.length} entries</div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-2">By Category</h3>
          {byCat.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byCat}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="value" fill="hsl(262, 83%, 58%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Recent Expenses</h3>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
        ) : expenses.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">No expenses yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr className="text-left">
                  <th className="px-2 py-2">Date</th><th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Note</th><th className="px-2 py-2 text-right">Amount</th><th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-t border-border/60">
                    <td className="px-2 py-3 text-muted-foreground">{fmtDate(e.expense_date)}</td>
                    <td className="px-2 py-3"><Badge variant="secondary">{e.category}</Badge></td>
                    <td className="px-2 py-3">{e.note || "—"}</td>
                    <td className="px-2 py-3 text-right font-medium">{currency(e.amount)}</td>
                    <td className="px-2 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) del.mutate(e.id); }}><Trash2 className="h-3 w-3" /></Button>
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
