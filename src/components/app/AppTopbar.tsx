import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Sparkles, ChevronDown } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { GlobalSearch } from "@/components/app/GlobalSearch";
import { NotificationsPopover } from "@/components/app/NotificationsPopover";

export function AppTopbar() {
  const [businessName, setBusinessName] = useState("Your Business");
  const [initials, setInitials] = useState("YB");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: biz } = await supabase.from("businesses")
        .select("business_name").eq("owner_id", u.user.id).maybeSingle();
      if (biz?.business_name) {
        setBusinessName(biz.business_name);
        setInitials(biz.business_name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase());
      }
    })();
  }, []);

  return (
    <header className="h-16 border-b border-border/60 glass sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5">
      <SidebarTrigger className="shrink-0" />
      <div className="flex items-center gap-2 min-w-0">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block min-w-0">
          <div className="text-sm font-semibold truncate">{businessName}</div>
          <div className="text-[11px] text-muted-foreground">Owner</div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-2 hidden md:block">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full relative h-9 rounded-md bg-secondary/60 border border-transparent hover:border-border text-left text-sm text-muted-foreground pl-9 pr-12 transition"
        >
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" />
          Search invoices, customers, products…
          <kbd className="hidden lg:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[10px] border rounded px-1.5 py-0.5">⌘K</kbd>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="h-4 w-4" />
        </Button>
        <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-95 hidden sm:inline-flex">
          <Link to="/ai-assistant"><Sparkles className="h-4 w-4" /> AI Assistant</Link>
        </Button>
        <NotificationsPopover />
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link to="/subscriptions">
            <span className="text-xs">Plan</span>
            <ChevronDown className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
