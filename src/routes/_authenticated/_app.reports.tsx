import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText, FileType } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { currency, demoStats, revenueTrend } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — BizPilot AI" }] }),
  component: ReportsPage,
});

const REPORTS = [
  { title: "Daily Sales Report", desc: "Today's transactions" },
  { title: "Weekly Sales Report", desc: "Last 7 days" },
  { title: "Monthly Revenue", desc: "May 2025" },
  { title: "Customer Report", desc: "Top buyers & dues" },
  { title: "Inventory Report", desc: "Stock + valuation" },
  { title: "GST Report", desc: "Tax summary" },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Daily, weekly, monthly & GST insights"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileText className="h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
            <Button variant="outline" size="sm"><FileType className="h-4 w-4" /> CSV</Button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Monthly Revenue", value: currency(demoStats.monthlyRevenue) },
          { label: "Monthly Expenses", value: currency(demoStats.monthlyExpenses) },
          { label: "Net Profit", value: currency(demoStats.monthlyProfit) },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.label}</div>
            <div className="mt-1 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Revenue & Profit Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="hsl(262, 83%, 58%)" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="profit" stroke="hsl(150, 70%, 45%)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORTS.map((r) => (
          <div key={r.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            </div>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
