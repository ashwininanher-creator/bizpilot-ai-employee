import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currency, demoExpenses, expenseByCategory } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/expenses")({
  head: () => ({ meta: [{ title: "Expenses — BizPilot AI" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const total = demoExpenses.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Track every rupee leaving the business"
        actions={<Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Add Expense</Button>}
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Total This Month</div>
          <div className="mt-1 text-3xl font-semibold">{currency(total)}</div>
          <div className="mt-1 text-xs text-muted-foreground">Across {demoExpenses.length} entries</div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-2">By Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={expenseByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="value" fill="hsl(262, 83%, 58%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="text-left">
                <th className="px-2 py-2">Date</th><th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Note</th><th className="px-2 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {demoExpenses.map((e) => (
                <tr key={e.id} className="border-t border-border/60">
                  <td className="px-2 py-3 text-muted-foreground">{e.date}</td>
                  <td className="px-2 py-3"><Badge variant="secondary">{e.category}</Badge></td>
                  <td className="px-2 py-3">{e.note}</td>
                  <td className="px-2 py-3 text-right font-medium">{currency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
