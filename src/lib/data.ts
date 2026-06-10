import { supabase } from "@/integrations/supabase/client";

// Supabase types haven't been regenerated for the new tables yet,
// so we use a loosely-typed client here.
export const db = supabase as any;

export const currency = (n: number) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export type Product = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  sku: string | null;
  unit: string | null;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  created_at: string;
};

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
};

export type Sale = {
  id: string;
  user_id: string;
  invoice_no: string;
  customer_id: string | null;
  customer_name: string | null;
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  payment_method: string | null;
  status: string;
  sale_date: string;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  category: string;
  note: string | null;
  amount: number;
  expense_date: string;
  created_at: string;
};

export async function getUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
