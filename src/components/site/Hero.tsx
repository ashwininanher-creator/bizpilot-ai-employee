import { motion } from "motion/react";
import { ArrowRight, Play, Check, TrendingUp, Package, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute top-0 left-1/2 -z-10 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-primary opacity-20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span>🚀</span>
            Trusted by growing small businesses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight"
          >
            Hire your first{" "}
            <span className="text-gradient">AI employee</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Track sales, manage inventory, remember payments, create invoices, and grow
            your business automatically with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-elegant h-12 px-6 text-base">
              Start Free <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base">
              <Play className="mr-2 h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["No technical skills required", "Setup in 2 minutes", "AI powered"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative"
    >
      <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
      <div className="relative rounded-2xl border border-border bg-surface-elevated shadow-elegant overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <div className="ml-3 text-xs text-muted-foreground">dashboard.bizpilot.ai</div>
        </div>

        <div className="p-5 grid grid-cols-2 gap-3">
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Today's Revenue" value="₹24,830" delta="+12.4%" tone="success" />
          <StatCard icon={<Bell className="h-4 w-4" />} label="Pending Payments" value="₹8,200" delta="3 invoices" tone="warning" />
          <StatCard icon={<Package className="h-4 w-4" />} label="Inventory Alerts" value="5 low" delta="Restock soon" tone="alert" />
          <StatCard icon={<Sparkles className="h-4 w-4" />} label="AI Insights" value="3 new" delta="Boost margin 8%" tone="primary" />

          <div className="col-span-2 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Revenue · 7 days</span>
              <span className="text-xs font-semibold text-success">+18%</span>
            </div>
            <Sparkline />
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="hidden sm:flex absolute -left-6 top-1/3 items-center gap-3 rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-card"
      >
        <span className="grid place-items-center h-8 w-8 rounded-lg bg-success/15 text-success">
          <Check className="h-4 w-4" />
        </span>
        <div>
          <div className="text-xs font-semibold">Invoice paid</div>
          <div className="text-[11px] text-muted-foreground">Sharma Bakery · ₹4,200</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="hidden sm:flex absolute -right-4 bottom-10 items-center gap-3 rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-card"
      >
        <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <div className="text-xs font-semibold">AI tip</div>
          <div className="text-[11px] text-muted-foreground">Reorder vanilla extract</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon, label, value, delta, tone,
}: { icon: React.ReactNode; label: string; value: string; delta: string; tone: "success" | "warning" | "alert" | "primary" }) {
  const toneClasses = {
    success: "text-success bg-success/10",
    warning: "text-amber-600 bg-amber-500/10",
    alert: "text-rose-600 bg-rose-500/10",
    primary: "text-primary bg-primary/10",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-2">
        <span className={`grid place-items-center h-7 w-7 rounded-md ${toneClasses}`}>{icon}</span>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
      <div className="text-[11px] text-muted-foreground">{delta}</div>
    </div>
  );
}

function Sparkline() {
  const pts = [12, 18, 14, 22, 26, 21, 32, 30, 38, 34, 42, 48];
  const max = Math.max(...pts);
  const w = 280, h = 60;
  const step = w / (pts.length - 1);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`).join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g1)" />
      <path d={d} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
