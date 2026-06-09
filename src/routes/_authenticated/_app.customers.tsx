import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currency, demoCustomers } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/_app/customers")({
  head: () => ({ meta: [{ title: "Customers — BizPilot AI" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Profiles, purchase history & pending dues"
        actions={<Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Add Customer</Button>}
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="relative mb-4 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customer…" className="pl-9 h-9" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoCustomers.map((c) => (
            <div key={c.id} className="rounded-xl border border-border/60 p-4 hover:border-primary/40">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{c.name.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</div>
                </div>
                {c.dues > 0 && <Badge className="bg-amber-500/10 text-amber-600 border-transparent">Dues</Badge>}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div><div className="text-sm font-semibold">{c.orders}</div><div className="text-[10px] text-muted-foreground">Orders</div></div>
                <div><div className="text-sm font-semibold">{currency(c.ltv)}</div><div className="text-[10px] text-muted-foreground">LTV</div></div>
                <div><div className={`text-sm font-semibold ${c.dues > 0 ? "text-amber-600" : ""}`}>{currency(c.dues)}</div><div className="text-[10px] text-muted-foreground">Pending</div></div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1"><Mail className="h-3 w-3" /> Remind</Button>
                <Button variant="outline" size="sm" className="flex-1">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
