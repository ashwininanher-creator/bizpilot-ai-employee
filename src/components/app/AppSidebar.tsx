import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, ShoppingCart, Receipt, Users, Package, Boxes,
  Wallet, BarChart3, Sparkles, CreditCard, Settings, LogOut,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

const main = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Products", url: "/products", icon: Package },
  { title: "Inventory", url: "/inventory", icon: Boxes },
  { title: "Expenses", url: "/expenses", icon: Wallet },
  { title: "Reports", url: "/reports", icon: BarChart3 },
] as const;

const more = [
  { title: "AI Assistant", url: "/ai-assistant", icon: Sparkles },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary shadow-glow shrink-0">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-semibold text-sm">BizPilot <span className="text-gradient">AI</span></div>
              <div className="text-[10px] text-muted-foreground">Your First AI Employee</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>More</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {more.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} tooltip="Sign out">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
