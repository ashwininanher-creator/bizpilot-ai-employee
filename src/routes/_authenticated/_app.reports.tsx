import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, FileSpreadsheet, FileText, FileType } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { currency, db, fmtDate, getUserId, type Expense, type Product, type Sale } from "@/lib/data";
import { downloadCSV, downloadExcel, downloadTablePDF } from "@/lib/exports";

export const Route = createFileRoute("/_authenticated/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — BizPilot AI" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data } = await db.from("sales").select("*").eq("user_id", uid).order("sale_date", { ascending: false });
      return data || [];
    },
  });
  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data } = await db.from("expenses").select("*").eq("user_id", uid).order("expense_date", { ascending: false });
      return data || [];
    },
  });
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data } = await db.from("products").select("*").eq("user_id", uid).order("name");
      return data || [];
    },
  });

  const revenue = sales.reduce((s, r) => s + Number(r.total || 0), 0);
  const expTotal = expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
  const profit = revenue - expTotal;

  // Group by day for trend (last 14)
  const trendMap = new Map<string, { revenue: number; profit: number }>();
  sales.forEach((s) => {
    const k = (s.sale_date || s.created_at).slice(0, 10);
    const prev = trendMap.get(k) || { revenue: 0, profit: 0 };
    prev.revenue += Number(s.total || 0);
    trendMap.set(k, prev);
  });
  expenses.forEach((e) => {
    const k = e.expense_date.slice(0, 10);
    const prev = trendMap.get(k) || { revenue: 0, profit: 0 };
    prev.profit -= Number(e.amount || 0);
    trendMap.set(k, prev);
  });
  const trend = Array.from(trendMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14)
    .map(([day, v]) => ({ day: day.slice(5), revenue: v.revenue, profit: v.revenue + v.profit }));

  const salesRows = sales.map(s => [s.invoice_no, s.customer_name || "—", s.payment_method || "—", s.status, fmtDate(s.sale_date), Number(s.total).toFixed(2)]);
  const salesHead = ["Invoice", "Customer", "Payment", "Status", "Date", "Amount (₹)"];

  const expensesHead = ["Date", "Category", "Note", "Amount (₹)"];
  const expensesRows = expenses.map(e => [fmtDate(e.expense_date), e.category, e.note || "—", Number(e.amount).toFixed(2)]);

  const inventoryHead = ["Product", "SKU", "Stock", "Min", "Price", "Value"];
  const inventoryRows = products.map(p => [p.name, p.sku || "—", Number(p.stock), Number(p.min_stock), Number(p.price).toFixed(2), (Number(p.stock) * Number(p.cost)).toFixed(2)]);

  // GST: assumes 18% on subtotal
  const gstHead = ["Invoice", "Date", "Subtotal", "GST", "Total"];
  const gstRows = sales.map(s => [s.invoice_no, fmtDate(s.sale_date), Number(s.subtotal).toFixed(2), Number(s.tax).toFixed(2), Number(s.total).toFixed(2)]);

  const REPORTS = [
    { title: "Sales Report", desc: `${sales.length} sales`, head: salesHead, rows: salesRows },
    { title: "Expenses Report", desc: `${expenses.length} entries`, head: expensesHead, rows: expensesRows },
    { title: "Inventory Report", desc: `${products.length} products`, head: inventoryHead, rows: inventoryRows },
    { title: "GST Report", desc: `Tax summary`, head: gstHead, rows: gstRows },
  ];

  const exportAll = (kind: "pdf" | "xlsx" | "csv") => {
    if (sales.length === 0) { toast.error("No sales to export yet"); return; }
    if (kind === "pdf") downloadTablePDF({ title: "Sales Report", head: salesHead, rows: salesRows });
    if (kind === "xlsx") downloadExcel({ title: "Sales Report", head: salesHead, rows: salesRows });
    if (kind === "csv") downloadCSV({ head: salesHead, rows: salesRows, filename: "sales_report" });
    toast.success(`Exported as ${kind.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Live revenue, expenses, inventory & GST"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportAll("pdf")}><FileText className="h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportAll("xlsx")}><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
            <Button variant="outline" size="sm" onClick={() => exportAll("csv")}><FileType className="h-4 w-4" /> CSV</Button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Total Revenue", value: currency(revenue) },
          { label: "Total Expenses", value: currency(expTotal) },
          { label: "Net Profit", value: currency(profit) },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.label}</div>
            <div className="mt-1 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Revenue & Profit Trend</h3>
        {trend.length === 0 ? (
          <div className="text-sm text-muted-foreground py-10 text-center">No data yet. Add sales to see trends.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${Math.round(v/1000)}k`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(262, 83%, 58%)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="profit" stroke="hsl(150, 70%, 45%)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {REPORTS.map((r) => (
          <div key={r.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={r.rows.length === 0}
                onClick={() => { downloadTablePDF({ title: r.title, head: r.head, rows: r.rows }); toast.success("PDF downloaded"); }}>
                <FileText className="h-3 w-3" /> PDF
              </Button>
              <Button variant="outline" size="sm" disabled={r.rows.length === 0}
                onClick={() => { downloadExcel({ title: r.title, head: r.head, rows: r.rows }); toast.success("Excel downloaded"); }}>
                <FileSpreadsheet className="h-3 w-3" /> Excel
              </Button>
              <Button variant="outline" size="sm" disabled={r.rows.length === 0}
                onClick={() => { downloadCSV({ head: r.head, rows: r.rows, filename: r.title.replace(/\s+/g, "_") }); toast.success("CSV downloaded"); }}>
                <Download className="h-3 w-3" /> CSV
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
