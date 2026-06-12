import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Search, FileText, Users, Package, Wallet, BarChart3, Sparkles, LayoutDashboard, Settings, CreditCard, Receipt, Boxes } from "lucide-react";

import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { db, getUserId } from "@/lib/data";

const PAGES = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Sales", to: "/sales", icon: Receipt },
  { label: "Billing", to: "/billing", icon: FileText },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Products", to: "/products", icon: Package },
  { label: "Inventory", to: "/inventory", icon: Boxes },
  { label: "Expenses", to: "/expenses", icon: Wallet },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "AI Assistant", to: "/ai-assistant", icon: Sparkles },
  { label: "Subscriptions", to: "/subscriptions", icon: CreditCard },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const { data: results = { sales: [], customers: [], products: [] } } = useQuery({
    queryKey: ["global-search"],
    queryFn: async () => {
      const uid = await getUserId();
      const [s, c, p] = await Promise.all([
        db.from("sales").select("id,invoice_no,customer_name,total").eq("user_id", uid).order("created_at", { ascending: false }).limit(20),
        db.from("customers").select("id,name,phone").eq("user_id", uid).limit(20),
        db.from("products").select("id,name,sku,stock").eq("user_id", uid).limit(20),
      ]);
      return { sales: s.data || [], customers: c.data || [], products: p.data || [] };
    },
    enabled: open,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (to: string) => { onOpenChange(false); setQ(""); navigate({ to }); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search invoices, customers, products, pages…" value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {PAGES.map((p) => (
            <CommandItem key={p.to} value={`page ${p.label}`} onSelect={() => go(p.to)}>
              <p.icon className="h-4 w-4" /> {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {results.sales.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Invoices">
              {results.sales.map((s: any) => (
                <CommandItem key={s.id} value={`inv ${s.invoice_no} ${s.customer_name || ""}`} onSelect={() => go("/billing")}>
                  <FileText className="h-4 w-4" />
                  <span>{s.invoice_no}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{s.customer_name || "Walk-in"} · ₹{Number(s.total).toFixed(0)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        {results.customers.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Customers">
              {results.customers.map((c: any) => (
                <CommandItem key={c.id} value={`cust ${c.name} ${c.phone || ""}`} onSelect={() => go("/customers")}>
                  <Users className="h-4 w-4" />
                  <span>{c.name}</span>
                  {c.phone && <span className="ml-auto text-xs text-muted-foreground">{c.phone}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        {results.products.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Products">
              {results.products.map((p: any) => (
                <CommandItem key={p.id} value={`prod ${p.name} ${p.sku || ""}`} onSelect={() => go("/products")}>
                  <Package className="h-4 w-4" />
                  <span>{p.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Stock: {p.stock}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
