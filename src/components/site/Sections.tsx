import {
  Cake, Scissors, UtensilsCrossed, Stethoscope, Pill, Dumbbell, ShoppingBasket, CakeSlice,
  UserPlus, Bot, LayoutDashboard, Rocket,
  Wand2, Receipt, Boxes, Users, Wallet, FileBarChart, Sparkles, Brain, LineChart, CreditCard, FileText, Smartphone,
  ShieldCheck, KeyRound, Lock, UserCog, Building2, DatabaseBackup,
  ChevronDown, Star, ArrowRight, Check, X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/* ---------------- Section helpers ---------------- */

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {eyebrow && (
        <div className="text-xs font-semibold tracking-widest uppercase text-primary">{eyebrow}</div>
      )}
      <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground text-lg">{subtitle}</p>}
    </div>
  );
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/* ---------------- Social Proof ---------------- */

export function SocialProof() {
  const stats = [
    { v: "12,400+", l: "Business owners" },
    { v: "8,900+", l: "Businesses onboarded" },
    { v: "1.2M+", l: "Invoices generated" },
    { v: "₹420Cr+", l: "Revenue processed" },
  ];
  return (
    <section className="py-20 border-y border-border bg-surface">
      <Container>
        <SectionHeading eyebrow="Social proof" title="Trusted by business owners" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-gradient">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- How it works ---------------- */

export function HowItWorks() {
  const steps = [
    { icon: UserPlus, t: "Create account", d: "Sign up using email or Google. Takes seconds." },
    { icon: Bot, t: "Tell AI about your business", d: "Share business name, type, and products." },
    { icon: LayoutDashboard, t: "AI builds your workspace", d: "Billing, inventory, customers and reports — ready." },
    { icon: Rocket, t: "Run your business", d: "Track everything from one beautiful dashboard." },
  ];
  return (
    <section id="how" className="py-24">
      <Container>
        <SectionHeading eyebrow="How it works" title="Get started in minutes" subtitle="A guided onboarding that does the heavy lifting for you." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative rounded-2xl border border-border bg-card p-6 hover:shadow-card transition-shadow"
            >
              <div className="text-xs font-mono text-muted-foreground">Step {i + 1}</div>
              <div className="mt-3 grid place-items-center h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Industries ---------------- */

export function Industries() {
  const items = [
    { icon: Cake, name: "Bakery", problem: "Lost orders & messy billing", solve: "Auto-billing, custom cake orders, daily reports" },
    { icon: CakeSlice, name: "Cake Shop", problem: "Custom orders forgotten", solve: "Order tracker with delivery reminders" },
    { icon: Scissors, name: "Salon", problem: "Missed appointments", solve: "Smart bookings & customer history" },
    { icon: UtensilsCrossed, name: "Restaurant", problem: "Inventory wastage", solve: "Real-time stock & menu insights" },
    { icon: Stethoscope, name: "Clinic", problem: "Patient records scattered", solve: "Patient CRM & invoice automation" },
    { icon: Pill, name: "Medical Store", problem: "Expiry & stockouts", solve: "Expiry alerts & supplier reorder" },
    { icon: Dumbbell, name: "Gym", problem: "Membership renewals missed", solve: "Auto-reminders & payment links" },
    { icon: ShoppingBasket, name: "Grocery Store", problem: "Pending khata payments", solve: "Khata tracker with WhatsApp nudges" },
  ];
  return (
    <section id="industries" className="py-24 bg-surface border-y border-border">
      <Container>
        <SectionHeading eyebrow="Industries" title="Built for every small business" subtitle="One platform, tuned to how your industry actually works." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="group rounded-2xl border border-border bg-card p-5 hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40 transition-all"
            >
              <div className="grid place-items-center h-10 w-10 rounded-lg bg-accent text-accent-foreground group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{it.name}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-muted-foreground"><span className="text-foreground/80 font-medium">Problem:</span> {it.problem}</p>
                <p className="text-muted-foreground"><span className="text-foreground/80 font-medium">Solved:</span> {it.solve}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Features ---------------- */

export function Features() {
  const features = [
    { i: Wand2, t: "AI Business Setup", d: "Conversational onboarding tailored to your shop." },
    { i: Receipt, t: "Smart Billing", d: "Create GST-ready invoices in one tap." },
    { i: Boxes, t: "Inventory Tracking", d: "Live stock, low-stock alerts, auto reorder." },
    { i: Users, t: "Customer Management", d: "Profiles, history, segments — all in one place." },
    { i: Wallet, t: "Pending Payments", d: "Track khata, auto-remind on WhatsApp/SMS." },
    { i: FileBarChart, t: "Expense Tracking", d: "Capture bills, categorize, see your margin." },
    { i: LineChart, t: "AI Reports", d: "Daily, weekly and monthly summaries." },
    { i: Sparkles, t: "AI Assistant", d: "Ask anything about your business in plain words." },
    { i: Brain, t: "Business Insights", d: "Trends, anomalies, and what to do next." },
    { i: CreditCard, t: "Razorpay Payments", d: "Accept UPI, cards, wallets out of the box." },
    { i: FileText, t: "GST Invoices", d: "Compliant invoices, exports for your CA." },
    { i: Smartphone, t: "Multi-device Access", d: "Phone, tablet, laptop — perfectly in sync." },
  ];
  return (
    <section id="features" className="py-24">
      <Container>
        <SectionHeading eyebrow="Features" title="Everything your business needs" subtitle="An honest, opinionated toolkit — no setup, no complexity." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
              className="group rounded-2xl border border-border bg-card p-6 hover:shadow-card hover:border-primary/40 transition-all"
            >
              <div className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
                <f.i className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- AI Employee ---------------- */

export function AIEmployee() {
  const roles = [
    { i: Receipt, t: "Sales Assistant", d: "Handles billing, follow-ups and reminders." },
    { i: Boxes, t: "Inventory Manager", d: "Knows your stock at every moment." },
    { i: Wallet, t: "Finance Assistant", d: "Tracks expenses, dues and cash flow." },
    { i: Users, t: "Customer Manager", d: "Remembers every customer, every preference." },
    { i: LineChart, t: "Business Analyst", d: "Surfaces what's working and what isn't." },
    { i: Sparkles, t: "Marketing Assistant", d: "Suggests offers and re-engagement nudges." },
  ];
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <Container>
        <SectionHeading eyebrow="AI Employee" title="Meet your AI employee" subtitle="BizPilot AI works like a full-time team member — never sleeps, never forgets." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r, i) => (
            <motion.div
              key={r.t}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="relative rounded-2xl border border-border bg-surface-elevated p-6 hover:shadow-elegant transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="grid place-items-center h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow shrink-0">
                  <r.i className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{r.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Benefits comparison ---------------- */

export function Benefits() {
  const rows = [
    { k: "Time to record a sale", a: "3–4 minutes", b: "10 seconds" },
    { k: "Pending payments tracking", a: "Notebook & memory", b: "Auto, with reminders" },
    { k: "Inventory check", a: "Manual count", b: "Live, with alerts" },
    { k: "Monthly report", a: "Hours in Excel", b: "One-tap, AI-written" },
    { k: "Customer history", a: "You remember it", b: "Always remembered" },
    { k: "Business insights", a: "Gut feeling", b: "AI-powered recommendations" },
  ];
  return (
    <section className="py-24 bg-surface border-y border-border">
      <Container>
        <SectionHeading eyebrow="Benefits" title="Why business owners love BizPilot AI" />
        <div className="mt-12 grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-semibold text-muted-foreground">Traditional method</div>
            <ul className="mt-4 space-y-3">
              {rows.map((r) => (
                <li key={r.k} className="flex items-start gap-3">
                  <X className="h-4 w-4 text-rose-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{r.k}</div>
                    <div className="text-sm text-muted-foreground">{r.a}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-card p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
            <div className="text-sm font-semibold text-gradient">With BizPilot AI</div>
            <ul className="mt-4 space-y-3">
              {rows.map((r) => (
                <li key={r.k} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-success mt-1 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{r.k}</div>
                    <div className="text-sm text-muted-foreground">{r.b}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

export function Testimonials() {
  const items = [
    { n: "Priya Sharma", b: "Sharma Bakery", r: "BizPilot feels like an employee that never sleeps. Khata payments are finally under control." },
    { n: "Rahul Verma", b: "Glow Salon", r: "Bookings, reminders, billing — all in one place. My customers actually notice the difference." },
    { n: "Anita Joshi", b: "Spice Route Restaurant", r: "I check my dashboard with morning chai. AI tells me what to restock and what's selling." },
    { n: "Imran Khan", b: "City Medical Store", r: "Expiry alerts alone paid for the year. Setup was honestly under two minutes." },
  ];
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Loved by business owners" />
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-card transition-shadow"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-foreground/90 leading-relaxed">"{t.r}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground font-semibold">
                  {t.n.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.b}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  const plans = [
    { n: "Free", p: 0, py: 0, d: "Try the basics", f: ["Up to 50 invoices/mo", "1 user", "Basic inventory", "Email support"] },
    { n: "Starter", p: 499, py: 4990, d: "For new shops", f: ["Unlimited invoices", "2 users", "Customer & inventory CRM", "WhatsApp reminders"] },
    { n: "Pro", p: 999, py: 9990, d: "Most popular", f: ["Everything in Starter", "5 users", "AI insights & assistant", "GST exports", "Priority support"], featured: true },
    { n: "Business", p: 1999, py: 19990, d: "Scale up", f: ["Everything in Pro", "Unlimited users", "Multi-outlet", "Role-based access", "Dedicated manager"] },
  ];
  return (
    <section id="pricing" className="py-24 bg-surface border-y border-border">
      <Container>
        <SectionHeading eyebrow="Pricing" title="Simple pricing" subtitle="Start free. Upgrade when you grow. Cancel anytime." />

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setYearly((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${yearly ? "bg-gradient-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${yearly ? "left-[22px]" : "left-0.5"}`} />
          </button>
          <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly <span className="text-xs text-success">save 17%</span>
          </span>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => (
            <div
              key={p.n}
              className={`relative rounded-2xl border p-6 bg-card transition-all ${
                p.featured ? "border-primary/50 shadow-elegant lg:-translate-y-2" : "border-border hover:shadow-card"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold bg-gradient-primary text-primary-foreground shadow-glow">
                  Recommended
                </div>
              )}
              <div className="text-sm font-semibold">{p.n}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.d}</div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  ₹{yearly ? Math.round(p.py / 12) : p.p}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <div className="text-xs text-muted-foreground">{yearly ? `Billed ₹${p.py}/yr` : "Billed monthly"}</div>
              <Button
                className={`mt-5 w-full ${p.featured ? "bg-gradient-primary text-primary-foreground" : ""}`}
                variant={p.featured ? "default" : "outline"}
              >
                {p.p === 0 ? "Get started" : "Choose plan"}
              </Button>
              <ul className="mt-6 space-y-2.5">
                {p.f.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>Accepted payments:</span>
          {["Google Pay", "PhonePe", "UPI", "Razorpay"].map((m) => (
            <span key={m} className="px-2.5 py-1 rounded-md border border-border bg-card">{m}</span>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Security ---------------- */

export function Security() {
  const items = [
    { i: ShieldCheck, t: "Supabase Security", d: "Row-level security on every table." },
    { i: KeyRound, t: "Google Authentication", d: "Secure sign-in with Google or email." },
    { i: Lock, t: "Encrypted Data", d: "TLS in transit, encryption at rest." },
    { i: UserCog, t: "Role-based Access", d: "Owners, managers and staff — controlled." },
    { i: Building2, t: "Business Isolation", d: "Your data is yours. Period." },
    { i: DatabaseBackup, t: "Daily Backups", d: "Automated snapshots, easy restore." },
  ];
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Security"
          title="Your business data is secure"
          subtitle="Each business can only access its own data. No customer can access another business's information."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.t} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
              <div className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                <it.i className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{it.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function FAQ() {
  const qs = [
    { q: "What is BizPilot AI?", a: "It's an AI employee for your small business — handling billing, inventory, payments, customers and reports automatically." },
    { q: "How does AI setup work?", a: "Tell us your business type and products in plain words. AI configures invoices, categories and your dashboard for you." },
    { q: "Do I need technical knowledge?", a: "No. If you can use WhatsApp, you can run BizPilot AI." },
    { q: "Can I use Google Login?", a: "Yes. Sign in with Google or email — your choice." },
    { q: "How secure is my data?", a: "Every business is isolated with row-level security. Data is encrypted in transit and at rest, with daily backups." },
    { q: "Can I upgrade later?", a: "Anytime. Start free and move to a paid plan when you're ready. No lock-in." },
    { q: "Can I download reports?", a: "Yes. Export PDF and Excel reports for sales, inventory, expenses and GST." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 bg-surface border-y border-border">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {qs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

export function FinalCTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 sm:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-white/30 blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-primary-foreground">
              Ready to hire your first AI employee?
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-lg max-w-2xl mx-auto">
              Join thousands of business owners using AI to save time and grow faster.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="h-12 px-6 bg-white text-primary hover:bg-white/90">
                Start Free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground bg-transparent">
                Book Demo
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Footer ---------------- */

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="font-display font-semibold tracking-tight">BizPilot <span className="text-gradient">AI</span></span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Your first AI employee — automating daily operations for small businesses.
            </p>
          </div>
          <FooterCol title="Product" links={["Features", "Pricing", "FAQ"]} />
          <FooterCol title="Company" links={["Contact", "Support", "Privacy Policy", "Terms"]} />
          <FooterCol title="Social" links={["Twitter", "LinkedIn", "Instagram", "YouTube"]} />
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row gap-2 justify-between items-center text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} BizPilot AI. All rights reserved.</div>
          <div>Made for small businesses, with care.</div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
