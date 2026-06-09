import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  TrendingUp, ShoppingCart, Clock, Wallet, Users, Plus, FileText,
  UserPlus, Package, Receipt, Sparkles, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  currency, demoStats, revenueTrend, salesByCategory,
  recentInvoices, inventoryAlerts, recentActivity,
} from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — BizPilot AI" }] }),
  component: Dashboard,
});

const STATS = [
  { label: "Today's Revenue", value: currency(demoStats.todaysRevenue), delta: "+12.5% vs yesterday", icon: TrendingUp, color: "from-violet-500 to-indigo-500" },
  { label: "Today's Sales", value: currency(demoStats.todaysSales), delta: `${demoStats.todaysSalesCount} invoices`, icon: ShoppingCart, color: "from-sky-500 to-blue-500" },
  { label: "Pending Payments", value: currency(demoStats.pendingPayments), delta: `${demoStats.pendingInvoices} pending`, icon: Clock, color: "from-amber-500 to-orange-500" },
  { label: "Profit (Today)", value: currency(demoStats.profitToday), delta: `+${demoStats.profitDeltaPct}% vs yesterday`, icon: Wallet, color: "from-emerald-500 to-green-500" },
  { label: "Total Customers", value: demoStats.totalCustomers.toLocaleString("en-IN"), delta: `+${demoStats.newCustomersThisMonth} this month`, icon: Users, color: "from-pink-500 to-rose-500" },
];

const QUICK_ACTIONS = [
  { label: "Create Sale", icon: ShoppingCart, to: "/sales", tone: "bg-violet-500/10 text-violet-600" },
  { label: "Create Invoice", icon: FileText, to: "/billing", tone: "bg-sky-500/10 text-sky-600" },
  { label: "Add Customer", icon: UserPlus, to: "/customers", tone: "bg-pink-500/10 text-pink-600" },
  { label: "Add Product", icon: Package, to: "/products", tone: "bg-emerald-500/10 text-emerald-600" },
  { label: "Add Expense", icon: Receipt, to: "/expenses", tone: "bg-amber-500/10 text-amber-600" },
  { label: "AI Report", icon: Sparkles, to: "/ai-assistant", tone: "bg-fuchsia-500/10 text-fuchsia-600" },
];

const PIE_COLORS = ["hsl(262, 83%, 58%)", "hsl(199, 89%, 56%)", "hsl(150, 70%, 45%)", "hsl(38, 92%, 55%)", "hsl(340, 82%, 60%)"];

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="A live snapshot of your business"
        actions={
          <Button asChild className="bg-gradient-primary text-primary-foreground">
            <Link to="/sales"><Plus className="h-4 w-4" /> New Sale</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border/60 bg-card p-4 shadow-card"
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
              <span className={`grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br ${s.color} text-white shrink-0`}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{s.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="secondary" className="text-xs">This week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(150, 70%, 45%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(150, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(262, 83%, 58%)" fill="url(#rev)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" stroke="hsl(150, 70%, 45%)" fill="url(#prof)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-1">Sales by Category</h3>
          <p className="text-xs text-muted-foreground mb-3">Top earning categories</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={salesByCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {salesByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Recent Invoices</h3>
            <Link to="/billing" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr className="text-left">
                  <th className="px-2 py-2 font-medium">Invoice</th>
                  <th className="px-2 py-2 font-medium">Customer</th>
                  <th className="px-2 py-2 font-medium">Amount</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((i) => (
                  <tr key={i.no} className="border-t border-border/60">
                    <td className="px-2 py-3 font-medium">{i.no}</td>
                    <td className="px-2 py-3">{i.customer}</td>
                    <td className="px-2 py-3">{currency(i.amount)}</td>
                    <td className="px-2 py-3">
                      <Badge variant={i.status === "Paid" ? "secondary" : "outline"} className={i.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-transparent" : "bg-amber-500/10 text-amber-600 border-transparent"}>
                        {i.status}
                      </Badge>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{i.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Inventory Alerts</h3>
            <Link to="/inventory" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <ul className="space-y-2">
            {inventoryAlerts.map((a) => (
              <li key={a.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/40">
                <span className="grid place-items-center h-9 w-9 rounded-lg bg-amber-500/15 text-amber-600 shrink-0">
                  <Package className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{a.note}</div>
                </div>
                <Badge className="bg-amber-500/15 text-amber-600 border-transparent">{a.level}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.label} to={a.to}
                className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-secondary/40 transition">
                <span className={`grid place-items-center h-10 w-10 rounded-lg ${a.tone}`}>
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivity.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{r.note}</div>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{r.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
