import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { currency, db, getUserId } from "@/lib/data";

export function NotificationsPopover() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const uid = await getUserId();
      const [products, pending] = await Promise.all([
        db.from("products").select("id,name,stock,min_stock").eq("user_id", uid),
        db.from("sales").select("id,invoice_no,customer_name,total,sale_date").eq("user_id", uid).neq("status", "Paid").order("sale_date", { ascending: false }).limit(10),
      ]);
      const low = (products.data || []).filter((p: any) => Number(p.stock) <= Number(p.min_stock));
      return { low, pending: pending.data || [] };
    },
    refetchInterval: 60_000,
  });

  const lowCount = data?.low.length || 0;
  const pendingCount = data?.pending.length || 0;
  const total = lowCount + pendingCount;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {total > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-rose-500 text-white border-transparent">
              {total}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <div className="font-display font-semibold text-sm">Notifications</div>
          <span className="text-[11px] text-muted-foreground">{total} new</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {total === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              You're all caught up!
            </div>
          )}
          {lowCount > 0 && (
            <div>
              <div className="px-4 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground bg-secondary/40">Low stock ({lowCount})</div>
              {data!.low.slice(0, 5).map((p: any) => (
                <Link key={p.id} to="/inventory" className="flex items-start gap-3 px-4 py-2.5 hover:bg-secondary/40 border-b border-border/40">
                  <span className="h-7 w-7 rounded-md bg-amber-500/10 text-amber-600 grid place-items-center mt-0.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">Only {p.stock} left (min {p.min_stock})</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {pendingCount > 0 && (
            <div>
              <div className="px-4 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground bg-secondary/40">Pending payments ({pendingCount})</div>
              {data!.pending.slice(0, 5).map((s: any) => (
                <Link key={s.id} to="/billing" className="flex items-start gap-3 px-4 py-2.5 hover:bg-secondary/40 border-b border-border/40">
                  <span className="h-7 w-7 rounded-md bg-rose-500/10 text-rose-600 grid place-items-center mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.invoice_no} · {s.customer_name || "Walk-in"}</div>
                    <div className="text-[11px] text-muted-foreground">{currency(s.total)} due</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
